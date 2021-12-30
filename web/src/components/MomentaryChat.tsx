import { memo, useState, useRef, useEffect, useCallback } from "react";
import DOMPurify from "dompurify";

import "./MomentaryChat.css";
import { useMomentaryChat, ChatItem } from "../hooks/useMomentaryChat";
import { EmojiPicker } from "../utils/emoji";
import { WysiwygEditor } from "./WysiwygEditor";
import { useNotification } from "../hooks/useNotification";

const MAX_CHAT_TEXT_SIZE = 1 * 1024 * 1024;

type ChatList = ReturnType<typeof useMomentaryChat>["chatList"];
type ReplyChat = ReturnType<typeof useMomentaryChat>["replyChat"];

const sanitize = (text: string) => ({
  __html: DOMPurify.sanitize(text, { ADD_ATTR: ["target"] }),
});

const getChatTime = (item: ChatItem) =>
  new Date(item.createdAt).toLocaleString().split(" ")[1].slice(0, -3);

const MomentaryChatContentPart = memo<{
  item: ChatItem;
  replyChat: ReplyChat;
}>(({ item, replyChat }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const reply = (text: string) => replyChat(text, item.messageId);
  return (
    <li key={item.messageId} className="MomentaryChat-listPart">
      {openEmojiPicker && (
        <EmojiPicker
          onSelect={(e) => {
            reply(e.native);
            setOpenEmojiPicker(false);
          }}
          style={{ width: "100%" }}
        />
      )}
      <div className="MomentaryChat-listPart-header">
        <div className="MomentaryChat-iconButton-container">
          <div className="MomentaryChat-iconButton">
            <button
              type="button"
              onClick={() => {
                setOpenEmojiPicker(!openEmojiPicker);
              }}
            >
              +
            </button>
          </div>
        </div>
        <span className="MomentaryChat-nickname">
          {item.nickname || "No Name"}
        </span>
        <span className="MomentaryChat-time">{getChatTime(item)}</span>
      </div>
      <div
        className="MomentaryChat-text ck-content"
        dangerouslySetInnerHTML={sanitize(item.text)}
      />
      {(item.replies || []).map(([text, count]) => (
        <button
          key={text}
          className="MomentaryChat-icon"
          type="button"
          onClick={() => reply(text)}
        >
          {text} {count}
        </button>
      ))}
    </li>
  );
});

const MomentaryChatContent = memo<{
  chatList: ChatList;
  replyChat: ReplyChat;
}>(({ chatList, replyChat }) => {
  const chatListRef = useRef<HTMLUListElement | null>(null);
  const latestMessageId = chatList[0]?.messageId;
  useEffect(() => {
    if (chatListRef.current && latestMessageId) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [latestMessageId]);

  return (
    <ul className="MomentaryChat-list" ref={chatListRef}>
      {chatList.map((item) => (
        <MomentaryChatContentPart
          key={item.messageId}
          item={item}
          replyChat={replyChat}
        />
      ))}
    </ul>
  );
});

export const MomentaryChat = memo<{
  roomId: string;
  userId: string;
  nickname: string;
  uniqueId?: string;
}>(({ roomId, userId, nickname, uniqueId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { chatList, sendChat, replyChat } = useMomentaryChat(
    roomId,
    userId,
    nickname,
    uniqueId
  );

  const clearRef = useRef<() => void>();
  const registerClear = (clear: () => void) => {
    clearRef.current = clear;
  };

  const [canSend, setCanSend] = useState(false);
  const textRef = useRef("");
  const setText = useCallback((t: string) => {
    textRef.current = t;
    setCanSend(!!t && t.length <= MAX_CHAT_TEXT_SIZE);
  }, []);
  const sendText = useCallback(() => {
    if (textRef.current && textRef.current.length <= MAX_CHAT_TEXT_SIZE) {
      sendChat(textRef.current);
      setText("");
      if (clearRef.current) {
        clearRef.current();
      }
    }
  }, [sendChat, setText]);

  const sendNotification = useNotification();
  const latestChatItem = chatList[0];
  useEffect(() => {
    if (
      latestChatItem &&
      latestChatItem.createdAt > Date.now() - 10 * 1000 &&
      new RegExp(`@${nickname}\\b`).test(latestChatItem.text)
    ) {
      sendNotification("You got a new message!");
    }
  }, [nickname, latestChatItem, sendNotification]);

  return (
    <div className="MomentaryChat-container" ref={containerRef}>
      <MomentaryChatContent chatList={chatList} replyChat={replyChat} />
      <div className="MomentaryChat-editor">
        <WysiwygEditor
          registerClear={registerClear}
          onChange={setText}
          onMetaEnter={sendText}
        />
      </div>
      <div className="MomentaryChat-button">
        <button type="button" onClick={sendText} disabled={!canSend}>
          Send
        </button>
      </div>
    </div>
  );
});

export default MomentaryChat;
