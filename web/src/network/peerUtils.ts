import Peer from "peerjs";

export type Conn = Peer["connections"][0];

export const isConnectedConn = (conn: Conn, ignoreConnecting = false) => {
  if (!conn) return false;
  const peerConn = conn.peerConnection;
  if (!peerConn) return false;
  const connState = peerConn.connectionState;
  if (connState === "connected") return true;
  if (!ignoreConnecting) {
    if (connState === "connecting" || connState === "new") {
      return true;
    }
  }
  // for safari
  if (!connState && peerConn.signalingState === "stable") return true;
  return false;
};

export const getLivePeers = (myPeer: Peer) => {
  const peers = Object.keys(myPeer.connections);
  const livePeers = peers.filter((peer) =>
    myPeer.connections[peer].some((conn: Conn) => isConnectedConn(conn, true))
  );
  return livePeers;
};
