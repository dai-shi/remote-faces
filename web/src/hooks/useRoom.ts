import { useEffect, useState, useCallback, useRef } from "react";

import { createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (data: unknown) => boolean;
type RoomEntry = {
  room: ReturnType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  dataListeners: Set<DataListener>;
  mediaAttachedData: Map<number, unknown>;
  count: number;
};
const roomEntryMap = new Map<string, RoomEntry>();
const register = (
  roomId: string,
  networkStatusListener?: NetworkStatusListener,
  dataListener?: DataListener
) => {
  let entry = roomEntryMap.get(roomId);
  if (!entry) {
    const networkStatusListeners = new Set<NetworkStatusListener>();
    const dataListeners = new Set<DataListener>();
    const mediaAttachedData = new Map<number, unknown>();
    const updateNetworkStatus = (status: NetworkStatus) => {
      if (status.type === "CONNECTION_CLOSED") {
        mediaAttachedData.delete(status.peerId);
      }
      networkStatusListeners.forEach((listener) => {
        listener(status);
      });
    };
    const receiveData = (data: unknown, info: { peerId: number }) => {
      dataListeners.forEach((listener) => {
        const attatchToMedia = listener(data);
        if (attatchToMedia) {
          mediaAttachedData.set(info.peerId, data);
        }
      });
    };
    const room = createRoom(roomId, updateNetworkStatus, receiveData);
    entry = {
      room,
      networkStatusListeners,
      dataListeners,
      mediaAttachedData,
      count: 0,
    };
    roomEntryMap.set(roomId, entry);
  }
  if (networkStatusListener) {
    entry.networkStatusListeners.add(networkStatusListener);
  }
  if (dataListener) {
    entry.dataListeners.add(dataListener);
  }
  entry.count += 1;
  const unregister = () => {
    if (networkStatusListener) {
      (entry as RoomEntry).networkStatusListeners.delete(networkStatusListener);
    }
    if (dataListener) {
      (entry as RoomEntry).dataListeners.delete(dataListener);
    }
    (entry as RoomEntry).count -= 1;
    if ((entry as RoomEntry).count <= 0) {
      (entry as RoomEntry).room.dispose();
      roomEntryMap.delete(roomId);
    }
  };
  return {
    broadcastData: entry.room.broadcastData,
    unregister,
  };
};

export const useRoomNetworkStatus = (roomId: string) => {
  const [networkStatus, updateNetworkStatus] = useState<NetworkStatus>();
  if (networkStatus && networkStatus.type === "UNKNOWN_ERROR") {
    throw new Error("Network Error");
  }
  useEffect(() => {
    const { unregister } = register(roomId, updateNetworkStatus);
    return unregister;
  }, [roomId]);
  return networkStatus;
};

type BroadcastData = ReturnType<typeof createRoom>["broadcastData"];

export const useBroadcastData = (roomId: string) => {
  const broadcastDataRef = useRef<BroadcastData>();
  const broadcastData = useCallback((...args: Parameters<BroadcastData>) => {
    if (broadcastDataRef.current) {
      broadcastDataRef.current(...args);
    } else {
      // TODO pending queue
    }
  }, []);
  useEffect(() => {
    const { broadcastData: broadcastDataByRegister, unregister } = register(
      roomId
    );
    broadcastDataRef.current = broadcastDataByRegister;
    return unregister;
  }, [roomId]);
  return broadcastData;
};

export const useRoomData = <Data>(
  roomId: string,
  isValidData: (data: unknown) => boolean,
  attatchToMedia?: boolean
) => {
  const [data, setData] = useState<Data>();
  useEffect(() => {
    const dataListener = (unknownData: unknown) => {
      if (isValidData(unknownData)) {
        setData(unknownData as Data);
        return !!attatchToMedia;
      }
      return false;
    };
    const { unregister } = register(roomId, undefined, dataListener);
    return unregister;
  }, [roomId, isValidData, attatchToMedia]);
  return data;
};

export const useRoomMedia = (roomId: string, myStream?: MediaStream) => {
  const [streamList, setStreamList] = useState<
    { stream: MediaStream; attachedData: unknown }[]
  >([]);
  useEffect(() => {
    const entry = roomEntryMap.get(roomId);
    if (!entry) {
      throw new Error("useRoomMedia can only be used after useRoomData");
    }
    if (myStream) {
      entry.room.enableLiveMode(myStream, (stream, info) => {
        const attachedData = entry.mediaAttachedData.get(info.peerId);
        setStreamList((prev) => [...prev, { stream, attachedData }]);
      });
    } else {
      entry.room.disableLiveMode();
    }
    return () => {
      entry.room.disableLiveMode();
    };
  }, [roomId, myStream]);
  return streamList;
};
