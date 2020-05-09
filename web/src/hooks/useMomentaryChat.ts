import { useState, useCallback, useRef } from "react";

import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData } from "./useRoom";

const MAX_CHAT_LIST_SIZE = 100;

type ChatData = {
  userId: string;
  nickname: string;
  chatSeq: number;
  chatText: string;
  chatInReplyTo?: {
    userId: string;
    chatSeq: number;
  };
};

const isChatData = (x: unknown): x is ChatData =>
  isObject(x) &&
  typeof (x as { userId: unknown }).userId === "string" &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { chatSeq: unknown }).chatSeq === "number" &&
  typeof (x as { chatText: unknown }).chatText === "string" &&
  (typeof (x as { chatInReplyTo: unknown }).chatInReplyTo === "undefined" ||
    typeof (x as { chatInReplyTo: { userId: unknown } }).chatInReplyTo
      .userId === "string" ||
    typeof (x as { chatInReplyTo: { chatSeq: unknown } }).chatInReplyTo
      .chatSeq === "number");

type Reply = [string, number];

export type ChatItem = {
  key: string;
  replyTo: { userId: string; chatSeq: number };
  nickname: string;
  text: string;
  replies: Reply[];
  time: string;
};

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
  nickname: string
) => {
  const chatSeqRef = useRef(1);
  const receivedSeqMap = useRef(new Map<string, number>());
  const [chatList, setChatList] = useState<ChatItem[]>([]);

  const addChatItem = useCallback((chatData: ChatData) => {
    if ((receivedSeqMap.current.get(chatData.userId) || 0) < chatData.chatSeq) {
      receivedSeqMap.current.set(chatData.userId, chatData.chatSeq);
    } else {
      return;
    }
    if (chatData.chatInReplyTo) {
      const { chatText, chatInReplyTo } = chatData;
      setChatList((prev) =>
        prev.map((item) => {
          if (
            item.replyTo.userId === chatInReplyTo.userId &&
            item.replyTo.chatSeq === chatInReplyTo.chatSeq
          ) {
            const replyMap = new Map(item.replies);
            replyMap.set(chatText, (replyMap.get(chatText) || 0) + 1);
            const replies = [...replyMap.entries()];
            replies.sort(compareReply);
            return { ...item, replies };
          }
          return item;
        })
      );
    } else {
      const time = new Date();
      const chatItem: ChatItem = {
        key: `${chatData.userId}_${chatData.chatSeq}`,
        replyTo: {
          userId: chatData.userId,
          chatSeq: chatData.chatSeq,
        },
        nickname: chatData.nickname,
        text: chatData.chatText,
        replies: [],
        time: time.toLocaleString().split(" ")[1].slice(0, -3),
      };
      setChatList((prev) => [chatItem, ...prev].slice(0, MAX_CHAT_LIST_SIZE));
    }
  }, []);

  const broadcastData = useBroadcastData(roomId, userId);
  useRoomData(
    roomId,
    userId,
    useCallback(
      (data) => {
        if (!isChatData(data)) return;
        addChatItem(data);
      },
      [addChatItem]
    )
  );

  const sendChat = useCallback(
    (text: string) => {
      const data: ChatData = {
        userId,
        nickname,
        chatSeq: chatSeqRef.current,
        chatText: text,
      };
      chatSeqRef.current += 1;
      broadcastData(data);
      addChatItem(data);
    },
    [broadcastData, userId, nickname, addChatItem]
  );

  const replyChat = useCallback(
    (text: string, inReplyTo: { userId: string; chatSeq: number }) => {
      const data: ChatData = {
        userId,
        nickname,
        chatSeq: chatSeqRef.current,
        chatText: text,
        chatInReplyTo: inReplyTo,
      };
      chatSeqRef.current += 1;
      broadcastData(data);
      addChatItem(data);
    },
    [broadcastData, userId, nickname, addChatItem]
  );

  return {
    chatList,
    sendChat,
    replyChat,
  };
};
