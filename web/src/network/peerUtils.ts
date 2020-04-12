import Peer from "peerjs";

export const isValidPeerJsId = (
  roomId: string,
  peerJsId: unknown
): peerJsId is string =>
  typeof peerJsId === "string" && peerJsId.startsWith(`${roomId}_`);

export const generatePeerJsId = (roomId: string, peerId: number) =>
  `${roomId}_${peerId}`;

export const getPeerIdFromPeerJsId = (peerJsId: string) =>
  Number(peerJsId.split("_")[1]);

export const getPeerIdFromConn = (conn: Peer.DataConnection) =>
  getPeerIdFromPeerJsId(conn.peer);

export const createConnectionMap = () => {
  type Value = {
    conn: Peer.DataConnection;
    live: boolean;
  };
  const map = new Map<string, Value>();
  const addConn = (conn: Peer.DataConnection) => {
    map.set(conn.peer, { conn, live: false });
  };
  const markLive = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.live = true;
    }
  };
  const isLive = (peerJsId: string) => {
    const value = map.get(peerJsId);
    return value ? value.live : false;
  };
  const hasConn = (peerJsId: string) => map.has(peerJsId);
  const delConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
    }
  };
  const getLivePeerJsIds = () =>
    Array.from(map.keys()).filter((k) => map.get(k)?.live);
  const forEachLiveConns = (callback: (conn: Peer.DataConnection) => void) => {
    Array.from(map.values()).forEach((value) => {
      if (value.live) {
        callback(value.conn);
      }
    });
  };
  return {
    addConn,
    markLive,
    isLive,
    hasConn,
    delConn,
    getLivePeerJsIds,
    forEachLiveConns,
  };
};
