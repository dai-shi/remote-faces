import { useEffect, useState } from "react";

import { createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (peerId: number, data: unknown) => void;
type RoomEntry = {
  room: ReturnType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  dataListeners: Set<DataListener>;
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
    const updateNetworkStatus = (status: NetworkStatus) => {
      networkStatusListeners.forEach((listener) => {
        listener(status);
      });
    };
    const receiveData = (peerId: number, data: unknown) => {
      dataListeners.forEach((listener) => {
        listener(peerId, data);
      });
    };
    const room = createRoom(roomId, updateNetworkStatus, receiveData);
    entry = { room, networkStatusListeners, dataListeners, count: 0 };
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
  if (
    networkStatus &&
    (networkStatus.type === "NETWORK_ERROR" ||
      networkStatus.type === "UNKNOWN_ERROR")
  ) {
    throw new Error("network error");
  }
  useEffect(() => {
    const { unregister } = register(roomId, updateNetworkStatus);
    return unregister;
  }, [roomId]);
  return networkStatus;
};

export const useBroadcastData = (roomId: string) => {
  // TODO pending queue
  const [broadcastData, setBroadcastData] = useState<(data: unknown) => void>(
    () => () => undefined
  );
  useEffect(() => {
    const { broadcastData: broadcastDataByRegister, unregister } = register(
      roomId
    );
    setBroadcastData(broadcastDataByRegister);
    return unregister;
  }, [roomId]);
  return broadcastData;
};

export const useRoomData = <Data>(
  roomId: string,
  isValidData: (data: unknown) => boolean
) => {
  const [data, setData] = useState<Data>();
  useEffect(() => {
    const dataListener = (_peerId: number, unknownData: unknown) => {
      if (isValidData(unknownData)) {
        setData(unknownData as Data);
      }
    };
    const { unregister } = register(roomId, undefined, dataListener);
    return unregister;
  }, [roomId, isValidData]);
  return data;
};
