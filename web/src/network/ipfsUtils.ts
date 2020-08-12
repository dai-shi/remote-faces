import { hasObjectProp, hasStringProp } from "../utils/types";

let peerIndexCounter = 0;

const getNextPeerIndex = () => {
  peerIndexCounter += 1;
  return peerIndexCounter;
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
    acceptingMediaTypes: string[];
    remoteMediaTypes: Record<string, string>; // key = mid
  };
  const map = new Map<string, Value>();

  const setAcceptingMediaTypes = (conn: Connection, mediaTypes: string[]) => {
    const value = map.get(conn.peer);
    if (value) {
      value.acceptingMediaTypes = mediaTypes;
    }
  };

  const getAcceptingMediaTypes = (conn: Connection) => {
    const value = map.get(conn.peer);
    if (!value) return [];
    return value.acceptingMediaTypes;
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
    map.set(conn.peer, {
      conn,
      acceptingMediaTypes: [],
      remoteMediaTypes: {},
    });
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
      if (value.acceptingMediaTypes.includes(mediaType)) {
        callback(value.conn);
      }
    });
  };

  const size = () => map.size;

  const getRemoteMediaType = (conn: Connection, mid: string) => {
    const value = map.get(conn.peer);
    if (!value) return null;
    return value.remoteMediaTypes[mid] || null;
  };

  const registerRemoteMediaTypeFromSDP = (
    conn: Connection,
    msid2mediaType: Record<string, unknown>,
    sdpLines: string
  ) => {
    const value = map.get(conn.peer);
    if (!value) return;
    const lines = sdpLines.split(/[\r\n]+/);
    let mid: string;
    lines.forEach((line) => {
      if (line.startsWith("a=mid:")) {
        mid = line.slice("a=mid:".length);
      } else if (line.startsWith("a=msid:")) {
        const arr = line.slice("a=msid:".length).split(" ");
        arr.forEach((msid) => {
          const mediaType = msid2mediaType[msid];
          if (typeof mediaType === "string") {
            value.remoteMediaTypes[mid] = mediaType;
          }
        });
      }
    });
  };

  const registerRemoteMediaType = (
    conn: Connection,
    sdp: Record<string, unknown>
  ) => {
    if (!hasObjectProp(sdp, "msid2mediaType")) return;
    if (hasObjectProp(sdp, "offer") && hasStringProp(sdp.offer, "sdp")) {
      registerRemoteMediaTypeFromSDP(conn, sdp.msid2mediaType, sdp.offer.sdp);
    }
    if (hasObjectProp(sdp, "answer") && hasStringProp(sdp.answer, "sdp")) {
      registerRemoteMediaTypeFromSDP(conn, sdp.msid2mediaType, sdp.answer.sdp);
    }
  };

  return {
    setAcceptingMediaTypes,
    getAcceptingMediaTypes,
    addConn,
    getConn,
    findConn,
    delConn,
    getPeerIndexList,
    forEachConns,
    forEachConnsAcceptingMedia,
    size,
    getRemoteMediaType,
    registerRemoteMediaType,
  };
};
