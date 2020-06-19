import { useCallback, useRef } from "react";
import { Color } from "wgo";

import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData, useRoomNewPeer } from "./useRoom";

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

export type Action = "play" | "pass" | "undo";

const isAction = (x: unknown): x is Action =>
  ["play", "pass", "undo"].indexOf(x as string) >= 0;

type GoBoardData = {
  action: "play" | "pass" | "undo";
  position: PositionData;
  updatedAt: number; // in millisecond
};

const isGoBoardData = (x: unknown): x is GoBoardData =>
  isObject(x) &&
  isAction((x as { action: unknown }).action) &&
  typeof (x as { updatedAt: unknown }).updatedAt === "number" &&
  isPositionData((x as { position: unknown }).position);

export const useGoBoard = (
  roomId: string,
  userId: string,
  receiveData: (action: Action, position: PositionData) => void
) => {
  const lastDataRef = useRef<GoBoardData>();
  useRoomNewPeer(
    roomId,
    userId,
    useCallback(async function* getInitialDataIterator() {
      if (!lastDataRef.current) return;
      yield lastDataRef.current;
    }, [])
  );

  const broadcastData = useBroadcastData(roomId, userId);
  const sendData = useCallback(
    (action: Action, position: PositionData) => {
      const data: GoBoardData = {
        action,
        position,
        updatedAt: Date.now(),
      };
      broadcastData(data);
      lastDataRef.current = data;
    },
    [broadcastData]
  );

  useRoomData(
    roomId,
    userId,
    useCallback(
      (data) => {
        if (!isGoBoardData(data)) return;
        if (
          lastDataRef.current &&
          lastDataRef.current.updatedAt > data.updatedAt
        ) {
          return;
        }
        lastDataRef.current = data;
        receiveData(data.action, data.position);
      },
      [receiveData]
    )
  );

  return {
    sendData,
  };
};
