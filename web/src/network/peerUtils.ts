import Peer from "peerjs";

export const ROOM_ID_PREFIX_LEN = 32;

export const isValidPeerId = (
  roomId: string,
  peerId: unknown
): peerId is string =>
  typeof peerId === "string" &&
  peerId.startsWith(`${roomId.slice(0, ROOM_ID_PREFIX_LEN)} `);

export const generatePeerId = (roomId: string, peerIndex: number) =>
  `${roomId.slice(0, ROOM_ID_PREFIX_LEN)} ${peerIndex}`;

export const getPeerIndexFromPeerId = (peerId: string) =>
  Number(peerId.split(" ")[1]);

export const getPeerIndexFromConn = (conn: Peer.DataConnection) =>
  getPeerIndexFromPeerId(conn.peer);

export const createConnectionMap = () => {
  type Value = {
    conn: Peer.DataConnection;
    connected?: boolean;
    userId?: string;
    mediaTypes: string[];
  };
  const map = new Map<string, Value>();

  const addConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.conn.close();
    }
    map.set(conn.peer, { conn, mediaTypes: [] });
  };

  const markConnected = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.connected = true;
    }
  };

  const isConnected = (peerId: string) => {
    const value = map.get(peerId);
    return (value && value.connected) || false;
  };

  const setUserId = (conn: Peer.DataConnection, userId: string) => {
    const value = map.get(conn.peer);
    if (value) {
      value.userId = userId;
    }
  };

  const getUserId = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    return value && value.userId;
  };

  const setMediaTypes = (conn: Peer.DataConnection, mediaTypes: string[]) => {
    const value = map.get(conn.peer);
    if (value) {
      value.mediaTypes = mediaTypes;
    }
  };

  const getMediaTypes = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    return (value && value.mediaTypes) || [];
  };

  const hasConn = (peerId: string) => map.has(peerId);

  const getConn = (peerId: string) => {
    const value = map.get(peerId);
    if (!value) return null;
    return value.conn;
  };

  const delConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
    }
  };

  const getConnectedPeerIds = () =>
    Array.from(map.keys()).filter((k) => map.get(k)?.connected);

  const forEachConnectedConns = (
    callback: (conn: Peer.DataConnection) => void
  ) => {
    Array.from(map.values()).forEach((value) => {
      if (value.connected) {
        callback(value.conn);
      }
    });
  };

  const forEachConnsAcceptingMedia = (
    mediaType: string,
    callback: (conn: Peer.DataConnection) => void
  ) => {
    Array.from(map.values()).forEach((value) => {
      if (
        value.connected &&
        value.mediaTypes &&
        value.mediaTypes.includes(mediaType)
      ) {
        callback(value.conn);
      }
    });
  };

  const clearAll = () => {
    if (map.size) {
      console.log("connectionMap garbage:", map);
    }
    map.clear();
  };

  return {
    addConn,
    markConnected,
    isConnected,
    setUserId,
    getUserId,
    setMediaTypes,
    getMediaTypes,
    hasConn,
    getConn,
    delConn,
    getConnectedPeerIds,
    forEachConnectedConns,
    forEachConnsAcceptingMedia,
    clearAll,
  };
};
