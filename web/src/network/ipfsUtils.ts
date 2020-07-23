import { sha256 } from "../utils/crypto";
import { ROOM_ID_PREFIX_LEN } from "./common";

let peerIndexCounter = 0;

const getNextPeerIndex = () => {
  peerIndexCounter += 1;
  return peerIndexCounter;
};

const topicsForMediaTypes = new Map<string, string>();

export const getTopicForMediaType = async (
  roomId: string,
  mediaType: string
) => {
  const key = `${roomId} ${mediaType}`;
  let topic = topicsForMediaTypes.get(key);
  if (!topic) {
    topic = (await sha256(key)).slice(0, ROOM_ID_PREFIX_LEN);
    topicsForMediaTypes.set(key, topic);
  }
  return topic;
};

export type Connection = {
  peerIndex: number;
  peer: string; // ipfsId
  userId: string;
  sendPc: RTCPeerConnection;
  recvPc: RTCPeerConnection;
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
    mediaTypes: string[];
  };
  const map = new Map<string, Value>();

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

  const addConn = (peerId: string, userId: string) => {
    const value = map.get(peerId);
    if (value) {
      throw new Error("addConn: already exists");
    }
    const conn: Connection = {
      peerIndex: getNextPeerIndex(),
      peer: peerId,
      userId,
      sendPc: new RTCPeerConnection(DEFAULT_CONFIG),
      recvPc: new RTCPeerConnection(DEFAULT_CONFIG),
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
      conn.sendPc.close();
      conn.recvPc.close();
    } else {
      throw new Error("delConn: does not exist");
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
