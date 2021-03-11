import { useState, useRef, useEffect } from "react";
import { subscribe } from "valtio";

import { getRoomState } from "../states/roomMap";

const getInitialPosition = (uid: string): [number, number, number] => [
  parseInt(uid.slice(0, 2), 16) / 128 - 1,
  parseInt(uid.slice(2, 4), 16) / 128 - 1,
  0,
];

export type AvatarData = {
  statusMesg: string;
  position: [number, number, number];
};

const isAvatarData = (x: unknown): x is AvatarData => {
  try {
    const obj = x as AvatarData;
    if (
      typeof obj.statusMesg === "string" &&
      typeof obj.position[0] === "number" &&
      typeof obj.position[1] === "number" &&
      typeof obj.position[2] === "number"
    ) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const isEqualAvatarData = (a: AvatarData, b: AvatarData) =>
  a.statusMesg === b.statusMesg &&
  a.position[0] === b.position[0] &&
  a.position[1] === b.position[1] &&
  a.position[2] === b.position[2];

export type AvatarMap = {
  [userId: string]: AvatarData;
};

export const useSpatialArea = (
  roomId: string,
  userId: string,
  statusMesg: string
) => {
  const [avatarMap, setAvatarMap] = useState<AvatarMap>({});
  const [myAvatar, setMyAvatar] = useState<AvatarData>({
    statusMesg,
    position: getInitialPosition(userId),
  });
  useEffect(() => {
    setMyAvatar((prev) => {
      if (prev.statusMesg === statusMesg) {
        return prev;
      }
      return { ...prev, statusMesg };
    });
  }, [statusMesg]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("spatialArea");
    const listener = () => {
      setAvatarMap((prev) => {
        const copied = { ...prev };
        let changed = false;
        map.forEach((data, uid) => {
          if (uid === userId) return;
          if (!isAvatarData(data)) return;
          if (!copied[uid] && roomState.userIdMap[uid]) {
            copied[uid] = data;
            changed = true;
          } else if (copied[uid] && !isEqualAvatarData(data, copied[uid])) {
            copied[uid] = data;
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
    listener();
    const unsub = subscribe(roomState.userIdMap, () => {
      setAvatarMap((prev) => {
        const keys = Object.keys(prev);
        const next = keys.filter((uid) => roomState.userIdMap[uid]);
        if (keys.length !== next.length) {
          const nextAvatarMap: AvatarMap = {};
          next.forEach((uid) => {
            nextAvatarMap[uid] = prev[uid];
          });
          return nextAvatarMap;
        }
        return prev;
      });
    });
    return () => {
      unsub();
      map.unobserve(listener);
    };
  }, [roomId, userId]);

  const dataToBroadcast = useRef<AvatarData>();
  useEffect(() => {
    if (!myAvatar) return;
    if (dataToBroadcast.current) {
      dataToBroadcast.current = myAvatar;
    } else {
      dataToBroadcast.current = myAvatar;
      setTimeout(() => {
        const roomState = getRoomState(roomId, userId);
        const map = roomState.ydoc.getMap("spatialArea");
        map.set(userId, dataToBroadcast.current);
        dataToBroadcast.current = undefined;
      }, 500);
    }
  }, [roomId, userId, myAvatar]);

  return {
    avatarMap,
    myAvatar,
    setMyAvatar,
  };
};
