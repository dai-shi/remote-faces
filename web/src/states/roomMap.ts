import { proxy, snapshot, ref } from "valtio";
import * as Y from "yjs";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";

type RoomState = {
  networkStatusList: NetworkStatus[];
  // userIdMap: number is peerIndex
  userIdMap: { [userId: string]: number | "closed" };
  ydoc: Y.Doc;
  acceptingMediaTypes: string[];
  trackMap: {
    [mediaType: string]: {
      [userId: string]: MediaStreamTrack;
    };
  };
  addMediaType: (type: string) => Promise<void>;
  removeMediaType: (type: string) => Promise<void>;
  addTrack: (type: string, track: MediaStreamTrack) => Promise<void>;
  removeTrack: (type: string) => Promise<void>;
  dispose: () => Promise<void>;
};

const createRoomState = (roomId: string, userId: string) => {
  const addMediaType = async (type: string) => {
    if (state.acceptingMediaTypes.includes(type)) {
      console.log("media type already added", type);
      return;
    }
    state.acceptingMediaTypes.push(type);
    const room = await roomPromise;
    room.acceptMediaTypes(snapshot(state.acceptingMediaTypes));
  };
  const removeMediaType = async (type: string) => {
    const index = state.acceptingMediaTypes.indexOf(type);
    if (index === -1) {
      console.log("media type already added", type);
      return;
    }
    state.acceptingMediaTypes.splice(index, 1);
    const room = await roomPromise;
    room.acceptMediaTypes(snapshot(state.acceptingMediaTypes));
  };
  const addTrack = async (type: string, track: MediaStreamTrack) => {
    const room = await roomPromise;
    room.addTrack(type, track);
  };
  const removeTrack = async (type: string) => {
    const room = await roomPromise;
    room.removeTrack(type);
  };
  const dispose = async () => {
    const room = await roomPromise;
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
    console.log("[network status]", status);
    state.networkStatusList.unshift(status);
    if (state.networkStatusList.length > 10) {
      state.networkStatusList.pop();
    }
    if (status?.type === "CONNECTION_CLOSED") {
      Object.entries(state.userIdMap).forEach(([uid, idx]) => {
        if (idx === status.peerIndex) {
          state.userIdMap[uid] = "closed";
          // FIXME somehow this might be causing fatal behavior
          // delete state.userIdMap[uid];
        }
      });
    }
  };
  const notifyNewPeer = (peerIndex: number) => {
    const update = Y.encodeStateAsUpdate(state.ydoc);
    const base64 = btoa(String.fromCharCode(...update));
    const data = { ydocUpdate: base64 };
    roomPromise.then((room) => {
      // XXX this does not scale
      room.sendData(data, peerIndex);
    });
  };
  const receiveData = (data: any, info: PeerInfo) => {
    state.userIdMap[info.userId] = info.peerIndex;
    if (data?.ydocUpdate) {
      const binaryString = atob(data.ydocUpdate);
      const update = new Uint8Array(
        ([].map.call(binaryString, (c: string) =>
          c.charCodeAt(0)
        ) as unknown) as ArrayBufferLike
      );
      Y.applyUpdate(state.ydoc, update);
    }
  };
  state.ydoc.on("update", (update: Uint8Array) => {
    const base64 = btoa(String.fromCharCode(...update));
    roomPromise.then((room) => {
      room.broadcastData({ ydocUpdate: base64 });
    });
  });
  const receiveTrack = (
    mediaType: string,
    track: MediaStreamTrack,
    info: PeerInfo
  ) => {
    if (!state.trackMap[mediaType]) {
      state.trackMap[mediaType] = {};
    }
    track.addEventListener("ended", () => {
      if (state.trackMap[mediaType][info.userId] === track) {
        delete state.trackMap[mediaType][info.userId];
      }
    });
    state.trackMap[mediaType][info.userId] = ref(track);
  };
  const roomPromise = createRoom(
    roomId,
    userId,
    updateNetworkStatus,
    notifyNewPeer,
    receiveData,
    receiveTrack
  );
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
