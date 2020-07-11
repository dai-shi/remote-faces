export const ROOM_ID_PREFIX_LEN = 32;

export type NetworkStatus =
  | { type: "CONNECTING_SEED_PEERS" }
  | { type: "NEW_CONNECTION"; peerIndex: number }
  | { type: "CONNECTION_CLOSED"; peerIndex: number }
  | { type: "INITIALIZING_PEER"; peerIndex: number }
  | { type: "RECONNECTING" }
  | { type: "SERVER_ERROR" }
  | { type: "UNKNOWN_ERROR"; err: Error }
  | { type: "CONNECTED_PEERS"; peerIndexList: number[] };

type UpdateNetworkStatus = (status: NetworkStatus) => void;

export type PeerInfo = {
  userId: string;
  peerIndex: number;
  mediaTypes: string[];
};
type NotifyNewPeer = (peerIndex: number) => void;
type ReceiveData = (data: unknown, info: PeerInfo) => void;
type ReceiveTrack = (track: MediaStreamTrack, info: PeerInfo) => void;

export type CreateRoom = (
  roomId: string,
  userId: string,
  updateNetworkStatus: UpdateNetworkStatus,
  notifyNewPeer: NotifyNewPeer,
  receiveData: ReceiveData,
  receiveTrack: ReceiveTrack
) => {
  broadcastData: (data: unknown) => void;
  sendData: (data: unknown, peerIndex: number) => void;
  acceptMediaTypes: (mediaTypes: string[]) => void;
  addTrack: (mediaType: string, track: MediaStreamTrack) => void;
  removeTrack: (mediaType: string, track: MediaStreamTrack) => void;
  dispose: () => void;
};
