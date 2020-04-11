import Peer from "peerjs";

import { rand4 } from "../utils/crypto";
import { sleep } from "../utils/sleep";
import { Conn, isConnectedConn, getLivePeers } from "./peerUtils";

const SEED_PEERS = 5; // config
const guessSeed = (id: string) => Number(id.split("_")[1]) < SEED_PEERS;

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
  const id = `${roomId}_${peerId}`;
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

  const showConnectedStatus = (closedPeerId?: number) => {
    if (!myPeer) return;
    const peerIds = getLivePeers(myPeer)
      .map((id) => Number(id.split("_")[1]))
      .filter((peerId) => peerId !== closedPeerId);
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIds });
  };

  const connectPeer = (id: string) => {
    if (!myPeer) return;
    if (myPeer.id === id) return;
    const conns = myPeer.connections[id];
    const hasEffectiveConn = conns && conns.some(isConnectedConn);
    if (hasEffectiveConn) return;
    console.log(
      "connectPeer",
      id,
      conns &&
        conns.map(
          (c: Conn) => c.peerConnection && c.peerConnection.connectionState
        )
    );
    const conn = myPeer.connect(id, { serialization: "json" });
    initConnection(conn);
  };

  const broadcastData = (data: unknown) => {
    lastBroadcastData = data;
    if (myPeer) {
      Object.keys(myPeer.connections).forEach((key) => {
        if (!myPeer) return;
        const peers = getLivePeers(myPeer);
        myPeer.connections[key].forEach((conn: Conn) => {
          if (conn.open) {
            try {
              conn.send({ data, peers });
            } catch (e) {
              console.error("broadcastData", e);
            }
          }
        });
      });
    }
  };

  const handlePayload = (conn: Conn, payload: unknown) => {
    try {
      const peerId = Number(conn.peer.split("_")[1]);
      if (payload && typeof payload === "object") {
        receiveData(peerId, (payload as { data: unknown }).data);
        if (Array.isArray((payload as { peers: unknown }).peers)) {
          (payload as { peers: unknown[] }).peers.forEach((peer) => {
            if (typeof peer === "string" && peer.startsWith(`${roomId}_`)) {
              connectPeer(peer);
            }
          });
        }
      }
    } catch (e) {
      console.error("handlePayload", e);
    }
  };

  const initConnection = (conn: Conn) => {
    conn.on("open", () => {
      showConnectedStatus();
      if (myPeer && lastBroadcastData) {
        conn.send({
          data: lastBroadcastData,
          peers: getLivePeers(myPeer),
        });
      }
    });
    conn.on("data", (payload: unknown) => handlePayload(conn, payload));
    conn.on("close", async () => {
      console.log("dataConnection closed", conn);
      showConnectedStatus(Number(conn.peer.split("_")[1]));
      if (guessSeed(conn.peer)) reInitMyPeer(conn.peer);
    });
    conn.on("error", async (err: Error) => {
      console.error("dataConnection error", conn, err);
      showConnectedStatus(Number(conn.peer.split("_")[1]));
      if (guessSeed(conn.peer)) reInitMyPeer(conn.peer);
    });
  };

  const initMyPeer = async () => {
    if (myPeer) return;
    myPeer = await createMyPeer(0, roomId, updateNetworkStatus);
    myPeer.on("connection", (conn) => {
      console.log("new connection received", conn);
      const peerId = Number(conn.peer.split("_")[1]);
      updateNetworkStatus({ type: "NEW_CONNECTION", peerId });
      initConnection(conn);
    });
    updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
    for (let i = 0; i < SEED_PEERS; i += 1) {
      const id = `${roomId}_${i}`;
      connectPeer(id);
    }
  };
  initMyPeer();

  const reInitMyPeer = async (disconnectedId: string) => {
    if (!myPeer) return;
    if (guessSeed(myPeer.id)) return;
    const waitSec = 30 + Math.floor(Math.random() * 60);
    console.log(
      "Disconnected seed peer: " +
        disconnectedId.split("_")[1] +
        ", reinit in " +
        waitSec +
        "sec..."
    );
    await sleep(waitSec * 1000);
    if (!myPeer) return;
    if (guessSeed(myPeer.id)) return;
    let checkSeeds = true;
    for (let i = 0; i < SEED_PEERS; i += 1) {
      const id = `${roomId}_${i}`;
      const conns = myPeer.connections[id] || [];
      if (!conns.some(isConnectedConn)) {
        checkSeeds = false;
      }
    }
    if (checkSeeds) {
      showConnectedStatus();
      return;
    }
    myPeer.destroy();
    myPeer = null;
    initMyPeer();
  };

  const dispose = () => {
    if (myPeer) {
      myPeer.destroy();
      // do not set null
    }
  };

  return {
    broadcastData,
    dispose,
  };
};
