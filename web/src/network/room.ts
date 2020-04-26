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
type ReceiveTrack = (track: MediaStreamTrack, info: PeerInfo) => void;

export const createRoom = (
  roomId: string,
  userId: string,
  updateNetworkStatus: UpdateNetworkStatus,
  receiveData: ReceiveData,
  receiveTrack: ReceiveTrack
) => {
  let disposed = false;
  let myPeer: Peer | null = null;
  let lastBroadcastData: unknown | null = null;
  const connMap = createConnectionMap();
  let liveMode = false;
  let localStream: MediaStream | null = null;

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
    const conn = myPeer.connect(id, { serialization: "json" });
    initConnection(conn);
  };

  const broadcastData = (data: unknown, replaceLastData?: boolean) => {
    if (disposed) return;
    if (replaceLastData) {
      lastBroadcastData = data;
    }
    const peers = connMap.getConnectedPeerIds();
    connMap.forEachConnectedConns((conn) => {
      try {
        conn.send({ userId, data, peers, liveMode });
      } catch (e) {
        console.error("broadcastData", e);
      }
    });
  };

  const sendSDP = (conn: Peer.DataConnection, sdp: unknown) => {
    conn.send({ SDP: sdp });
  };

  const handleSDP = async (conn: Peer.DataConnection, sdp: unknown) => {
    if (!sdp || typeof sdp !== "object") return;
    if (typeof (sdp as { offer: unknown }).offer === "object") {
      const { offer } = sdp as { offer: object };
      try {
        await conn.peerConnection.setRemoteDescription(offer as any);
        const answer = await conn.peerConnection.createAnswer();
        await conn.peerConnection.setLocalDescription(answer);
        sendSDP(conn, { answer });
      } catch (e) {
        console.log("handleSDP offer failed", e);
      }
    } else if (typeof (sdp as { answer: unknown }).answer === "object") {
      const { answer } = sdp as { answer: object };
      try {
        await conn.peerConnection.setRemoteDescription(answer as any);
      } catch (e) {
        console.log("handleSDP answer failed", e);
      }
    } else {
      console.warn("unkonwn SDP", sdp);
    }
  };

  const handleUserId = (conn: Peer.DataConnection, payloadUserId: unknown) => {
    if (typeof payloadUserId === "string") {
      connMap.setUserId(conn, payloadUserId as string);
    }
  };

  const handleLiveMode = (
    conn: Peer.DataConnection,
    payloadLiveMode: unknown
  ) => {
    if (typeof payloadLiveMode === "boolean") {
      connMap.setLiveMode(conn, payloadLiveMode as boolean);
      if (payloadLiveMode) {
        // We need to delay because negotiation is in progress
        // FIXME there should be better way than timeout
        setTimeout(() => {
          addAllStreamTracks(conn);
        }, 3000);
      } else {
        // We need to delay because negotiation is in progress
        // FIXME there should be better way than timeout
        setTimeout(() => {
          removeAllStreamTracks(conn);
        }, 3000);
      }
    }
  };

  const handlePayload = (conn: Peer.DataConnection, payload: unknown) => {
    if (disposed) return;
    if (!payload && typeof payload !== "object") return;

    handleSDP(conn, (payload as { SDP?: unknown }).SDP);
    handleUserId(conn, (payload as { userId?: unknown }).userId);
    handleLiveMode(conn, (payload as { liveMode?: unknown }).liveMode);

    if (Array.isArray((payload as { peers?: unknown }).peers)) {
      (payload as { peers: unknown[] }).peers.forEach((peer) => {
        if (isValidPeerId(roomId, peer)) {
          connectPeer(peer);
        }
      });
    }

    const connUserId = connMap.getUserId(conn);
    if (connUserId) {
      const info: PeerInfo = {
        userId: connUserId,
        peerIndex: getPeerIndexFromConn(conn),
        liveMode: connMap.getLiveMode(conn),
      };
      try {
        receiveData((payload as { data: unknown }).data, info);
      } catch (e) {
        console.error("receiveData", e);
      }
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
          userId,
          data: lastBroadcastData,
          peers: connMap.getConnectedPeerIds(),
          liveMode,
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.peerConnection.addEventListener("negotiationneeded", async () => {
      if (!connMap.isConnected(conn.peer)) return;
      const offer = await conn.peerConnection.createOffer();
      await conn.peerConnection.setLocalDescription(offer);
      sendSDP(conn, { offer });
    });
    conn.peerConnection.addEventListener("track", (event: RTCTrackEvent) => {
      const connUserId = connMap.getUserId(conn);
      if (connUserId) {
        const info = {
          userId: connUserId,
          peerIndex: getPeerIndexFromPeerId(conn.peer),
          liveMode: connMap.getLiveMode(conn),
        };
        receiveTrack(event.track, info);
      }
    });
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
    const peer = new Peer(id, { debug: 2 });
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
    oldPeer.destroy();
    initMyPeer();
  };

  const enableLiveMode = () => {
    if (liveMode) {
      console.warn("liveMode already enabled");
      return;
    }
    liveMode = true;
    localStream = new MediaStream();
    broadcastData(lastBroadcastData);
  };

  const disableLiveMode = () => {
    if (!liveMode) {
      console.warn("liveMode already disabled");
      return;
    }
    liveMode = false;
    if (localStream) {
      localStream.getTracks().forEach(removeTrack);
    }
    localStream = null;
    broadcastData(lastBroadcastData);
  };

  const addTrack = (track: MediaStreamTrack) => {
    if (!localStream) return;
    localStream.addTrack(track);
    connMap.forEachLiveConns(async (conn) => {
      try {
        if (!localStream) return;
        conn.peerConnection.addTrack(track, localStream);
      } catch (e) {
        if (e.name === "InvalidAccessError") {
          // ignore
        } else {
          throw e;
        }
      }
    });
  };

  const removeTrack = (track: MediaStreamTrack) => {
    if (!localStream) return;
    localStream.removeTrack(track);
    connMap.forEachLiveConns(async (conn) => {
      const senders = conn.peerConnection.getSenders();
      const sender = senders.find((s) => s.track === track);
      if (sender) {
        conn.peerConnection.removeTrack(sender);
      }
    });
  };

  const addAllStreamTracks = (conn: Peer.DataConnection) => {
    if (!localStream) return;
    localStream.getTracks().forEach((track) => {
      try {
        if (!localStream) return;
        conn.peerConnection.addTrack(track, localStream);
      } catch (e) {
        if (e.name === "InvalidAccessError") {
          // ignore
        } else {
          throw e;
        }
      }
    });
  };

  const removeAllStreamTracks = (conn: Peer.DataConnection) => {
    if (!localStream) return;
    const senders = conn.peerConnection.getSenders();
    senders.forEach((sender) => {
      if (sender.track) {
        conn.peerConnection.removeTrack(sender);
      }
    });
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
    addTrack,
    removeTrack,
    dispose,
  };
};
