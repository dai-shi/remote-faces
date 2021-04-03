import { useCallback, useState, useRef, useEffect } from "react";
import { subscribe } from "valtio";

import { getRoomState } from "../states/roomMap";

const getInitialPosition = (uid: string): [number, number] => [
  parseInt(uid.slice(0, 2), 16) / 2 + 20,
  parseInt(uid.slice(2, 4), 16) / 2 + 20,
];

export type AvatarData = {
  position: [left: number, top: number];
};

const isAvatarData = (x: unknown): x is AvatarData => {
  try {
    const obj = x as AvatarData;
    if (
      typeof obj.position[0] === "number" &&
      typeof obj.position[1] === "number"
    ) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const isEqualAvatarData = (a: AvatarData, b: AvatarData) =>
  a.position[0] === b.position[0] && a.position[1] === b.position[1];

export type RegionData = {
  type: "background" | "meeting" | "chat" | "media" | "goboard";
  position: [left: number, top: number];
  size: [width: number, height: number];
  zIndex?: number;
  background?: string;
  border?: string;
  iframe?: string;
};

const isRegionData = (x: unknown): x is RegionData => {
  try {
    const obj = x as RegionData;
    if (
      ["background", "meeting", "chat", "media", "goboard"].includes(
        obj.type
      ) &&
      typeof obj.position[0] === "number" &&
      typeof obj.position[1] === "number" &&
      typeof obj.size[0] === "number" &&
      typeof obj.size[1] === "number" &&
      (typeof obj.zIndex === "undefined" || typeof obj.zIndex === "number") &&
      (typeof obj.background === "undefined" ||
        typeof obj.background === "string") &&
      (typeof obj.border === "undefined" || typeof obj.border === "string") &&
      (typeof obj.iframe === "undefined" || typeof obj.iframe === "string")
    ) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const isEqualRegionData = (a: RegionData, b: RegionData) =>
  a.type === b.type &&
  a.position[0] === b.position[0] &&
  a.position[1] === b.position[1] &&
  a.size[0] === b.size[0] &&
  a.size[1] === b.size[1] &&
  a.zIndex === b.zIndex &&
  a.background === b.background &&
  a.border === b.border &&
  a.iframe === b.iframe;

export type AvatarMap = {
  [userId: string]: AvatarData;
};

export type RegionMap = {
  [regionId: string]: RegionData;
};

export const ROOM_STATE_KEY = "gatherRegionMap";

export const useGatherArea = (roomId: string, userId: string) => {
  const [avatarMap, setAvatarMap] = useState<AvatarMap>({});
  const [myAvatar, setMyAvatar] = useState<AvatarData>({
    position: getInitialPosition(userId),
  });

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("gatherAvatarMap");
    const listener = () => {
      setAvatarMap((prev) => {
        const copied = { ...prev };
        let changed = false;
        map.forEach((data, uid) => {
          if (uid === userId) return;
          if (!roomState.userIdMap[uid]) return;
          if (!isAvatarData(data)) return;
          if (!copied[uid]) {
            copied[uid] = data;
            changed = true;
          } else if (!isEqualAvatarData(data, copied[uid])) {
            copied[uid] = data;
            changed = true;
          }
        });
        Object.keys(copied).forEach((uid) => {
          if (!roomState.userIdMap[uid]) {
            delete copied[uid];
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
    const unsub = subscribe(roomState.userIdMap, listener);
    listener();
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
        const map = roomState.ydoc.getMap("gatherAvatarMap");
        map.set(userId, dataToBroadcast.current);
        dataToBroadcast.current = undefined;
      }, 500);
    }
  }, [roomId, userId, myAvatar]);

  const [regionMap, setRegionMap] = useState<RegionMap>({});

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap(ROOM_STATE_KEY);
    const listener = () => {
      setRegionMap((prev) => {
        const next: RegionMap = {};
        map.forEach((data, id) => {
          if (!isRegionData(data)) return;
          if (prev[id] && isEqualRegionData(prev[id], data)) {
            next[id] = prev[id];
          } else {
            next[id] = data;
          }
        });
        return next;
      });
    };
    map.observe(listener);
    listener();
    return () => {
      map.unobserve(listener);
    };
  }, [roomId, userId]);

  const updateRegion = useCallback(
    (id: string, data: RegionData) => {
      const roomState = getRoomState(roomId, userId);
      const map = roomState.ydoc.getMap(ROOM_STATE_KEY);
      map.set(id, data);
    },
    [roomId, userId]
  );

  return {
    avatarMap,
    myAvatar,
    setMyAvatar,
    regionMap,
    updateRegion,
  };
};
