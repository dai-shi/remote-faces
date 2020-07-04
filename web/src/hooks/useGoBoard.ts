import { useCallback, useRef, useEffect } from "react";
import { Color } from "wgo";

import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData } from "./useRoom";

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

type GoBoardActionData = {
  action: "play" | "pass" | "undo";
  position: PositionData;
  updatedAt: number; // in millisecond
};

const isGoBoardActionData = (x: unknown): x is GoBoardData =>
  isObject(x) &&
  isAction((x as { action: unknown }).action) &&
  typeof (x as { updatedAt: unknown }).updatedAt === "number" &&
  isPositionData((x as { position: unknown }).position);

type GoBoardData =
  | {
      goBoard: "init";
    }
  | {
      goBoard: "action";
      actionData: GoBoardActionData;
    };

const isGoBoardData = (x: unknown): x is GoBoardData =>
  (isObject(x) && (x as { goBoard: unknown }).goBoard === "init") ||
  ((x as { goBoard: unknown }).goBoard === "action" &&
    isGoBoardActionData((x as { actionData: unknown }).actionData));

export const useGoBoard = (
  roomId: string,
  userId: string,
  receiveData: (action: Action, position: PositionData) => void
) => {
  const lastActionDataRef = useRef<GoBoardActionData>();

  const broadcastData = useBroadcastData(roomId, userId);
  const sendData = useCallback(
    (action: Action, position: PositionData) => {
      const actionData: GoBoardActionData = {
        action,
        position,
        updatedAt: Date.now(),
      };
      const data: GoBoardData = {
        goBoard: "action",
        actionData,
      };
      broadcastData(data);
      lastActionDataRef.current = actionData;
    },
    [broadcastData]
  );

  useRoomData(
    roomId,
    userId,
    useCallback(
      (data) => {
        if (!isGoBoardData(data)) return;
        if (data.goBoard === "init") {
          if (lastActionDataRef.current) {
            // TODO we don't need to broadcastData but sendData is enough
            broadcastData({
              goBoard: "action",
              actionData: lastActionDataRef.current,
            });
          }
          return;
        }
        // FIXME why do we need this type assertion?
        const { actionData } = data as { actionData: GoBoardActionData };
        if (
          lastActionDataRef.current &&
          lastActionDataRef.current.updatedAt > actionData.updatedAt
        ) {
          return;
        }
        lastActionDataRef.current = actionData;
        receiveData(actionData.action, actionData.position);
      },
      [broadcastData, receiveData]
    )
  );

  useEffect(() => {
    broadcastData({
      goBoard: "init",
    });
  }, [broadcastData]);

  return {
    sendData,
  };
};
