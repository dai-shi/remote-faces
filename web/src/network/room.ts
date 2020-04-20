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
  | { type: "INITIALIZING_PEER"; index: number }
  | { type: "RECONNECTING" }
  | { type: "UNKNOWN_ERROR" }
  | { type: "CONNECTED_PEERS"; peerIds: number[] };

type UpdateNetworkStatus = (status: NetworkStatus) => void;

type ReceiveData = (peerId: number, data: unknown) => void;

export const createRoom = (
  roomId: string,
  updateNetworkStatus: UpdateNetworkStatus,
  receiveData: ReceiveData
) => {
  let disposed = false;
  let myPeer: Peer | null = null;
  let lastBroadcastData: unknown | null = null;
  const connMap = createConnectionMap();

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
    connMap.forEachConnectedConns((conn) => {
      try {
        conn.send({ data, peers });
      } catch (e) {
        console.error("broadcastData", e);
      }
    });
  };

  const handlePayload = (conn: Peer.DataConnection, payload: unknown) => {
    if (disposed) return;
    try {
      const peerId = getPeerIdFromConn(conn);
      if (payload && typeof payload === "object") {
        receiveData(peerId, (payload as { data: unknown }).data);
        if (Array.isArray((payload as { peers: unknown }).peers)) {
          (payload as { peers: unknown[] }).peers.forEach((peer) => {
            if (isValidPeerJsId(roomId, peer)) {
              connectPeer(peer);
            }
          });
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
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.on("close", () => {
      connMap.delConn(conn);
      console.log("dataConnection closed", conn);
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
      console.log("new connection received", conn);
      updateNetworkStatus({
        type: "NEW_CONNECTION",
        peerId: getPeerIdFromConn(conn),
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

  const dispose = () => {
    disposed = true;
    if (myPeer) {
      myPeer.destroy();
    }
  };

  return {
    broadcastData,
    dispose,
  };
};
