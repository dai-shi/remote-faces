import { useCallback, useEffect, useState, useRef } from "react";

import { isObject } from "../utils/types";
import { takePhoto } from "../media/capture";
import {
  useRoomData,
  useBroadcastData,
  useRoomNetworkStatus,
  useRoomNewPeer,
} from "./useRoom";

type ImageUrl = string;

type FaceInfo = {
  nickname: string;
  message: string;
  liveMode: boolean;
  micOn: boolean;
  speakerOn: boolean;
};

const isFaceInfo = (x: unknown): x is FaceInfo =>
  isObject(x) &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { message: unknown }).message === "string" &&
  typeof (x as { liveMode: unknown }).liveMode === "boolean" &&
  typeof (x as { micOn: unknown }).micOn === "boolean" &&
  typeof (x as { speakerOn: unknown }).speakerOn === "boolean";

type ImageData = {
  image: ImageUrl;
  info: FaceInfo;
};

const isImageData = (x: unknown): x is ImageData =>
  isObject(x) &&
  typeof (x as { image: unknown }).image === "string" &&
  isFaceInfo((x as { info: unknown }).info);

type RoomImage = ImageData & {
  userId: string;
  received: number; // in milliseconds
  obsoleted: boolean;
  peerIndex: number;
};

export const useFaceImages = (
  roomId: string,
  userId: string,
  nickname: string,
  statusMesg: string,
  liveMode: boolean,
  micOn: boolean,
  speakerOn: boolean,
  deviceId?: string
) => {
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);

  const [fatalError, setFatalError] = useState<Error>();
  if (fatalError) {
    throw fatalError;
  }

  const lastDataRef = useRef<ImageData>();
  useRoomNewPeer(
    roomId,
    userId,
    useCallback((send) => {
      if (lastDataRef.current) {
        send(lastDataRef.current);
      }
    }, [])
  );

  const broadcastData = useBroadcastData(roomId, userId);
  useRoomData(
    roomId,
    userId,
    useCallback((data, info) => {
      if (!isImageData(data)) return;
      const roomImage = {
        ...data,
        userId: info.userId,
        received: Date.now(),
        obsoleted: false,
        peerIndex: info.peerIndex,
      };
      setRoomImages((prev) => {
        const found = prev.find((item) => item.userId === roomImage.userId);
        if (!found) {
          return [...prev, roomImage];
        }
        return prev.map((item) =>
          item.userId === roomImage.userId ? roomImage : item
        );
      });
    }, [])
  );

  useRoomNetworkStatus(
    roomId,
    userId,
    useCallback((networkStatus) => {
      if (networkStatus && networkStatus.type === "CONNECTION_CLOSED") {
        const { peerIndex } = networkStatus;
        setRoomImages((prev) => {
          let changed = false;
          const next = prev.map((item) => {
            if (item.peerIndex === peerIndex) {
              changed = true;
              return { ...item, obsoleted: true };
            }
            return item;
          });
          return changed ? next : prev;
        });
      }
    }, [])
  );

  useEffect(() => {
    const checkObsoletedImage = () => {
      const twoMinAgo = Date.now() - 2 * 60 * 1000;
      const tenMinAgo = Date.now() - 10 * 60 * 1000;
      setRoomImages((prev) => {
        let changed = false;
        const next = prev
          .map((item) => {
            if (item.received < twoMinAgo && !item.obsoleted) {
              changed = true;
              return { ...item, obsoleted: true };
            }
            if (item.received < tenMinAgo && item.obsoleted) {
              changed = true;
              return null;
            }
            return item;
          })
          .filter((item) => item) as typeof prev;

        return changed ? next : prev;
      });
    };
    let didCleanup = false;
    let timer: NodeJS.Timeout;
    const loop = async () => {
      if (didCleanup) return;
      try {
        checkObsoletedImage();
        const image = await takePhoto(deviceId);
        if (didCleanup) return;
        setMyImage(image);
        const info: FaceInfo = {
          nickname,
          message: statusMesg,
          liveMode,
          micOn,
          speakerOn,
        };
        const data: ImageData = {
          image,
          info,
        };
        broadcastData(data);
        lastDataRef.current = data;
      } catch (e) {
        setFatalError(e);
      }
      timer = setTimeout(loop, 2 * 60 * 1000);
    };
    loop();
    return () => {
      didCleanup = true;
      clearTimeout(timer);
    };
  }, [
    roomId,
    userId,
    deviceId,
    nickname,
    statusMesg,
    liveMode,
    micOn,
    speakerOn,
    broadcastData,
  ]);

  return {
    myImage,
    roomImages,
  };
};
