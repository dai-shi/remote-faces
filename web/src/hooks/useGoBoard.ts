import { useCallback, useEffect } from "react";
import { Color } from "wgo";

import { getRoomState } from "../states/roomMap";

export type PositionData = {
  size: number;
  grid: Color[];
  capCount: { black: number; white: number };
  turn: Color.B | Color.W;
};

const isPositionData = (x: unknown): x is PositionData => {
  try {
    const obj = x as PositionData;
    if (typeof obj.size !== "number") return false;
    if (obj.grid.length !== obj.size * obj.size) return false;
    if (obj.grid.some((c) => c !== Color.B && c !== Color.W && c !== Color.E)) {
      return false;
    }
    if (
      typeof obj.capCount.black !== "number" ||
      typeof obj.capCount.white !== "number"
    ) {
      return false;
    }
    if (obj.turn !== Color.B && obj.turn !== Color.W) return false;
    return true;
  } catch (e) {
    return false;
  }
};

export type Action =
  | {
      type: "play";
      position: PositionData;
    }
  | {
      type: "pass";
      position: PositionData;
    }
  | {
      type: "undo";
    };

export const useGoBoard = (
  roomId: string,
  userId: string,
  syncDown: (positions: PositionData[]) => void,
  uniqueBoardId?: string
) => {
  const boardType = `${uniqueBoardId || "go"}Board`;
  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    const list = roomState.ydoc.getArray(boardType);
    const listener = () => {
      syncDown(
        list.toArray().flatMap((item) => {
          try {
            const data = JSON.parse(item as string);
            if (isPositionData(data)) {
              return [data];
            }
          } catch (e) {
            // ignored
          }
          return [];
        })
      );
    };
    list.observe(listener);
    listener();
    return () => {
      list.unobserve(listener);
    };
  }, [roomId, userId, syncDown, boardType]);

  const syncUp = useCallback(
    (positions: PositionData[]) => {
      const roomState = getRoomState(roomId, userId);
      const list = roomState.ydoc.getArray(boardType);
      if (list.length < positions.length) {
        list.push(positions.slice(list.length).map((x) => JSON.stringify(x)));
      } else if (list.length > positions.length) {
        list.delete(positions.length, list.length - positions.length);
      }
    },
    [roomId, userId, boardType]
  );

  return { syncUp };
};
