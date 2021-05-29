import Peer from "peerjs";

import { ROOM_ID_PREFIX_LEN } from "./common";
import { hasObjectProp, hasStringProp } from "../utils/types";

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
    createdAt: number;
    connected?: boolean;
    userId?: string;
    acceptingMediaTypes: string[];
    remoteMediaTypes: Record<string, string>; // key = mid
  };
  const map = new Map<string, Value>();

  const setAcceptingMediaTypes = (
    conn: Peer.DataConnection,
    mediaTypes: string[]
  ) => {
    const value = map.get(conn.peer);
    if (value) {
      value.acceptingMediaTypes = mediaTypes;
    }
  };

  const getAcceptingMediaTypes = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (!value) return [];
    return value.acceptingMediaTypes;
  };

  const addConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    map.set(conn.peer, {
      conn,
      createdAt: Date.now(),
      acceptingMediaTypes: [],
      remoteMediaTypes: {},
    });
    if (value) {
      value.conn.close();
    }
  };

  const markConnected = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      value.connected = true;
    }
  };

  const isConnectedPeerId = (peerId: string) => {
    const value = map.get(peerId);
    return (value && value.connected) || false;
  };

  const isConnected = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    return (value && value.conn === conn && value.connected) || false;
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

  const hasFreshConn = (peerId: string) => {
    const value = map.get(peerId);
    if (!value) return false;
    return value.createdAt > Date.now() - 60 * 1000;
  };

  const getConn = (peerId: string) => {
    const value = map.get(peerId);
    if (!value) return null;
    return value.conn;
  };

  const delConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
      return true;
    }
    return false;
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
      if (value.connected && value.acceptingMediaTypes.includes(mediaType)) {
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

  const getRemoteMediaType = (conn: Peer.DataConnection, mid: string) => {
    const value = map.get(conn.peer);
    if (!value) return null;
    return value.remoteMediaTypes[mid] || null;
  };

  const registerRemoteMediaTypeFromSDP = (
    conn: Peer.DataConnection,
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
    conn: Peer.DataConnection,
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
    markConnected,
    isConnectedPeerId,
    isConnected,
    setUserId,
    getUserId,
    hasFreshConn,
    getConn,
    delConn,
    getConnectedPeerIds,
    forEachConnectedConns,
    forEachConnsAcceptingMedia,
    clearAll,
    getRemoteMediaType,
    registerRemoteMediaType,
  };
};
