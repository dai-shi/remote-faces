import Peer from "peerjs";

export const isValidPeerId = (
  roomId: string,
  peerId: unknown
): peerId is string =>
  typeof peerId === "string" && peerId.startsWith(`${roomId}_`);

export const generatePeerId = (roomId: string, peerIndex: number) =>
  `${roomId}_${peerIndex}`;

export const getPeerIndexFromPeerId = (peerId: string) =>
  Number(peerId.split("_")[1]);

export const getPeerIndexFromConn = (conn: Peer.DataConnection) =>
  getPeerIndexFromPeerId(conn.peer);

export const createConnectionMap = () => {
  type Value = {
    conn: Peer.DataConnection;
    connected: boolean;
    live: boolean;
    media?: Peer.MediaConnection;
  };
  const map = new Map<string, Value>();

  const addConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.conn.close();
    }
    map.set(conn.peer, { conn, connected: false, live: false });
  };

  const markConnected = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value) {
      value.connected = true;
    }
  };

  const isConnected = (peerId: string) => {
    const value = map.get(peerId);
    return value ? value.connected : false;
  };

  const hasConn = (peerId: string) => map.has(peerId);

  const delConn = (conn: Peer.DataConnection) => {
    const value = map.get(conn.peer);
    if (value && value.conn === conn) {
      map.delete(conn.peer);
    }
  };

  const getConnectedPeerIds = () =>
    Array.from(map.keys()).filter((k) => map.get(k)?.connected);

  const getLivePeerIds = () =>
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

  const forEachLiveConns = (callback: (conn: Peer.DataConnection) => void) => {
    Array.from(map.values()).forEach((value) => {
      if (value.connected && value.live) {
        callback(value.conn);
      }
    });
  };

  const setMedia = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    if (value && !value.media) {
      value.media = media;
    } else {
      console.error("setMedia: invalid value, should not happen");
    }
  };

  const getMedia = (peerId: string) => {
    const value = map.get(peerId);
    return value && value.media;
  };

  const delMedia = (media: Peer.MediaConnection) => {
    const value = map.get(media.peer);
    if (!value) return; // conn is deleted in advance
    if (value.media === media) {
      delete value.media;
    } else {
      console.error("delMedia: invalid value, should not happen", media);
    }
  };

  const closeAllMedia = () => {
    Array.from(map.values()).forEach((value) => {
      if (value.media) {
        value.media.close();
        const valueToModify = value;
        delete valueToModify.media;
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
    hasConn,
    delConn,
    getConnectedPeerIds,
    getLivePeerIds,
    forEachConnectedConns,
    forEachLiveConns,
    setMedia,
    getMedia,
    delMedia,
    closeAllMedia,
    clearAll,
  };
};
