import { useEffect, useState } from "react";
import { subscribe } from "valtio";

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
    return subscribe(roomState.faceImages, () => {
      setNicknameMap((prev) => {
        const copied = { ...prev };
        let changed = false;
        Object.entries(roomState.faceImages).forEach(([uid, data]) => {
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
    });
  }, [roomId, userId]);

  return nicknameMap;
};
