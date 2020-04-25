import Peer from "peerjs";

import { rand4 } from "../utils/crypto";
import {
  isValidPeerId,
  generatePeerId,
  getPeerIndexFromPeerId,
  getPeerIndexFromConn,
  createConnectionMap,
} from "./peerUtils";

const MIN_SEED_PEER_INDEX = 10; // config
const MAX_SEED_PEER_INDEX = 14; // config
const guessSeed = (id: string) => {
  const peerIndex = getPeerIndexFromPeerId(id);
  return MIN_SEED_PEER_INDEX <= peerIndex && peerIndex <= MAX_SEED_PEER_INDEX;
};

export type NetworkStatus =
  | { type: "CONNECTING_SEED_PEERS" }
  | { type: "NEW_CONNECTION"; peerIndex: number }
  | { type: "CONNECTION_CLOSED"; peerIndex: number }
  | { type: "INITIALIZING_PEER"; peerIndex: number }
  | { type: "RECONNECTING" }
  | { type: "UNKNOWN_ERROR" }
  | { type: "CONNECTED_PEERS"; peerIndexList: number[] };

type UpdateNetworkStatus = (status: NetworkStatus) => void;

export type PeerInfo = { userId: string; peerIndex: number; liveMode: boolean };
type ReceiveData = (data: unknown, info: PeerInfo) => void;
export type ReceiveStream = (
  stream: MediaStream | null, // null for removing stream
  info: Omit<PeerInfo, "liveMode">
) => void;

