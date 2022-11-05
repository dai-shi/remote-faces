import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { isObject } from "../utils/types";
import { takePhoto } from "../media/capture";
import { getRoomState } from "../states/roomMap";
import { preferenceState } from "../states/preference";

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
  userId: string;
  image: ImageUrl;
  info: FaceInfo;
  updated: number; // in milliseconds
};

const isImageData = (x: unknown): x is ImageData =>
  isObject(x) &&
  typeof (x as { image: unknown }).image === "string" &&
  isFaceInfo((x as { info: unknown }).info) &&
  typeof (x as { updated: unknown }).updated === "number";

const TTL = 2 * 60 * 1000; // 2 minutes

let myImageCache:
  | {
      deviceId?: string;
      photoSize?: number;
      createdAt: number;
      promiseUrl: Promise<ImageUrl>;
    }
  | undefined;

const takePhotoWithCache = (
  deviceId?: string,
  photoSize?: number
): Promise<ImageUrl> => {
  const now = Date.now();
  if (
    myImageCache &&
    myImageCache.deviceId === deviceId &&
    myImageCache.photoSize === photoSize &&
    myImageCache.createdAt + TTL > now
  ) {
    return myImageCache.promiseUrl;
  }
  const promiseUrl = takePhoto(deviceId, photoSize);
  myImageCache = {
    deviceId,
    photoSize,
    createdAt: now,
    promiseUrl,
  };
  return promiseUrl;
};

export const useFaceImages = (
  roomId: string,
  userId: string,
  avatar: string,
  nickname: string,
  statusMesg: string,
  suspended: boolean,
  liveMode: boolean,
  micOn: boolean,
  speakerOn: boolean,
  deviceId?: string
) => {
  const roomState = getRoomState(roomId, userId);
  const { userIdList, faceImages } = useSnapshot(roomState);
  const { photoSize } = useSnapshot(preferenceState);

  const tenMinAgo = Date.now() - 10 * 60 * 1000;
  const roomImages: ImageData[] = [];
  userIdList.forEach(({ userId }) => {
    const data = faceImages[userId];
    if (!isImageData(data)) return;
    if (data.updated >= tenMinAgo) {
      roomImages.push(data);
    }
  });

  const [myImage, setMyImage] = useState<ImageUrl>();

  type Timeout = ReturnType<typeof setTimeout>;

  useEffect(() => {
    let didCleanup = false;
    let timer: Timeout;
    const loop = async () => {
      if (didCleanup) return;
      try {
        const image = suspended
          ? avatar
          : await takePhotoWithCache(deviceId, photoSize);
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
          userId,
          image,
          info,
          updated: Date.now(),
        };
        roomState.faceImages[userId] = data;
      } catch (e) {
        console.error(e);
      }
      timer = setTimeout(loop, TTL);
    };
    loop();
    return () => {
      didCleanup = true;
      clearTimeout(timer);
    };
  }, [
    roomState,
    userId,
    deviceId,
    avatar,
    nickname,
    statusMesg,
    suspended,
    liveMode,
    micOn,
    speakerOn,
    photoSize,
  ]);

  return {
    myImage,
    roomImages,
  };
};

export const useFaceImageObsoleted = (
  updated?: number // in milliseconds
) => {
  const [obsoleted, setObsoleted] = useState(false);
  useEffect(() => {
    if (updated) {
      const callback = () => {
        const twoMinAgo = Date.now() - TTL;
        setObsoleted(updated < twoMinAgo);
      };
      const timer = setInterval(callback, 10 * 1000);
      callback();
      return () => clearInterval(timer);
    }
    return undefined;
  }, [updated]);
  return obsoleted;
};
