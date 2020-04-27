import { useCallback, useState } from "react";

import { useRoomData } from "./useRoom";

type ImageUrl = string;
type FaceInfo = {
  nickname: string;
  message: string;
};
type ImageData = {
  image: ImageUrl;
  info: FaceInfo;
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

export const useNicknameMap = (roomId: string, userId: string) => {
  const [nicknameMap, setNicknameMap] = useState<{
    [userId: string]: string;
  }>({});
  useRoomData(
    roomId,
    userId,
    useCallback((data, info) => {
      if (!isImageData(data)) return;
      setNicknameMap((prev) => ({
        ...prev,
        [info.userId]: data.info.nickname,
      }));
    }, [])
  );
  return nicknameMap;
};
