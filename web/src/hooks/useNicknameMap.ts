import { useCallback, useState } from "react";

import { isObject } from "../utils/types";
import { useRoomData } from "./useRoom";

type Entry = {
  roomId: string;
  userId: string;
  nickname: string;
  lastUpdated: number;
};
const cache: Entry[] = [];
const TTL = 10 * 60 * 1000; // 10min

const createMapFromCache = (roomId: string) => {
  const map: { [userId: string]: string } = {};
  cache.forEach((entry) => {
    if (entry.roomId === roomId) {
      map[entry.userId] = entry.nickname;
    }
  });
  return map;
};

const hasInfoNickname = (x: unknown): x is { info: { nickname: string } } =>
  isObject(x) &&
  isObject((x as { info: unknown }).info) &&
  typeof (x as { info: { nickname: unknown } }).info.nickname === "string";

export const useNicknameMap = (roomId: string, userId: string) => {
  const [nicknameMap, setNicknameMap] = useState<{
    [userId: string]: string;
  }>(() => createMapFromCache(roomId));
  useRoomData(
    roomId,
    userId,
    useCallback(
      (data, info) => {
        if (!hasInfoNickname(data)) return;
        const index = cache.findIndex(
          (entry) => entry.roomId === roomId && entry.userId === info.userId
        );
        const now = Date.now();
        if (index >= 0) {
          if (cache[index].nickname !== data.info.nickname) {
            cache[index].nickname = data.info.nickname;
          }
          cache[index].lastUpdated = now;
        } else {
          cache.push({
            roomId,
            userId: info.userId,
            nickname: data.info.nickname,
            lastUpdated: now,
          });
        }
        for (let i = cache.length - 1; i >= 0; i -= 1) {
          if (cache[i].lastUpdated + TTL < now) {
            cache.splice(i, 1);
          }
        }
        setNicknameMap((prev) => {
          const map = createMapFromCache(roomId);
          const keys = Object.keys(map);
          if (
            keys.length === Object.keys(prev).length &&
            keys.every((key) => map[key] === prev[key])
          ) {
            return prev;
          }
          return map;
        });
      },
      [roomId]
    )
  );
  return nicknameMap;
};
