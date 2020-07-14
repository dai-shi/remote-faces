import { useState, useCallback, useRef, useEffect } from "react";

import { secureRandomId } from "../utils/crypto";
import { isObject } from "../utils/types";
import { useRoomData, useBroadcastData, useRoomNewPeer } from "./useRoom";

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
  inReplyTo?: string; // messageId
  replies?: Reply[];
};

const isChatItem = (x: unknown): x is ChatItem =>
  isObject(x) &&
  typeof (x as { nickname: unknown }).nickname === "string" &&
  typeof (x as { messageId: unknown }).messageId === "string" &&
  typeof (x as { createdAt: unknown }).createdAt === "number" &&
  typeof (x as { text: unknown }).text === "string" &&
  (typeof (x as { inReplyTo: unknown }).inReplyTo === "undefined" ||
    typeof (x as { inReplyTo: unknown }).inReplyTo === "string") &&
  (typeof (x as { replies: unknown }).replies === "undefined" ||
    isReplies((x as { replies: unknown }).replies));

type ChatData = {
  chat: ChatItem;
};

const isChatData = (x: unknown): x is ChatData =>
  isObject(x) && isChatItem((x as { chat: unknown }).chat);

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
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const chatListRef = useRef(chatList);
  useEffect(() => {
    chatListRef.current = chatList;
  });

  const addChatItem = useCallback((chatItem: ChatItem) => {
    if (chatItem.inReplyTo) {
      const { text, inReplyTo } = chatItem;
      setChatList((prev) =>
        prev.map((item) => {
          if (item.messageId === inReplyTo) {
            const replyMap = new Map(item.replies);
            replyMap.set(text, (replyMap.get(text) || 0) + 1);
            const replies = [...replyMap.entries()];
            replies.sort(compareReply);
            return { ...item, replies };
          }
          return item;
        })
      );
      return;
    }
    setChatList((prev) => {
      if (prev.some((item) => item.messageId === chatItem.messageId)) {
        // Migration: This can happen if a peer with old version is connected.
        return prev;
      }
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
    useCallback((send) => {
      // TODO do not let all peers send initial data
      chatListRef.current.forEach((chatItem) => {
        const data: ChatData = {
          chat: chatItem,
        };
        send(data);
      });
    }, [])
  );

  const broadcastData = useBroadcastData(roomId, userId);

  useRoomData(
    roomId,
    userId,
    useCallback(
      (data) => {
        if (isChatData(data)) {
          addChatItem(data.chat);
        }
      },
      [addChatItem]
    )
  );

  const sendChat = useCallback(
    (text: string) => {
      const chatItem: ChatItem = {
        nickname,
        messageId: secureRandomId(),
        createdAt: Date.now(),
        text,
      };
      const data: ChatData = {
        chat: chatItem,
      };
      broadcastData(data);
      addChatItem(chatItem);
    },
    [broadcastData, nickname, addChatItem]
  );

  const replyChat = useCallback(
    (text: string, inReplyTo: string) => {
      const chatItem: ChatItem = {
        nickname,
        messageId: secureRandomId(),
        createdAt: Date.now(),
        text,
        inReplyTo,
      };
      const data: ChatData = {
        chat: chatItem,
      };
      broadcastData(data);
      addChatItem(chatItem);
    },
    [broadcastData, nickname, addChatItem]
  );

  return {
    chatList,
    sendChat,
    replyChat,
  };
};
