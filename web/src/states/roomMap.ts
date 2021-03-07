import { proxy, snapshot, ref } from "valtio";
import * as Y from "yjs";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";
import { ReturnPromiseType } from "../utils/types";

type RoomState = {
  networkStatusList: NetworkStatus[];
  userIdMap: { [userId: string]: number }; // peerIndex
  ydoc: Y.Doc;
  acceptingMediaTypes: string[];
  trackMap: {
    [mediaType: string]: {
      [userId: string]: MediaStreamTrack;
    };
  };
  addMediaType: (type: string) => void;
  removeMediaType: (type: string) => void;
  addTrack: (type: string, track: MediaStreamTrack) => void;
  removeTrack: (type: string) => void;
  dispose: () => void;
};

const createRoomState = (roomId: string, userId: string) => {
  let room: ReturnPromiseType<typeof createRoom>;
  const addMediaType = (type: string) => {
    if (state.acceptingMediaTypes.includes(type)) {
      console.log("media type already added", type);
      return;
    }
    state.acceptingMediaTypes.push(type);
    room.acceptMediaTypes(snapshot(state.acceptingMediaTypes));
  };
  const removeMediaType = (type: string) => {
    const index = state.acceptingMediaTypes.indexOf(type);
    if (index === -1) {
      console.log("media type already added", type);
      return;
    }
    state.acceptingMediaTypes.splice(index, 1);
    room.acceptMediaTypes(snapshot(state.acceptingMediaTypes));
  };
  const addTrack = (type: string, track: MediaStreamTrack) => {
    room.addTrack(type, track);
  };
  const removeTrack = (type: string) => {
    room.removeTrack(type);
  };
  const dispose = () => {
    room.dispose();
  };
  const state = proxy<RoomState>({
    networkStatusList: [],
    userIdMap: {},
    ydoc: ref(new Y.Doc()),
    acceptingMediaTypes: [],
    trackMap: {},
    addMediaType,
    removeMediaType,
    addTrack,
    removeTrack,
    dispose,
  });
  const updateNetworkStatus = (status: NetworkStatus) => {
    state.networkStatusList.unshift(status);
    if (state.networkStatusList.length > 10) {
      state.networkStatusList.pop();
    }
    if (status?.type === "CONNECTION_CLOSED") {
      Object.entries(state.userIdMap).forEach(([uid, idx]) => {
        if (idx === status.peerIndex) {
          delete state.userIdMap[uid];
        }
      });
    }
  };
  const notifyNewPeer = (peerIndex: number) => {
    const data = { ydocUpdate: Y.encodeStateAsUpdate(state.ydoc) };
    room.sendData(data, peerIndex);
  };
  const receiveData = (data: any, info: PeerInfo) => {
    state.userIdMap[info.userId] = info.peerIndex;
    if (data?.ydocUpdate) {
      Y.applyUpdate(state.ydoc, data.ydocUpdate);
    }
  };
  state.ydoc.on("update", (update: unknown) => {
    room.broadcastData({ ydocUpdate: update });
  });
  const receiveTrack = (
    mediaType: string,
    track: MediaStreamTrack,
    info: PeerInfo
  ) => {
    if (!state.trackMap[mediaType]) {
      state.trackMap[mediaType] = {};
    }
    state.trackMap[mediaType][info.userId] = ref(track);
  };
  createRoom(
    roomId,
    userId,
    updateNetworkStatus,
    notifyNewPeer,
    receiveData,
    receiveTrack
  ).then((r) => {
    room = r;
  });
  return state;
};

const roomMap = new Map<string, RoomState>();

export const getRoomState = (roomId: string, userId: string) => {
  const key = `${roomId}:${userId}`;
  if (!roomMap.has(key)) {
    const state = createRoomState(roomId, userId);
    roomMap.set(key, state);
  }
  return roomMap.get(key) as RoomState;
};

export const disposeRoomState = (roomId: string, userId: string) => {
  const key = `${roomId}:${userId}`;
  const state = roomMap.get(key);
  if (state) {
    roomMap.delete(key);
    state.dispose();
  }
};
