import { useEffect, useState, useCallback, useRef } from "react";

import {
  PeerInfo,
  ReceiveStream,
  createRoom,
  NetworkStatus,
} from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (data: unknown, info: PeerInfo) => void;
type StreamListener = (
  stream: MediaStream | null, // null for removing stream
  info: Parameters<ReceiveStream>[1]
) => void;
type RoomEntry = {
  room: ReturnType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  dataListeners: Set<DataListener>;
  streamListeners: Set<StreamListener>;
  myStream: MediaStream;
  count: number;
};
const roomEntryMap = new Map<string, RoomEntry>();
const register = (
  roomId: string,
  userId: string,
  networkStatusListener?: NetworkStatusListener,
  dataListener?: DataListener,
  streamListener?: StreamListener
) => {
  const roomEntryKey = `${roomId}_${userId}`;
  let entry = roomEntryMap.get(roomEntryKey);
  if (!entry) {
    const networkStatusListeners = new Set<NetworkStatusListener>();
    const dataListeners = new Set<DataListener>();
    const streamListeners = new Set<StreamListener>();
    const myStream = new MediaStream();
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
    const receiveStream = (
      stream: MediaStream | null,
      info: Parameters<ReceiveStream>[1]
    ) => {
      streamListeners.forEach((listener) => {
        listener(stream, info);
      });
    };
    const room = createRoom(
      roomId,
      userId,
      myStream,
      updateNetworkStatus,
      receiveData,
      receiveStream
    );
    entry = {
      room,
      networkStatusListeners,
      dataListeners,
      streamListeners,
      myStream,
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
  if (streamListener) {
    entry.streamListeners.add(streamListener);
    if (entry.streamListeners.size === 1) {
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
    if (streamListener) {
      (entry as RoomEntry).streamListeners.delete(streamListener);
      if ((entry as RoomEntry).streamListeners.size === 0) {
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
    myStream: entry.myStream,
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
  const [result, setResult] = useState<{ data: Data; info: PeerInfo }>();
  useEffect(() => {
    const dataListener = (data: unknown, info: PeerInfo) => {
      if (isValidData(data)) {
        setResult({ data: data as Data, info });
      }
      return false;
    };
    const { unregister } = register(roomId, userId, undefined, dataListener);
    return unregister;
  }, [roomId, userId, isValidData]);
  return result;
};

export const useRoomMedia = (
  roomId: string,
  userId: string,
  enabled: boolean
) => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [streamList, setStreamList] = useState<
    { stream: MediaStream; info: Parameters<ReceiveStream>[1] }[]
  >([]);
  useEffect(() => {
    if (enabled) {
      const streamListener = (
        stream: MediaStream | null,
        info: Parameters<ReceiveStream>[1]
      ) => {
        setStreamList((prev) => [
          ...prev.filter((item) => item.info.userId !== info.userId),
          ...(stream ? [{ stream, info }] : []),
        ]);
      };
      const { myStream: myStreamToSet, unregister } = register(
        roomId,
        userId,
        undefined,
        undefined,
        streamListener
      );
      setMyStream(myStreamToSet || null);
      return unregister;
    }
    // noot enabled
    setMyStream(null);
    setStreamList([]);
    return undefined;
  }, [roomId, userId, enabled]);
  return {
    myStream,
    streamList,
  };
};
