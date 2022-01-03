import { useCallback, useEffect } from "react";
import { Color } from "wgo";
import { subscribe } from "valtio";

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
  const roomState = getRoomState(roomId, userId);
  const boardType = `${uniqueBoardId || "go"}Board`;
  if (!roomState.extraDataListMap[boardType]) {
    roomState.extraDataListMap[boardType] = [];
  }
  const boardListState = roomState.extraDataListMap[boardType];

  useEffect(() => {
    const listener = () => {
      syncDown(
        boardListState.flatMap((item) => {
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
    const unsub = subscribe(boardListState, listener);
    listener();
    return unsub;
  }, [boardListState, syncDown]);

  const syncUp = useCallback(
    (positions: PositionData[]) => {
      if (boardListState.length < positions.length) {
        boardListState.push(
          ...positions
            .slice(boardListState.length)
            .map((x) => JSON.stringify(x))
        );
      } else if (boardListState.length > positions.length) {
        boardListState.splice(
          positions.length,
          boardListState.length - positions.length
        );
      }
    },
    [boardListState]
  );

  return { syncUp };
};
