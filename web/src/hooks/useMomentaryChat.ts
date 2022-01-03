import { useCallback } from "react";
import { useSnapshot } from "valtio";

import { secureRandomId } from "../utils/crypto";
import { isObject } from "../utils/types";
import { getRoomState } from "../states/roomMap";

const MAX_CHAT_LIST_SIZE = 100;

type Reply = [string, number];

const isReply = (x: unknown): x is Reply =>
  Array.isArray(x) &&
  x.length === 2 &&
  typeof x[0] === "string" &&
  typeof x[1] === "number";

const isReplies = (x: unknown): x is Reply[] =>
  Array.isArray(x) && x.every(isReply);

export type ChatItem = {
  nickname: string;
  messageId: string;
  createdAt: number; // in millisecond
  text: string;
  replies: Reply[];
};

const isChatItem = (x: unknown): x is ChatItem =>
  isObject(x) &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { messageId: unknown }).messageId === "string" &&
  typeof (x as { createdAt: unknown }).createdAt === "number" &&
  typeof (x as { text: unknown }).text === "string" &&
  isReplies((x as { replies: unknown }).replies);

const compareReply = (a: Reply, b: Reply) => {
  const countDiff = b[1] - a[1];
  if (countDiff === 0) {
    return a[0].length - b[0].length;
  }
  return countDiff;
};

export const useMomentaryChat = (
  roomId: string,
  userId: string,
  nickname: string,
  uniqueChatId?: string
) => {
  const roomState = getRoomState(roomId, userId);
  const chatType = `${uniqueChatId || "momentray"}Chat`;
  if (!roomState.extraDataListMap[chatType]) {
    roomState.extraDataListMap[chatType] = [];
  }
  const chatListState = roomState.extraDataListMap[chatType];
  const chatListSnap = useSnapshot(chatListState);
  const chatList = chatListSnap.filter(isChatItem);

  const sendChat = useCallback(
    (text: string) => {
      const chatItem: ChatItem = {
        nickname,
        messageId: secureRandomId(),
        createdAt: Date.now(),
        text,
        replies: [],
      };
      chatListState.unshift(chatItem);
      if (chatListState.length > MAX_CHAT_LIST_SIZE) {
        chatListState.pop();
      }
    },
    [chatListState, nickname]
  );

  const replyChat = useCallback(
    (text: string, inReplyTo: string) => {
      chatListState.forEach((item) => {
        if (!isChatItem(item)) return;
        if (item.messageId === inReplyTo) {
          const replyMap = new Map(item.replies);
          replyMap.set(text, (replyMap.get(text) || 0) + 1);
          const replies = [...replyMap.entries()];
          replies.sort(compareReply);
          item.replies = replies;
        }
      });
    },
    [chatListState]
  );

  return {
    chatList,
    sendChat,
    replyChat,
  };
};
