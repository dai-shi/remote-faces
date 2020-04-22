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
    connected: boolean;
    live: boolean;
    media?: Peer.MediaConnection;
    mediaStreamReady?: boolean;
  };
  const map = new Map<string, Value>();

  const addConn = (conn: Peer.DataConnection) => {
    map.set(conn.peer, { conn, connected: false, live: false });
  };

  const markConnected = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.connected = true;
    }
  };

  const isConnected = (peerJsId: string) => {
    const value = map.get(peerJsId);
    return value ? value.connected : false;
  };

  const hasConn = (peerJsId: string) => map.has(peerJsId);

  const delConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
    }
  };

  const getConnectedPeerJsIds = () =>
    Array.from(map.keys()).filter((k) => map.get(k)?.connected);

  const getLivePeerJsIds = () =>
    Array.from(map.keys()).filter((k) => {
      const value = map.get(k);
      return value && value.connected && value.live;
    });

  const forEachConnectedConns = (
    callback: (conn: Peer.DataConnection) => void
  ) => {
    Array.from(map.values()).forEach((value) => {
      if (value.connected) {
        callback(value.conn);
      }
    });
  };

  const forEachLiveConns = (
    callback: (conn: Peer.DataConnection, media?: Peer.MediaConnection) => void
  ) => {
    Array.from(map.values()).forEach((value) => {
      if (value.connected && value.live) {
        callback(value.conn, value.media);
      }
    });
  };

  const hasMedia = (peerJsId: string) => {
    const value = map.get(peerJsId);
    return value && !!value.media;
  };

  const markMediaStreamReady = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    if (value) {
      value.mediaStreamReady = true;
    }
  };

  const isMediaStreamReady = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    return (value && value.mediaStreamReady) || false;
  };

  const setMedia = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    if (value) {
      if (value.media && value.media.open) {
        value.media.close();
      }
      value.media = media;
    }
  };

  const delMedia = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    if (value) {
      delete value.media;
    }
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
    hasConn,
    delConn,
    getConnectedPeerJsIds,
    getLivePeerJsIds,
    forEachConnectedConns,
    forEachLiveConns,
    hasMedia,
    markMediaStreamReady,
    isMediaStreamReady,
    setMedia,
    delMedia,
    clearAll,
  };
};
