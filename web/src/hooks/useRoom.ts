import { useEffect, useState, useCallback, useRef, useMemo } from "react";

import { createRoom, NetworkStatus } from "../network/room";

type NetworkStatusListener = (status: NetworkStatus) => void;
type DataListener = (data: unknown) => boolean;
type StreamListener = (
  peerId: number,
  stream: MediaStream | null, // null for removing stream
  attachedData: unknown
) => void;
type RoomEntry = {
  room: ReturnType<typeof createRoom>;
  networkStatusListeners: Set<NetworkStatusListener>;
  dataListeners: Set<DataListener>;
  mediaAttachedData: Map<number, unknown>;
  streamListeners: Set<StreamListener>;
  myStream?: MediaStream;
  count: number;
};
const roomEntryMap = new Map<string, RoomEntry>();
const register = (
  roomId: string,
  networkStatusListener?: NetworkStatusListener,
  dataListener?: DataListener,
  streamListener?: StreamListener
) => {
  let entry = roomEntryMap.get(roomId);
  if (!entry) {
    const networkStatusListeners = new Set<NetworkStatusListener>();
    const dataListeners = new Set<DataListener>();
    const mediaAttachedData = new Map<number, unknown>();
    const streamListeners = new Set<StreamListener>();
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
        const attachToMedia = listener(data);
        if (attachToMedia) {
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
      streamListeners,
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
  if (streamListener) {
    entry.streamListeners.add(streamListener);
    if (entry.streamListeners.size === 1) {
      entry.myStream = new MediaStream();
      entry.room.enableLiveMode(entry.myStream, (stream, { peerId }, close) => {
        if (
          stream &&
          close &&
          !(entry as RoomEntry).mediaAttachedData.has(peerId)
        ) {
          console.warn("stream received too early, closing media:", peerId);
          close();
          return;
        }
        const attachedData = (entry as RoomEntry).mediaAttachedData.get(peerId);
        (entry as RoomEntry).streamListeners.forEach((listener) => {
          listener(peerId, stream, attachedData);
        });
      });
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
        delete (entry as RoomEntry).myStream;
        (entry as RoomEntry).room.disableLiveMode();
      }
    }
    (entry as RoomEntry).count -= 1;
    if ((entry as RoomEntry).count <= 0) {
      (entry as RoomEntry).room.dispose();
      roomEntryMap.delete(roomId);
    }
  };
  return {
    broadcastData: entry.room.broadcastData,
    myStream: entry.myStream,
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
  attachToMedia?: boolean
) => {
  const [data, setData] = useState<Data>();
  useEffect(() => {
    const dataListener = (unknownData: unknown) => {
      if (isValidData(unknownData)) {
        setData(unknownData as Data);
        return !!attachToMedia;
      }
      return false;
    };
    const { unregister } = register(roomId, undefined, dataListener);
    return unregister;
  }, [roomId, isValidData, attachToMedia]);
  return data;
};

export const useRoomMedia = (roomId: string, enabled: boolean) => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [streamMap, setStreamMap] = useState<{
    [peerId: number]: { stream: MediaStream; attachedData: unknown };
  }>({});
  useEffect(() => {
    if (enabled) {
      const streamListener = (
        peerId: number,
        stream: MediaStream | null,
        attachedData: unknown
      ) => {
        if (stream) {
          setStreamMap((prev) => ({
            ...prev,
            [peerId]: { stream, attachedData },
          }));
        } else {
          // remove stream
          setStreamMap((prev) => {
            const { [peerId]: removed, ...rest } = prev;
            return rest;
          });
        }
      };
      const { myStream: myStreamToSet, unregister } = register(
        roomId,
        undefined,
        undefined,
        streamListener
      );
      setMyStream(myStreamToSet || null);
      return unregister;
    }
    // noot enabled
    setMyStream(null);
    setStreamMap({});
    return undefined;
  }, [roomId, enabled]);
  return {
    myStream,
    streamList: useMemo(() => Object.values(streamMap), [streamMap]),
  };
};
