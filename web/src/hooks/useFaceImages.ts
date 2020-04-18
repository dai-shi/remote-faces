import { useEffect, useState } from "react";

import { takePhoto } from "../capture/webcam";
import { useRoomData, useBroadcastData } from "./useRoom";

type ImageUrl = string;
type FaceInfo = {
  nickname: string;
  message: string;
};
type ImageData = {
  userId: string;
  image: ImageUrl;
  info: FaceInfo;
};
type RoomImage = ImageData & {
  received: number; // in milliseconds
  obsoleted: boolean;
};

const isFaceInfo = (x: unknown): x is FaceInfo =>
  x &&
  typeof x === "object" &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { message: unknown }).message === "string";

const isImageData = (x: unknown): x is ImageData =>
  x &&
  typeof x === "object" &&
  typeof (x as { userId: unknown }).userId === "string" &&
  typeof (x as { image: unknown }).image === "string" &&
  isFaceInfo((x as { info: unknown }).info);

export const useFaceImages = (
  roomId: string,
  userId: string,
  getFaceInfo: () => FaceInfo,
  deviceId?: string
) => {
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [fatalError, setFatalError] = useState<Error>();

  if (fatalError) {
    throw fatalError;
  }

  const broadcastData = useBroadcastData(roomId);
  const imageData = useRoomData<ImageData>(roomId, isImageData);
  if (imageData) {
    const roomImage: RoomImage = {
      ...imageData,
      received: Date.now(),
      obsoleted: false,
    };
    setRoomImages((prev) => {
      let found = false;
      const next = prev.map((item) => {
        if (item.userId === roomImage.userId) {
          found = true;
          return roomImage;
        }
        return item;
      });
      return found ? next : [...prev, roomImage];
    });
  }

  useEffect(() => {
    const checkObsoletedImage = () => {
      const twoMinAgo = Date.now() - 2 * 60 * 1000;
      setRoomImages((prev) => {
        let changed = false;
        const next = prev.map((item) => {
          if (item.received < twoMinAgo && !item.obsoleted) {
            changed = true;
            return { ...item, obsoleted: true };
          }
          return item;
        });
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
          info: getFaceInfo(),
        };
        broadcastData(data);
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
  }, [roomId, userId, getFaceInfo, deviceId, broadcastData]);

  return {
    myImage,
    roomImages,
  };
};
