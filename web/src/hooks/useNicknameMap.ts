import { useEffect, useState } from "react";

import { isObject } from "../utils/types";
import { getRoomState } from "../states/roomMap";

const hasInfoNickname = (x: unknown): x is { info: { nickname: string } } =>
  isObject(x) &&
  isObject((x as { info: unknown }).info) &&
  typeof (x as { info: { nickname: unknown } }).info.nickname === "string";

type NicknameMap = {
  [userId: string]: string;
};

export const useNicknameMap = (roomId: string, userId: string) => {
  const [nicknameMap, setNicknameMap] = useState<NicknameMap>({});

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("faceImages");
    const listener = () => {
      setNicknameMap((prev) => {
        const copied = { ...prev };
        let changed = false;
        map.forEach((data, uid) => {
          if (uid === userId) return;
          if (!hasInfoNickname(data)) return;
          if (!copied[uid]) {
            copied[uid] = data.info.nickname;
            changed = true;
          } else if (data.info.nickname !== copied[uid]) {
            copied[uid] = data.info.nickname;
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
    return () => {
      map.unobserve(listener);
    };
  }, [roomId, userId]);

  return nicknameMap;
};
