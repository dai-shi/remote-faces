import Peer from "peerjs";

import { rand4 } from "../utils/crypto";
import { sleep } from "../utils/sleep";
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
  | { type: "NETWORK_ERROR" }
  | { type: "UNKNOWN_ERROR" }
  | { type: "CONNECTED_PEERS"; peerIds: number[] };

type UpdateNetworkStatus = (status: NetworkStatus) => void;

type ReceiveData = (peerId: number, data: unknown) => void;

const createMyPeer = (
  index: number,
  roomId: string,
  updateNetworkStatus: UpdateNetworkStatus
): Promise<Peer> => {
  updateNetworkStatus({ type: "INITIALIZING_PEER", index });
  const isSeed = index < SEED_PEERS;
  const peerId = isSeed ? index : rand4();
  const id = generatePeerJsId(roomId, peerId);
  console.log("createMyPeer", index, id);
  const peer = new Peer(id);
  return new Promise((resolve) => {
    peer.on("open", () => {
      resolve(peer);
    });
    peer.on("error", (err) => {
      if (err.type === "unavailable-id") {
        peer.destroy();
        createMyPeer(index + 1, roomId, updateNetworkStatus).then(resolve);
      } else if (err.type === "peer-unavailable") {
        // ignore
      } else if (err.type === "network") {
        console.log("createMyPeer network error", err);
        updateNetworkStatus({ type: "NETWORK_ERROR" });
      } else {
        console.error("createMyPeer", err.type, err);
        updateNetworkStatus({ type: "UNKNOWN_ERROR" });
      }
    });
  });
};

export const createRoom = (
  roomId: string,
  updateNetworkStatus: UpdateNetworkStatus,
  receiveData: ReceiveData
) => {
  let myPeer: Peer | null = null;
  let lastBroadcastData: unknown | null = null;
  const connMap = createConnectionMap();

  const showConnectedStatus = () => {
    if (!myPeer) return;
    const peerIds = connMap.getLivePeerJsIds().map(getPeerIdFromPeerJsId);
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIds });
  };

  const connectPeer = (id: string) => {
    if (!myPeer) return;
    if (myPeer.id === id) return;
    if (connMap.hasConn(id)) return;
    console.log("connectPeer", id);
    const conn = myPeer.connect(id, { serialization: "json" });
    connMap.addConn(conn);
    initConnection(conn);
  };

  const broadcastData = (data: unknown) => {
    lastBroadcastData = data;
    if (!myPeer) return;
    const peers = connMap.getLivePeerJsIds();
    connMap.forEachLiveConns((conn) => {
      try {
        conn.send({ data, peers });
      } catch (e) {
        console.error("broadcastData", e);
      }
    });
  };

  const handlePayload = (conn: Peer.DataConnection, payload: unknown) => {
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
    conn.on("open", () => {
      connMap.markLive(conn);
      showConnectedStatus();
      if (myPeer && lastBroadcastData) {
        conn.send({
          data: lastBroadcastData,
          peers: connMap.getLivePeerJsIds(),
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.on("close", async () => {
      connMap.delConn(conn);
      console.log("dataConnection closed", conn);
      showConnectedStatus();
      if (guessSeed(conn.peer)) reInitMyPeer(conn.peer);
    });
  };

  const initMyPeer = async () => {
    if (myPeer) return;
    myPeer = await createMyPeer(0, roomId, updateNetworkStatus);
    if (process.env.NODE_ENV !== "production") {
      (window as any).myPeer = myPeer;
    }
    myPeer.on("connection", (conn) => {
      console.log("new connection received", conn);
      const peerId = getPeerIdFromConn(conn);
      updateNetworkStatus({ type: "NEW_CONNECTION", peerId });
      connMap.addConn(conn);
      initConnection(conn);
      connMap.markLive(conn);
    });
    updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
    for (let i = 0; i < SEED_PEERS; i += 1) {
      const id = generatePeerJsId(roomId, i);
      connectPeer(id);
    }
  };
  initMyPeer();

  const reInitMyPeer = async (disconnectedId: string) => {
    if (!myPeer) return;
    if (guessSeed(myPeer.id)) return;
    const waitSec = 30 + Math.floor(Math.random() * 60);
    console.log(
      `Disconnected seed peer: ${getPeerIdFromPeerJsId(
        disconnectedId
      )}, reinit in ${waitSec}sec...`
    );
    await sleep(waitSec * 1000);
    if (!myPeer) return;
    if (guessSeed(myPeer.id)) return;
    const existsAllSeeds = Array.from(Array(SEED_PEERS).keys()).every((i) => {
      const id = generatePeerJsId(roomId, i);
      return connMap.isLive(id);
    });
    if (existsAllSeeds) {
      showConnectedStatus();
      return;
    }
    const oldPeer = myPeer;
    myPeer = null;
    oldPeer.destroy();
    initMyPeer();
  };

  const dispose = () => {
    if (myPeer) {
      const oldPeer = myPeer;
      myPeer = null;
      oldPeer.destroy();
    }
  };

  return {
    broadcastData,
    dispose,
  };
};
