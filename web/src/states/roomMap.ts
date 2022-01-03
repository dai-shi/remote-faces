import { proxy, snapshot, ref } from "valtio";
import * as Y from "yjs";
import { bindProxyAndYMap, bindProxyAndYArray } from "valtio-yjs";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";
import { encodeBase64Async, decodeBase64Async } from "../utils/base64";

type RoomState = {
  networkStatusList: NetworkStatus[];
  userIdList: { userId: string; peerIndex: number | "closed" }[];
  faceImages: { [userId: string]: unknown };
  gatherAvatarMap: { [userId: string]: unknown };
  gatherRegionList: unknown[];
  extraDataListMap: { [id: string]: unknown[] };
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
    userIdList: [],
    faceImages: {},
    gatherAvatarMap: {},
    gatherRegionList: [],
    extraDataListMap: {},
    acceptingMediaTypes: [],
    trackMap: {},
    addMediaType,
    removeMediaType,
    addTrack,
    removeTrack,
    dispose,
  });
  const ydoc = new Y.Doc();
  bindProxyAndYMap(state.faceImages, ydoc.getMap("faceImages"));
  bindProxyAndYMap(state.gatherAvatarMap, ydoc.getMap("gatherAvatarMap"));
  bindProxyAndYArray(state.gatherRegionList, ydoc.getArray("gatherRegionList"));
  bindProxyAndYMap(state.extraDataListMap, ydoc.getMap("extraDataListMap"));
  const updateNetworkStatus = (status: NetworkStatus) => {
    console.log(new Date().toLocaleString(), "[network status]", status);
    state.networkStatusList.unshift(status);
    if (state.networkStatusList.length > 10) {
      state.networkStatusList.pop();
    }
    if (status?.type === "CONNECTION_CLOSED") {
      state.userIdList.forEach((item) => {
        if (item.peerIndex === status.peerIndex) {
          item.peerIndex = "closed";
          // FIXME somehow this might be causing fatal behavior
          // state.userIdMap.splice(index, index);
        }
      });
    }
  };
  const notifyNewPeer = async (peerIndex: number) => {
    const update = Y.encodeStateAsUpdate(ydoc);
    const base64 = await encodeBase64Async(update);
    const data = { ydocUpdate: base64 };
    roomPromise.then((room) => {
      // XXX this does not scale
      room.sendData(data, peerIndex);
    });
  };
  const receiveData = async (data: any, info: PeerInfo) => {
    const found = state.userIdList.find((item) => item.userId === info.userId);
    if (found) {
      found.peerIndex = info.peerIndex;
    } else {
      state.userIdList.push({
        userId: info.userId,
        peerIndex: info.peerIndex,
      });
    }
    if (data?.ydocUpdate) {
      const update = await decodeBase64Async(data.ydocUpdate);
      Y.applyUpdate(ydoc, update);
    }
  };
  ydoc.on("update", async (update: Uint8Array) => {
    const base64 = await encodeBase64Async(update);
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