export const createRoom = (
  roomId: string,
  userId: string,
  myStream: MediaStream,
  updateNetworkStatus: UpdateNetworkStatus,
  receiveData: ReceiveData,
  receiveStream: ReceiveStream
) => {
  let disposed = false;
  let myPeer: Peer | null = null;
  let lastBroadcastData: unknown | null = null;
  const connMap = createConnectionMap();
  let liveMode = false;

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIndexList = connMap
      .getConnectedPeerIds()
      .map(getPeerIndexFromPeerId);
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
  };

  const connectPeer = (id: string) => {
    if (disposed) return;
    if (!myPeer || myPeer.id === id) return;
    if (connMap.hasConn(id)) return;
    console.log("connectPeer", id);
    const conn = myPeer.connect(id, {
      serialization: "json",
      metadata: { userId },
    });
    initConnection(conn);
  };

  const broadcastData = (data: unknown, replaceLastData?: boolean) => {
    if (disposed) return;
    if (replaceLastData) {
      lastBroadcastData = data;
    }
    const peers = connMap.getConnectedPeerIds();
    const livePeers = connMap.getLivePeerIds();
    connMap.forEachConnectedConns((conn) => {
      try {
        conn.send({ data, peers, liveMode, livePeers });
      } catch (e) {
        console.error("broadcastData", e);
      }
    });
  };

  const handlePayload = (conn: Peer.DataConnection, payload: unknown) => {
    if (disposed) return;
    try {
      if (payload && typeof payload === "object") {
        const info: PeerInfo = {
          userId: String(conn.metadata.userId),
          peerIndex: getPeerIndexFromConn(conn),
          liveMode: !!(payload as { liveMode?: unknown }).liveMode,
        };
        receiveData((payload as { data: unknown }).data, info);
        if (Array.isArray((payload as { peers: unknown }).peers)) {
          (payload as { peers: unknown[] }).peers.forEach((peer) => {
            if (isValidPeerId(roomId, peer)) {
              connectPeer(peer);
            }
          });
        }
        if (liveMode) {
          if (info.liveMode && isValidPeerId(roomId, conn.peer)) {
            setTimeout(() => {
              // XXX I don't know why it only works with setTimeout
              callPeer(conn.peer);
            }, 1000);
          }
          if (Array.isArray((payload as { livePeers: unknown }).livePeers)) {
            (payload as { livePeers: unknown[] }).livePeers.forEach((peer) => {
              if (isValidPeerId(roomId, peer)) {
                callPeer(peer);
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("handlePayload", e);
    }
  };

  const initConnection = (conn: Peer.DataConnection) => {
    if (connMap.isConnected(conn.peer)) {
      conn.close();
      return;
    }
    connMap.addConn(conn);
    conn.on("open", () => {
      connMap.markConnected(conn);
      showConnectedStatus();
      if (lastBroadcastData) {
        conn.send({
          data: lastBroadcastData,
          peers: connMap.getConnectedPeerIds(),
          liveMode,
          livePeers: connMap.getLivePeerIds(),
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.on("close", () => {
      connMap.delConn(conn);
      console.log("dataConnection closed", conn);
      updateNetworkStatus({
        type: "CONNECTION_CLOSED",
        peerIndex: getPeerIndexFromConn(conn),
      });
      showConnectedStatus();
      if (connMap.getConnectedPeerIds().length === 0) {
        reInitMyPeer(true);
      } else if (
        guessSeed(conn.peer) &&
        myPeer &&
        !myPeer.disconnected &&
        !guessSeed(myPeer.id)
      ) {
        const waitSec = 30 + Math.floor(Math.random() * 60);
        console.log(
          `Disconnected seed peer: ${getPeerIndexFromPeerId(
            conn.peer
          )}, reinit in ${waitSec}sec...`
        );
        setTimeout(reInitMyPeer, waitSec * 1000);
      }
    });
  };

  const initMyPeer = (index = MIN_SEED_PEER_INDEX) => {
    if (disposed) return;
    if (myPeer) return;
    connMap.clearAll();
    const isSeed = MIN_SEED_PEER_INDEX <= index && index <= MAX_SEED_PEER_INDEX;
    const peerIndex = isSeed ? index : rand4();
    updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex });
    const id = generatePeerId(roomId, peerIndex);
    console.log("initMyPeer start", index, id);
    const peer = new Peer(id);
    myPeer = peer;
    peer.on("open", () => {
      myPeer = peer;
      if (process.env.NODE_ENV !== "production") {
        (window as any).myPeer = myPeer;
      }
      updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
      for (let i = MIN_SEED_PEER_INDEX; i <= MAX_SEED_PEER_INDEX; i += 1) {
        const seedId = generatePeerId(roomId, i);
        connectPeer(seedId);
      }
    });
    peer.on("error", (err) => {
      if (err.type === "unavailable-id") {
        myPeer = null;
        lastBroadcastData = null;
        peer.destroy();
        initMyPeer(index + 1);
      } else if (err.type === "peer-unavailable") {
        // ignore
      } else if (err.type === "network") {
        console.log("initMyPeer network error", index, err);
        peer.destroy();
      } else {
        console.error("initMyPeer", index, err.type, err);
        updateNetworkStatus({ type: "UNKNOWN_ERROR" });
      }
    });
    peer.on("connection", (conn) => {
      if (myPeer !== peer) {
        conn.close();
        return;
      }
      console.log("new connection received", conn);
      updateNetworkStatus({
        type: "NEW_CONNECTION",
        peerIndex: getPeerIndexFromConn(conn),
      });
      initConnection(conn);
    });
    peer.on("call", (media) => {
      if (myPeer !== peer || !liveMode) {
        media.close();
        return;
      }
      console.log("new media received", media);
      if (initMedia(media)) {
        media.answer(myStream);
      }
    });
    peer.on("disconnected", () => {
      console.log("initMyPeer disconnected", index);
      setTimeout(() => {
        if (myPeer === peer && !peer.destroyed) {
          console.log("initMyPeer reconnecting", index);
          updateNetworkStatus({ type: "RECONNECTING" });
          peer.reconnect();
        }
      }, 5 * 1000);
    });
    peer.on("close", () => {
      if (myPeer === peer) {
        console.log("initMyPeer closed, re-initializing", index);
        myPeer = null;
        lastBroadcastData = null;
        setTimeout(initMyPeer, 10 * 1000);
      } else {
        console.log("initMyPeer closed, ignoring", index);
      }
    });
  };
  initMyPeer();

  const reInitMyPeer = (force?: boolean) => {
    if (!myPeer) return;
    if (myPeer.disconnected) return; // should already be handled
    if (!force) {
      if (guessSeed(myPeer.id)) return;
      let existsAllSeeds = true;
      for (let i = MIN_SEED_PEER_INDEX; i <= MAX_SEED_PEER_INDEX; i += 1) {
        const id = generatePeerId(roomId, i);
        if (!connMap.isConnected(id)) {
          existsAllSeeds = false;
          break;
        }
      }
      if (existsAllSeeds) {
        showConnectedStatus();
        return;
      }
    }
    const oldPeer = myPeer;
    myPeer = null;
    lastBroadcastData = null;
    oldPeer.destroy();
    initMyPeer();
  };

  const callPeer = (id: string) => {
    if (disposed) return;
    if (!myPeer || myPeer.id === id) return;
    if (!liveMode) return;
    if (!connMap.isConnected(id)) return;
    if (connMap.getMedia(id)) return;
    console.log("callPeer", id);
    const media = myPeer.call(id, myStream, { metadata: { userId } });
    initMedia(media);
  };

  const initMedia = (media: Peer.MediaConnection) => {
    const prevMedia = connMap.getMedia(media.peer);
    if (prevMedia) {
      if (
        myPeer &&
        getPeerIndexFromPeerId(myPeer.id) > getPeerIndexFromPeerId(media.peer)
      ) {
        console.log("my peer id is bigger, closing media", media);
        media.close();
        return false;
      }
      console.log("closing prevMedia", prevMedia);
      connMap.delMedia(prevMedia);
      prevMedia.close();
    }
    console.log("init media", media);
    connMap.setMedia(media);
    media.on("stream", (stream: MediaStream) => {
      console.log("mediaConnection received stream", media);
      const info = {
        userId: String(media.metadata.userId),
        peerIndex: getPeerIndexFromPeerId(media.peer),
      };
      receiveStream(stream, info);
    });
    media.on("close", () => {
      console.log("mediaConnection closed", media);
      const info = {
        userId: String(media.metadata.userId),
        peerIndex: getPeerIndexFromPeerId(media.peer),
      };
      receiveStream(null, info);
      connMap.delMedia(media);
    });
    return true;
  };

  const enableLiveMode = () => {
    if (liveMode) {
      console.warn("liveMode already enabled");
      return;
    }
    liveMode = true;
    broadcastData(lastBroadcastData);
    connMap.forEachLiveConns((conn) => {
      callPeer(conn.peer);
    });
  };

  const disableLiveMode = () => {
    if (!liveMode) {
      console.warn("liveMode already disabled");
      return;
    }
    liveMode = false;
    broadcastData(lastBroadcastData);
    connMap.closeAllMedia();
  };

  const dispose = () => {
    disposed = true;
    if (myPeer) {
      myPeer.destroy();
    }
  };

  return {
    broadcastData,
    enableLiveMode,
    disableLiveMode,
    dispose,
  };
};
