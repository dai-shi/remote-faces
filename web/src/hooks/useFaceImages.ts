import { useCallback, useEffect, useState, useRef } from "react";

import { takePhoto } from "../media/capture";
import { useRoomData, useBroadcastData, useRoomNetworkStatus } from "./useRoom";

type ImageUrl = string;
type FaceInfo = {
  nickname: string;
  message: string;
};
type ImageData = {
  image: ImageUrl;
  info: FaceInfo;
};
type RoomImage = ImageData & {
  userId: string;
  received: number; // in milliseconds
  obsoleted: boolean;
  liveMode: boolean;
  peerIndex: number;
};

const isFaceInfo = (x: unknown): x is FaceInfo =>
  x &&
  typeof x === "object" &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { message: unknown }).message === "string";

const isImageData = (x: unknown): x is ImageData =>
  x &&
  typeof x === "object" &&
  typeof (x as { image: unknown }).image === "string" &&
  isFaceInfo((x as { info: unknown }).info);

export const useFaceImages = (
  roomId: string,
  userId: string,
  nickname: string,
  statusMesg: string,
  deviceId?: string
) => {
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [fatalError, setFatalError] = useState<Error>();
  const faceInfo = useRef({ nickname, message: statusMesg });
  faceInfo.current = { nickname, message: statusMesg };

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
        liveMode: info.liveMode,
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
        const data = {
          userId,
          image,
          info: faceInfo.current,
        };
        broadcastData(data, true);
      } catch (e) {
        console.error(e);
        setFatalError(e);
      }
    };
    loop();
    const timer = setInterval(loop, 2 * 60 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [roomId, userId, deviceId, broadcastData]);

  return {
    myImage,
    roomImages,
  };
};
