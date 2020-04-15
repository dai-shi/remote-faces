import { useEffect, useState } from "react";

import { createRoom, NetworkStatus } from "../network/room";
import { takePhoto } from "../capture/webcam";

type ImageUrl = string;
type FaceInfo = {
  nickname: string;
  message: string;
};
type RoomImage = {
  userId: string;
  image: ImageUrl;
  info: FaceInfo;
  received: number; // in milliseconds
  obsoleted: boolean;
};

const isFaceInfo = (x: unknown): x is FaceInfo =>
  x &&
  typeof x === "object" &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { message: unknown }).message === "string";

export const useFaceImages = (
  roomId: string,
  userId: string,
  getFaceInfo: () => FaceInfo,
  deviceId?: string
) => {
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [networkStatus, updateNetworkStatus] = useState<NetworkStatus>();
  const [fatalError, setFatalError] = useState<Error>();

  if (fatalError) {
    throw fatalError;
  }
  if (
    networkStatus &&
    (networkStatus.type === "NETWORK_ERROR" ||
      networkStatus.type === "UNKNOWN_ERROR")
  ) {
    throw new Error("network error");
  }

  // TODO: split two effects so that changing deviceId won't reconnect.
  useEffect(() => {
    const receiveData = (_peerId: number, data: unknown) => {
      if (
        data &&
        typeof data === "object" &&
        typeof (data as { userId: unknown }).userId === "string" &&
        typeof (data as { image: unknown }).image === "string" &&
        isFaceInfo((data as { info: unknown }).info)
      ) {
        const roomImage: RoomImage = {
          userId: (data as { userId: string }).userId,
          image: (data as { image: ImageUrl }).image,
          info: (data as { info: FaceInfo }).info,
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
    };
    const { broadcastData, dispose } = createRoom(
      roomId,
      updateNetworkStatus,
      receiveData
    );
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
      dispose();
      clearTimeout(timer);
    };
  }, [roomId, userId, getFaceInfo, deviceId]);

  return {
    myImage,
    roomImages,
    networkStatus,
  };
};
