import { useEffect, useState } from "react";
import { subscribe } from "valtio";

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
  typeof (x as { userId: unknown }).userId === "string" &&
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
  const [myImage, setMyImage] = useState<ImageUrl>();
  const [roomImages, setRoomImages] = useState<ImageData[]>([]);

  const [fatalError, setFatalError] = useState<Error>();
  if (fatalError) {
    throw fatalError;
  }

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("faceImages");
    const listener = () => {
      setRoomImages((prev) => {
        const twoMinAgo = Date.now() - 2 * 60 * 1000;
        const copied = [...prev];
        let changed = false;
        map.forEach((data, uid) => {
          if (uid === userId) return;
          if (!isImageData(data)) return;
          if (data.updated >= twoMinAgo) return;
          const index = copied.findIndex((item) => item.userId === uid);
          if (index === -1) {
            copied.push(data);
            changed = true;
          } else if (data.updated > copied[index].updated) {
            copied[index] = data;
            changed = true;
          }
        });
        if (changed) {
          return copied;
        }
        return prev;
      });
    };
    map.observe(listener);
    const unsub = subscribe(roomState.userIdMap, () => {
      setRoomImages((prev) => {
        const next = prev.filter((item) => roomState.userIdMap[item.userId]);
        return prev.length !== next.length ? next : prev;
      });
    });
    return () => {
      unsub();
      map.unobserve(listener);
    };
  }, [roomId, userId]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("faceImages");
    const checkObsoletedImage = () => {
      const tenMinAgo = Date.now() - 10 * 60 * 1000;
      setRoomImages((prev) => {
        const next = prev.flatMap((item) => {
          if (item.updated < tenMinAgo) {
            return [];
          }
          return [item];
        });
        return prev.length !== next.length ? next : prev;
      });
    };
    let didCleanup = false;
    let timer: NodeJS.Timeout;
    const loop = async () => {
      if (didCleanup) return;
      try {
        checkObsoletedImage();
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
        map.set(userId, data);
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
