import { useCallback, useEffect, useState } from "react";

import { isObject } from "../utils/types";
import { takePhoto } from "../media/capture";
import { useRoomData, useBroadcastData, useRoomNetworkStatus } from "./useRoom";

type ImageUrl = string;
type FaceInfo = {
  nickname: string;
  message: string;
  liveMode: boolean;
};
type ImageData = {
  image: ImageUrl;
  info: FaceInfo;
};
type RoomImage = ImageData & {
  userId: string;
  received: number; // in milliseconds
  obsoleted: boolean;
  peerIndex: number;
};

const isFaceInfo = (x: unknown): x is FaceInfo =>
  isObject(x) &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { message: unknown }).message === "string" &&
  typeof (x as { liveMode: unknown }).liveMode === "boolean";

const isImageData = (x: unknown): x is ImageData =>
  isObject(x) &&
  typeof (x as { image: unknown }).image === "string" &&
  isFaceInfo((x as { info: unknown }).info);

export const useFaceImages = (
  roomId: string,
  userId: string,
  nickname: string,
  statusMesg: string,
  liveMode: boolean,
  deviceId?: string
) => {
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [fatalError, setFatalError] = useState<Error>();

  if (fatalError) {
    throw fatalError;
  }

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
    const loop = async () => {
      try {
        checkObsoletedImage();
        const image = await takePhoto(deviceId);
        setMyImage(image);
        const info: FaceInfo = { nickname, message: statusMesg, liveMode };
        const data = {
          userId,
          image,
          info,
        };
        broadcastData(data, true);
      } catch (e) {
        setFatalError(e);
      }
    };
    loop();
    const timer = setInterval(loop, 2 * 60 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [roomId, userId, deviceId, nickname, statusMesg, liveMode, broadcastData]);

  return {
    myImage,
    roomImages,
  };
};
