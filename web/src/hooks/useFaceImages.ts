import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { isObject } from "../utils/types";
import { takePhoto } from "../media/capture";
import { getRoomState } from "../states/roomMap";

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

  useEffect(() => {
    let didCleanup = false;
    let timer: NodeJS.Timeout;
    const loop = async () => {
      if (didCleanup) return;
      try {
        const image = suspended ? avatar : await takePhoto(deviceId);
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
      timer = setTimeout(loop, 2 * 60 * 1000);
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
        const twoMinAgo = Date.now() - 2 * 60 * 1000;
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
