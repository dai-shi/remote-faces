import { useEffect, useState, useCallback, useRef } from "react";

import { ReturnPromiseType } from "../utils/types";
import { PeerInfo, createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type NewPeerListener = (peerIndex: number) => void;
type DataListener = (data: unknown, info: PeerInfo) => void;
type TrackListener = (track: MediaStreamTrack, info: PeerInfo) => void;
type RoomEntry = {
  room: ReturnPromiseType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  newPeerListeners: Set<NewPeerListener>;
  dataListeners: Set<DataListener>;
  trackListeners: Map<string, TrackListener>; // key = mediaType
  count: number;
};

const createRoomEntry = async (
  roomId: string,
  userId: string
): Promise<RoomEntry> => {
  const networkStatusListeners = new Set<NetworkStatusListener>();
  const newPeerListeners = new Set<NewPeerListener>();
  const dataListeners = new Set<DataListener>();
  const trackListeners = new Map<string, TrackListener>();
  const updateNetworkStatus = (status: NetworkStatus) => {
    networkStatusListeners.forEach((listener) => {
      listener(status);
    });
  };
  const notifyNewPeer = (peerIndex: number) => {
    newPeerListeners.forEach((listener) => {
      listener(peerIndex);
    });
  };
  const receiveData = (data: unknown, info: PeerInfo) => {
    dataListeners.forEach((listener) => {
      listener(data, info);
    });
  };
  const receiveTrack = (
    mediaType: string,
    track: MediaStreamTrack,
    info: PeerInfo
  ) => {
    const listener = trackListeners.get(mediaType);
    if (listener) {
      listener(track, info);
    } else {
      // TODO cache???
    }
  };
  const room = await createRoom(
    roomId,
    userId,
    updateNetworkStatus,
    notifyNewPeer,
    receiveData,
    receiveTrack
  );
  return {
    room,
    networkStatusListeners,
    newPeerListeners,
    dataListeners,
    trackListeners,
    count: 0,
  };
};

const roomEntryMap = new Map<string, Promise<RoomEntry>>();
const register = async (
  roomId: string,
  userId: string,
  listeners: {
    networkStatusListener?: NetworkStatusListener;
    newPeerListener?: NewPeerListener;
    dataListener?: DataListener;
    trackListener?: {
      mediaType: string;
      listener: TrackListener;
    };
  }
) => {
  const roomEntryKey = `${roomId}_${userId}`;
  if (!roomEntryMap.has(roomEntryKey)) {
    roomEntryMap.set(roomEntryKey, createRoomEntry(roomId, userId));
  }
  const entry = (await roomEntryMap.get(roomEntryKey)) as RoomEntry;
  if (listeners.networkStatusListener) {
    entry.networkStatusListeners.add(listeners.networkStatusListener);
  }
  if (listeners.newPeerListener) {
    entry.newPeerListeners.add(listeners.newPeerListener);
  }
  if (listeners.dataListener) {
    entry.dataListeners.add(listeners.dataListener);
  }
  if (listeners.trackListener) {
    const mediaTypeSet = new Set(entry.trackListeners.keys());
    const prevSize = mediaTypeSet.size;
    entry.trackListeners.set(
      listeners.trackListener.mediaType,
      listeners.trackListener.listener
    );
    mediaTypeSet.add(listeners.trackListener.mediaType);
    if (prevSize !== mediaTypeSet.size) {
      entry.room.acceptMediaTypes(Array.from(mediaTypeSet));
    }
  }
  entry.count += 1;
  const unregister = () => {
    if (listeners.networkStatusListener) {
      entry.networkStatusListeners.delete(listeners.networkStatusListener);
    }
    if (listeners.newPeerListener) {
      entry.newPeerListeners.delete(listeners.newPeerListener);
    }
    if (listeners.dataListener) {
      entry.dataListeners.delete(listeners.dataListener);
    }
    if (listeners.trackListener) {
      entry.trackListeners.delete(listeners.trackListener.mediaType);
      entry.room.acceptMediaTypes(Array.from(entry.trackListeners.keys()));
    }
    entry.count -= 1;
    if (entry.count <= 0) {
      entry.room.dispose();
      roomEntryMap.delete(roomEntryKey);
    }
  };
  return {
    broadcastData: entry.room.broadcastData,
    sendData: entry.room.sendData,
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
    let cleanup = () => {};
    (async () => {
      const { unregister } = await register(roomId, userId, {
        networkStatusListener: (ns: NetworkStatus) => {
          updateNetworkStatus(ns);
          if (onNetworkStatus) onNetworkStatus(ns);
        },
      });
      cleanup = unregister;
    })();
    return () => {
      cleanup();
    };
  }, [roomId, userId, onNetworkStatus]);
  return networkStatus;
};

export const useRoomNewPeer = (
  roomId: string,
  userId: string,
  sendInitialData: (send: (data: unknown) => void) => void
) => {
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const { unregister, sendData } = await register(roomId, userId, {
        newPeerListener: (peerIndex) => {
          sendInitialData((data) => sendData(data, peerIndex));
        },
      });
      cleanup = unregister;
    })();
    return () => {
      cleanup();
    };
  }, [roomId, userId, sendInitialData]);
};

type BroadcastData = ReturnPromiseType<typeof createRoom>["broadcastData"];

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
    let cleanup = () => {};
    (async () => {
      const registered = await register(roomId, userId, {});
      broadcastDataRef.current = registered.broadcastData;
      cleanup = registered.unregister;
    })();
    return () => {
      cleanup();
    };
  }, [roomId, userId]);
  return broadcastData;
};

export const useRoomData = (
  roomId: string,
  userId: string,
  onRoomData: (data: unknown, info: PeerInfo) => void
) => {
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const { unregister } = await register(roomId, userId, {
        dataListener: onRoomData,
      });
      cleanup = unregister;
    })();
    return () => {
      cleanup();
    };
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
    removeTrack?: () => void;
  }>({});
  useEffect(() => {
    let cleanup = () => {};
    if (mediaType) {
      (async () => {
        const result = await register(roomId, userId, {
          trackListener: { mediaType, listener: onTrack },
        });
        setFunctions({
          addTrack: (track: MediaStreamTrack) =>
            result.addTrack(mediaType, track),
          removeTrack: () => result.removeTrack(mediaType),
        });
        cleanup = () => {
          setFunctions({});
          result.unregister();
        };
      })();
    }
    return () => {
      cleanup();
    };
  }, [roomId, userId, onTrack, mediaType]);
  return functions;
};
