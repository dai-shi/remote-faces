import { useEffect, useState, useCallback, useRef } from "react";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (data: unknown, info: PeerInfo) => void;
type TrackListener = (track: MediaStreamTrack, info: PeerInfo) => void;
type RoomEntry = {
  room: ReturnType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  dataListeners: Set<DataListener>;
  trackListeners: Set<TrackListener>;
  count: number;
};
const roomEntryMap = new Map<string, RoomEntry>();
const register = (
  roomId: string,
  userId: string,
  networkStatusListener?: NetworkStatusListener,
  dataListener?: DataListener,
  trackListener?: TrackListener
) => {
  const roomEntryKey = `${roomId}_${userId}`;
  let entry = roomEntryMap.get(roomEntryKey);
  if (!entry) {
    const networkStatusListeners = new Set<NetworkStatusListener>();
    const dataListeners = new Set<DataListener>();
    const trackListeners = new Set<TrackListener>();
    const updateNetworkStatus = (status: NetworkStatus) => {
      networkStatusListeners.forEach((listener) => {
        listener(status);
      });
    };
    const receiveData = (data: unknown, info: PeerInfo) => {
      dataListeners.forEach((listener) => {
        listener(data, info);
      });
    };
    const receiveTrack = (track: MediaStreamTrack, info: PeerInfo) => {
      trackListeners.forEach((listener) => {
        listener(track, info);
      });
    };
    const room = createRoom(
      roomId,
      userId,
      updateNetworkStatus,
      receiveData,
      receiveTrack
    );
    entry = {
      room,
      networkStatusListeners,
      dataListeners,
      trackListeners,
      count: 0,
    };
    roomEntryMap.set(roomEntryKey, entry);
  }
  if (networkStatusListener) {
    entry.networkStatusListeners.add(networkStatusListener);
  }
  if (dataListener) {
    entry.dataListeners.add(dataListener);
  }
  if (trackListener) {
    entry.trackListeners.add(trackListener);
    if (entry.trackListeners.size === 1) {
      entry.room.enableLiveMode();
    }
  }
  entry.count += 1;
  const unregister = () => {
    if (networkStatusListener) {
      (entry as RoomEntry).networkStatusListeners.delete(networkStatusListener);
    }
    if (dataListener) {
      (entry as RoomEntry).dataListeners.delete(dataListener);
    }
    if (trackListener) {
      (entry as RoomEntry).trackListeners.delete(trackListener);
      if ((entry as RoomEntry).trackListeners.size === 0) {
        (entry as RoomEntry).room.disableLiveMode();
      }
    }
    (entry as RoomEntry).count -= 1;
    if ((entry as RoomEntry).count <= 0) {
      (entry as RoomEntry).room.dispose();
      roomEntryMap.delete(roomEntryKey);
    }
  };
  return {
    broadcastData: entry.room.broadcastData,
    addTrack: entry.room.addTrack,
    removeTrack: entry.room.removeTrack,
    unregister,
  };
};

export const useRoomNetworkStatus = (roomId: string, userId: string) => {
  const [networkStatus, updateNetworkStatus] = useState<NetworkStatus>();
  if (networkStatus && networkStatus.type === "UNKNOWN_ERROR") {
    throw new Error("Network Error");
  }
  useEffect(() => {
    const { unregister } = register(roomId, userId, updateNetworkStatus);
    return unregister;
  }, [roomId, userId]);
  return networkStatus;
};

type BroadcastData = ReturnType<typeof createRoom>["broadcastData"];

export const useBroadcastData = (roomId: string, userId: string) => {
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
      roomId,
      userId
    );
    broadcastDataRef.current = broadcastDataByRegister;
    return unregister;
  }, [roomId, userId]);
  return broadcastData;
};

export const useRoomData = <Data>(
  roomId: string,
  userId: string,
  isValidData: (data: unknown) => boolean
) => {
  const [latestData, setLatestData] = useState<{
    data: Data;
    info: PeerInfo;
  }>();
  useEffect(() => {
    const dataListener = (data: unknown, info: PeerInfo) => {
      if (isValidData(data)) {
        setLatestData({ data: data as Data, info });
      }
      return false;
    };
    const { unregister } = register(roomId, userId, undefined, dataListener);
    return unregister;
  }, [roomId, userId, isValidData]);
  return latestData;
};

export const useRoomMedia = (
  roomId: string,
  userId: string,
  enabled: boolean
) => {
  const [functions, setFunctions] = useState<{
    addTrack?: (track: MediaStreamTrack) => void;
    removeTrack?: (track: MediaStreamTrack) => void;
  }>({});
  const [latestTrack, setLatestTrack] = useState<{
    track: MediaStreamTrack;
    info: PeerInfo;
  } | null>(null);
  useEffect(() => {
    if (enabled) {
      const trackListener = (track: MediaStreamTrack, info: PeerInfo) => {
        setLatestTrack({ track, info });
      };
      const result = register(
        roomId,
        userId,
        undefined,
        undefined,
        trackListener
      );
      setFunctions({
        addTrack: result.addTrack,
        removeTrack: result.removeTrack,
      });
      return () => {
        setFunctions({});
        result.unregister();
      };
    }
    // not enabled
    setLatestTrack(null);
    return undefined;
  }, [roomId, userId, enabled]);
  return { ...functions, latestTrack };
};
