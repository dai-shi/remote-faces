import { useCallback, useState, useRef, useEffect } from "react";

import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData } from "./useRoom";

export type AvatarData = {
  position: [number, number, number];
};

const isAvatarData = (x: unknown): x is AvatarData => {
  try {
    const obj = x as AvatarData;
    if (
      typeof obj.position[0] !== "number" ||
      typeof obj.position[1] !== "number" ||
      typeof obj.position[2] !== "number"
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

const isEqualAvatarData = (a: AvatarData, b?: AvatarData) =>
  b &&
  a.position[0] === b.position[0] &&
  a.position[1] === b.position[1] &&
  a.position[2] === b.position[2];

export type AvatarMap = {
  [userId: string]: AvatarData;
};

const isAvatarMap = (x: unknown): x is AvatarMap =>
  isObject(x) && Object.values(x).every(isAvatarData);

type AreaData = {
  avatarMap: AvatarMap;
  updatedAt: number; // in millisecond
};

const isAreaData = (x: unknown): x is AreaData =>
  isObject(x) &&
  isAvatarMap(x.avatarMap) &&
  typeof (x as { updatedAt: unknown }).updatedAt === "number";

type SpatialAreaData =
  | {
      spatialArea: "init";
    }
  | {
      spatialArea: "sync";
      areaData: AreaData;
    };

const isSpatialAreaData = (x: unknown): x is SpatialAreaData =>
  isObject(x) &&
  ((x as { spatialArea: unknown }).spatialArea === "init" ||
    ((x as { spatialArea: unknown }).spatialArea === "sync" &&
      isAreaData((x as { areaData: unknown }).areaData)));

export const useSpatialArea = (roomId: string, userId: string) => {
  const [avatarMap, setAvatarMap] = useState<AvatarMap>({});
  const lastAreaDataRef = useRef<AreaData>();

  const broadcastData = useBroadcastData(roomId, userId);
  const dataToBroadcast = useRef<SpatialAreaData>();
  const setAvatar = useCallback(
    (uid: string, avatarData: AvatarData) => {
      const nextAvatarMap = {
        ...lastAreaDataRef.current?.avatarMap,
        [uid]: avatarData,
      };
      setAvatarMap(nextAvatarMap);
      lastAreaDataRef.current = {
        avatarMap: nextAvatarMap,
        updatedAt: Date.now(),
      };
      const data: SpatialAreaData = {
        spatialArea: "sync",
        areaData: lastAreaDataRef.current,
      };
      if (dataToBroadcast.current) {
        dataToBroadcast.current = data;
      } else {
        dataToBroadcast.current = data;
        setTimeout(() => {
          broadcastData(data);
          dataToBroadcast.current = undefined;
        }, 200);
      }
    },
    [broadcastData]
  );

  useRoomData(
    roomId,
    userId,
    useCallback(
      (data) => {
        if (!isSpatialAreaData(data)) return;
        if (data.spatialArea === "init") {
          if (lastAreaDataRef.current) {
            // TODO we don't need to broadcastData but sendData is enough
            broadcastData({
              spatialArea: "sync",
              areaData: lastAreaDataRef.current,
            });
          }
          return;
        }
        // FIXME why do we need this type assertion?
        const { areaData } = data as { areaData: AreaData };
        if (
          lastAreaDataRef.current &&
          lastAreaDataRef.current.updatedAt > areaData.updatedAt
        ) {
          return;
        }
        setAvatarMap((prev) => {
          const prevKeys = Object.keys(prev);
          const nextKeys = Object.keys(areaData.avatarMap);
          if (
            prevKeys.length === nextKeys.length &&
            prevKeys.every((key) =>
              isEqualAvatarData(prev[key], areaData.avatarMap[key])
            )
          ) {
            // bail out
            return prev;
          }
          return {
            ...prev,
            ...areaData.avatarMap,
          };
        });
      },
      [broadcastData]
    )
  );

  useEffect(() => {
    broadcastData({
      spatialArea: "init",
    });
  }, [broadcastData]);

  return {
    avatarMap,
    setAvatar,
  };
};
