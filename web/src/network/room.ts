import Peer from "peerjs";

import { rand4 } from "../utils/crypto";
import {
  isValidPeerJsId,
  generatePeerJsId,
  getPeerIdFromPeerJsId,
  getPeerIdFromConn,
  createConnectionMap,
} from "./peerUtils";

const SEED_PEERS = 5; // config
const guessSeed = (id: string) => getPeerIdFromPeerJsId(id) < SEED_PEERS;

export type NetworkStatus =
  | { type: "CONNECTING_SEED_PEERS" }
  | { type: "NEW_CONNECTION"; peerId: number }
  | { type: "CONNECTION_CLOSED"; peerId: number }
  | { type: "INITIALIZING_PEER"; index: number }
  | { type: "RECONNECTING" }
  | { type: "UNKNOWN_ERROR" }
  | { type: "CONNECTED_PEERS"; peerIds: number[] };

type UpdateNetworkStatus = (status: NetworkStatus) => void;

type ReceiveData = (
  data: unknown,
  info: { peerId: number; liveMode: boolean }
) => void;
type ReceiveStream = (
  stream: MediaStream | null, // null for removing stream
  info: { peerId: number },
  close?: () => void
) => void;

export const createRoom = (
  roomId: string,
  updateNetworkStatus: UpdateNetworkStatus,
  receiveData: ReceiveData
) => {
  let disposed = false;
  let myPeer: Peer | null = null;
  let lastBroadcastData: unknown | null = null;
  const connMap = createConnectionMap();
  let liveMode = false;
  let myStream: MediaStream | null = null;
  let receiveStream: ReceiveStream | null = null;

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIds = connMap.getConnectedPeerJsIds().map(getPeerIdFromPeerJsId);
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIds });
  };

  const connectPeer = (id: string) => {
    if (disposed) return;
    if (!myPeer || myPeer.id === id) return;
    if (connMap.hasConn(id)) return;
    console.log("connectPeer", id);
    const conn = myPeer.connect(id, { serialization: "json" });
    initConnection(conn);
  };

  const broadcastData = (data: unknown, replaceLastData?: boolean) => {
    if (disposed) return;
    if (replaceLastData) {
      lastBroadcastData = data;
    }
    const peers = connMap.getConnectedPeerJsIds();
    const livePeers = connMap.getLivePeerJsIds();
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
        const info = {
          peerId: getPeerIdFromConn(conn),
          liveMode: !!(payload as { liveMode?: unknown }).liveMode,
        };
        receiveData((payload as { data: unknown }).data, info);
        if (Array.isArray((payload as { peers: unknown }).peers)) {
          (payload as { peers: unknown[] }).peers.forEach((peer) => {
            if (isValidPeerJsId(roomId, peer)) {
              connectPeer(peer);
            }
          });
        }
        if (liveMode) {
          if (info.liveMode && isValidPeerJsId(roomId, conn.peer)) {
            setTimeout(() => {
              // XXX I don't know why it only works with setTimeout
              callPeer(conn.peer);
            }, 1000);
          }
          if (Array.isArray((payload as { livePeers: unknown }).livePeers)) {
            (payload as { livePeers: unknown[] }).livePeers.forEach((peer) => {
              if (isValidPeerJsId(roomId, peer)) {
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
          peers: connMap.getConnectedPeerJsIds(),
          liveMode,
          livePeers: connMap.getLivePeerJsIds(),
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.on("close", () => {
      connMap.delConn(conn);
      console.log("dataConnection closed", conn);
      updateNetworkStatus({
        type: "CONNECTION_CLOSED",
        peerId: getPeerIdFromConn(conn),
      });
      showConnectedStatus();
      if (connMap.getConnectedPeerJsIds().length === 0) {
        reInitMyPeer(true);
      } else if (
        guessSeed(conn.peer) &&
        myPeer &&
        !myPeer.disconnected &&
        !guessSeed(myPeer.id)
      ) {
        const waitSec = 30 + Math.floor(Math.random() * 60);
        console.log(
          `Disconnected seed peer: ${getPeerIdFromPeerJsId(
            conn.peer
          )}, reinit in ${waitSec}sec...`
        );
        setTimeout(reInitMyPeer, waitSec * 1000);
      }
    });
  };

  const initMyPeer = (index = 0) => {
    if (disposed) return;
    if (myPeer) return;
    connMap.clearAll();
    updateNetworkStatus({ type: "INITIALIZING_PEER", index });
    const isSeed = index < SEED_PEERS;
    const peerId = isSeed ? index : rand4();
    const id = generatePeerJsId(roomId, peerId);
    console.log("initMyPeer start", index, id);
    const peer = new Peer(id);
    myPeer = peer;
    peer.on("open", () => {
      myPeer = peer;
      if (process.env.NODE_ENV !== "production") {
        (window as any).myPeer = myPeer;
      }
      updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
      for (let i = 0; i < SEED_PEERS; i += 1) {
        const seedId = generatePeerJsId(roomId, i);
        connectPeer(seedId);
      }
    });
    peer.on("error", (err) => {
      if (err.type === "unavailable-id") {
        myPeer = null;
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
        peerId: getPeerIdFromConn(conn),
      });
      initConnection(conn);
    });
    peer.on("call", (media) => {
      if (myPeer !== peer || !myStream) {
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
      const existsAllSeeds = Array.from(Array(SEED_PEERS).keys()).every((i) => {
        const id = generatePeerJsId(roomId, i);
        return connMap.isConnected(id);
      });
      if (existsAllSeeds) {
        showConnectedStatus();
        return;
      }
    }
    const oldPeer = myPeer;
    myPeer = null;
    oldPeer.destroy();
    initMyPeer();
  };

  const callPeer = (id: string) => {
    if (disposed) return;
    if (!myPeer || myPeer.id === id) return;
    if (!myStream) return;
    if (!connMap.isConnected(id)) return;
    if (connMap.getMedia(id)) return;
    console.log("callPeer", id);
    const media = myPeer.call(id, myStream);
    initMedia(media);
  };

  const initMedia = (media: Peer.MediaConnection) => {
    const prevMedia = connMap.getMedia(media.peer);
    if (prevMedia) {
      if (
        myPeer &&
        getPeerIdFromPeerJsId(myPeer.id) > getPeerIdFromPeerJsId(media.peer)
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
        peerId: getPeerIdFromPeerJsId(media.peer),
      };
      if (receiveStream) receiveStream(stream, info, () => media.close());
    });
    media.on("close", () => {
      console.log("mediaConnection closed", media);
      const info = {
        peerId: getPeerIdFromPeerJsId(media.peer),
      };
      if (receiveStream) receiveStream(null, info);
      connMap.delMedia(media);
    });
    return true;
  };

  const enableLiveMode = (stream: MediaStream, recvStream: ReceiveStream) => {
    if (liveMode) {
      console.warn("liveMode already enabled");
      return;
    }
    liveMode = true;
    myStream = stream;
    receiveStream = recvStream;
    broadcastData(null);
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
    myStream = null;
    receiveStream = null;
    broadcastData(null);
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
