let peerIndexCounter = 0;

const getNextPeerIndex = () => {
  peerIndexCounter += 1;
  return peerIndexCounter;
};

export type Connection = {
  peerIndex: number;
  peer: string; // ipfsId
  peerConnection: RTCPeerConnection;
};

const DEFAULT_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:0.peerjs.com:3478",
      username: "peerjs",
      credential: "peerjsp",
    },
  ],
  sdpSemantics: "unified-plan",
};

export const createConnectionMap = () => {
  type Value = {
    conn: Connection;
    userId?: string;
    mediaTypes: string[];
  };
  const map = new Map<string, Value>();

  const setUserId = (conn: Connection, userId: string) => {
    const value = map.get(conn.peer);
    if (value) {
      value.userId = userId;
    }
  };

  const getUserId = (conn: Connection) => {
    const value = map.get(conn.peer);
    return value && value.userId;
  };

  const setMediaTypes = (conn: Connection, mediaTypes: string[]) => {
    const value = map.get(conn.peer);
    if (value) {
      value.mediaTypes = mediaTypes;
    }
  };

  const getMediaTypes = (conn: Connection) => {
    const value = map.get(conn.peer);
    return (value && value.mediaTypes) || [];
  };

  const addConn = (peerId: string) => {
    const value = map.get(peerId);
    if (value) {
      throw new Error("addConn: already exists");
    }
    const conn: Connection = {
      peerIndex: getNextPeerIndex(),
      peer: peerId,
      peerConnection: new RTCPeerConnection(DEFAULT_CONFIG),
    };
    map.set(conn.peer, { conn, mediaTypes: [] });
    return conn;
  };

  const getConn = (peerId: string) => {
    const value = map.get(peerId);
    if (!value) return null;
    return value.conn;
  };

  const findConn = (peerIndex: number) => {
    const value = Array.from(map.values()).find(
      (v) => v.conn.peerIndex === peerIndex
    );
    if (value) return value.conn;
    return null;
  };

  const delConn = (conn: Connection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
      conn.peerConnection.close();
    }
  };

  const getPeerIndexList = () =>
    Array.from(map.values()).map((v) => v.conn.peerIndex);

  const forEachConns = (callback: (conn: Connection) => void) => {
    Array.from(map.values()).forEach((value) => {
      callback(value.conn);
    });
  };

  const forEachConnsAcceptingMedia = (
    mediaType: string,
    callback: (conn: Connection) => void
  ) => {
    Array.from(map.values()).forEach((value) => {
      if (value.mediaTypes && value.mediaTypes.includes(mediaType)) {
        callback(value.conn);
      }
    });
  };

  const size = () => map.size;

  return {
    setUserId,
    getUserId,
    setMediaTypes,
    getMediaTypes,
    addConn,
    getConn,
    findConn,
    delConn,
    getPeerIndexList,
    forEachConns,
    forEachConnsAcceptingMedia,
    size,
  };
};
