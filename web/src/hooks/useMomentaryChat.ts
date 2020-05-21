import { useState, useCallback, useRef } from "react";

import { sleep } from "../utils/sleep";
import { secureRandomId } from "../utils/crypto";
import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData, useRoomNewPeer } from "./useRoom";

const MAX_CHAT_LIST_SIZE = 100;
const MAX_CHAT_HISTORY_SIZE = 1000;

type ChatData = {
  userId: string;
  nickname: string;
  messageId: string;
  createdAt: number; // in millisecond
  chatText: string;
  chatInReplyTo?: string; // messageId
};

const isChatData = (x: unknown): x is ChatData =>
  isObject(x) &&
  typeof (x as { userId: unknown }).userId === "string" &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { messageId: unknown }).messageId === "string" &&
  typeof (x as { createdAt: unknown }).createdAt === "number" &&
  typeof (x as { chatText: unknown }).chatText === "string" &&
  (typeof (x as { chatInReplyTo: unknown }).chatInReplyTo === "undefined" ||
    typeof (x as { chatInReplyTo: unknown }).chatInReplyTo === "string");

type Reply = [string, number];

export type ChatItem = {
  messageId: string;
  nickname: string;
  createdAt: number; // in millisecond
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
  const chatHistory = useRef<ChatData[]>([]);
  const [chatList, setChatList] = useState<ChatItem[]>([]);

  const addChatItem = useCallback((chatData: ChatData) => {
    if (chatHistory.current.some((x) => x.messageId === chatData.messageId)) {
      return;
    }
    chatHistory.current.unshift(chatData);
    if (chatHistory.current.length > MAX_CHAT_HISTORY_SIZE) {
      chatHistory.current.pop();
    }
    if (chatData.chatInReplyTo) {
      const { chatText, chatInReplyTo } = chatData;
      setChatList((prev) =>
        prev.map((item) => {
          if (item.messageId === chatInReplyTo) {
            const replyMap = new Map(item.replies);
            replyMap.set(chatText, (replyMap.get(chatText) || 0) + 1);
            const replies = [...replyMap.entries()];
            replies.sort(compareReply);
            return { ...item, replies };
          }
          return item;
        })
      );
      return;
    }
    const chatItem: ChatItem = {
      messageId: chatData.messageId,
      nickname: chatData.nickname,
      createdAt: chatData.createdAt,
      text: chatData.chatText,
      replies: [],
      time: new Date(chatData.createdAt)
        .toLocaleString()
        .split(" ")[1]
        .slice(0, -3),
    };
    setChatList((prev) => {
      const newList = [chatItem, ...prev];
      if (newList.length > MAX_CHAT_LIST_SIZE) {
        newList.pop();
      }
      newList.sort((a, b) => b.createdAt - a.createdAt); // slow?
      return newList;
    });
  }, []);

  useRoomNewPeer(
    roomId,
    userId,
    useCallback(async function* getInitialDataIterator() {
      // TODO do not let all peers send initial data
      // XXX it might be better to return packed chatList
      for (let i = chatHistory.current.length - 1; i >= 0; i -= 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(Math.random() * 5000);
        yield chatHistory.current[i];
      }
    }, [])
  );

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
        messageId: secureRandomId(),
        createdAt: Date.now(),
        chatText: text,
      };
      broadcastData(data);
      addChatItem(data);
    },
    [broadcastData, userId, nickname, addChatItem]
  );

  const replyChat = useCallback(
    (text: string, inReplyTo: string) => {
      const data: ChatData = {
        userId,
        nickname,
        messageId: secureRandomId(),
        createdAt: Date.now(),
        chatText: text,
        chatInReplyTo: inReplyTo,
      };
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
