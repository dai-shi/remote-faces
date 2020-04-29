import { useEffect, useState, useCallback, useRef } from "react";

import { PeerInfo, createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (data: unknown, info: PeerInfo) => void;
type TrackListener = {
  mediaType: string;
  listener: (track: MediaStreamTrack, info: PeerInfo) => void;
};
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
      trackListeners.forEach(({ listener }) => {
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
    const mediaTypeSet = new Set(
      Array.from(entry.trackListeners).map((x) => x.mediaType)
    );
    const prevSize = mediaTypeSet.size;
    entry.trackListeners.add(trackListener);
    mediaTypeSet.add(trackListener.mediaType);
    if (prevSize !== mediaTypeSet.size) {
      entry.room.acceptMediaTypes(Array.from(mediaTypeSet));
    }
  }
  entry.count += 1;
  const definedEntry = entry;
  const unregister = () => {
    if (networkStatusListener) {
      definedEntry.networkStatusListeners.delete(networkStatusListener);
    }
    if (dataListener) {
      definedEntry.dataListeners.delete(dataListener);
    }
    if (trackListener) {
      let mediaTypeSet = new Set(
        Array.from(definedEntry.trackListeners).map((x) => x.mediaType)
      );
      const prevSize = mediaTypeSet.size;
      definedEntry.trackListeners.delete(trackListener);
      mediaTypeSet = new Set(
        Array.from(definedEntry.trackListeners).map((x) => x.mediaType)
      );
      if (prevSize !== mediaTypeSet.size) {
        definedEntry.room.acceptMediaTypes(Array.from(mediaTypeSet));
      }
    }
    definedEntry.count -= 1;
    if (definedEntry.count <= 0) {
      definedEntry.room.dispose();
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

export const useRoomNetworkStatus = (
  roomId: string,
  userId: string,
  onNetworkStatus?: (networkStatus: NetworkStatus) => void
) => {
  const [networkStatus, updateNetworkStatus] = useState<NetworkStatus>();
  if (networkStatus && networkStatus.type === "UNKNOWN_ERROR") {
    throw new Error(`Network Error: ${networkStatus.err.message}`);
  }
  useEffect(() => {
    const { unregister } = register(roomId, userId, (ns: NetworkStatus) => {
      updateNetworkStatus(ns);
      if (onNetworkStatus) onNetworkStatus(ns);
    });
    return unregister;
  }, [roomId, userId, onNetworkStatus]);
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
    const registered = register(roomId, userId);
    broadcastDataRef.current = registered.broadcastData;
    return registered.unregister;
  }, [roomId, userId]);
  return broadcastData;
};

export const useRoomData = (
  roomId: string,
  userId: string,
  onRoomData: (data: unknown, info: PeerInfo) => void
) => {
  useEffect(() => {
    const { unregister } = register(roomId, userId, undefined, onRoomData);
    return unregister;
  }, [roomId, userId, onRoomData]);
};

export const useRoomMedia = (
  roomId: string,
  userId: string,
  onTrack: (track: MediaStreamTrack, info: PeerInfo) => void,
  mediaType?: string
) => {
  const [functions, setFunctions] = useState<{
    addTrack?: (track: MediaStreamTrack) => void;
    removeTrack?: (track: MediaStreamTrack) => void;
  }>({});
  useEffect(() => {
    if (mediaType) {
      const result = register(roomId, userId, undefined, undefined, {
        mediaType,
        listener: onTrack,
      });
      setFunctions({
        addTrack: (track: MediaStreamTrack) =>
          result.addTrack(mediaType, track),
        removeTrack: (track: MediaStreamTrack) =>
          result.removeTrack(mediaType, track),
      });
      return () => {
        setFunctions({});
        result.unregister();
      };
    }
    return undefined;
  }, [roomId, userId, onTrack, mediaType]);
  return functions;
};
