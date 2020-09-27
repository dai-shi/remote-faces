let peerIndexCounter = 0;

const getNextPeerIndex = () => {
  peerIndexCounter += 1;
  return peerIndexCounter;
};

// XXX It would be nice to reuse audio worker for all connections
export type Connection = {
  peerIndex: number;
  peer: string; // ipfsId
  userId: string;
  audioWorkers: Map<string, Worker>; // <mediaType, audioDecoder>
  vidoeSetImages: Map<string, (s: string) => void>; // <mediaType, setImage>
};

export const createConnectionMap = () => {
  type Value = {
    conn: Connection;
    acceptingMediaTypes: string[];
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
      audioWorkers: new Map(),
      vidoeSetImages: new Map(),
    };
    map.set(conn.peer, {
      conn,
      acceptingMediaTypes: [],
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

  const size = () => map.size;

  return {
    setAcceptingMediaTypes,
    getAcceptingMediaTypes,
    addConn,
    getConn,
    findConn,
    delConn,
    getPeerIndexList,
    forEachConns,
    size,
  };
};
