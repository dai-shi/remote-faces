import { proxy, snapshot, ref } from "valtio";
import * as Y from "yjs";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";

type RoomState = {
  networkStatusList: NetworkStatus[];
  ydoc: Y.Doc;
  acceptingMediaTypes: string[];
  trackMap: {
    [mediaType: string]: {
      [userId: string]: MediaStreamTrack;
    };
  };
  addMediaType: (type: string) => void;
  removeMediaType: (type: string) => void;
  dispose: () => void;
};

const createRoomState = async (roomId: string, userId: string) => {
  const updateNetworkStatus = (status: NetworkStatus) => {
    state.networkStatusList.unshift(status);
    if (state.networkStatusList.length > 10) {
      state.networkStatusList.pop();
    }
  };
  const notifyNewPeer = (peerIndex: number) => {
    const data = { "ydoc.update": Y.encodeStateAsUpdate(state.ydoc) };
    room.sendData(data, peerIndex);
  };
  const receiveData = (data: unknown, _info: PeerInfo) => {
    if (data && "ydoc.update" in (data as object)) {
      Y.applyUpdate(state.ydoc, (data as any)["ydoc.update"]);
    }
  };
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
  const room = await createRoom(
    roomId,
    userId,
    updateNetworkStatus,
    notifyNewPeer,
    receiveData,
    receiveTrack
  );
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
  const state = proxy<RoomState>({
    networkStatusList: [],
    ydoc: ref(new Y.Doc()),
    acceptingMediaTypes: [],
    trackMap: {},
    addMediaType,
    removeMediaType,
    dispose: room.dispose,
  });
  state.ydoc.on("update", (update: unknown) => {
    room.broadcastData({ "ydoc.update": update });
  });
  return state as RoomState;
};

const roomMap = new Map<string, Promise<RoomState>>();

export const getRoomState = async (roomId: string, userId: string) => {
  const key = `${roomId}:${userId}`;
  if (!roomMap.has(key)) {
    const state = createRoomState(roomId, userId);
    roomMap.set(key, state);
  }
  return roomMap.get(key) as Promise<RoomState>;
};

export const disposeRoomState = async (roomId: string, userId: string) => {
  const key = `${roomId}:${userId}`;
  const state = await roomMap.get(key);
  if (state) {
    roomMap.delete(key);
    state.dispose();
  }
};
