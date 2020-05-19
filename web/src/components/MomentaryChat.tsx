import React, { useState, useRef, useLayoutEffect } from "react";
import DOMPurify from "dompurify";

import "./MomentaryChat.css";
import { useMomentaryChat, ChatItem } from "../hooks/useMomentaryChat";
import { EmojiPicker } from "../utils/emoji";
import { WysiwygEditor } from "./WysiwygEditor";

type ChatList = ReturnType<typeof useMomentaryChat>["chatList"];
type ReplyChat = ReturnType<typeof useMomentaryChat>["replyChat"];

const sanitize = (text: string) => ({
  __html: DOMPurify.sanitize(text),
});

const MomentaryChatContentPart = React.memo<{
  item: ChatItem;
  replyChat: ReplyChat;
}>(({ item, replyChat }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const reply = (text: string) => replyChat(text, item.replyTo);
  return (
    <li key={item.key} className="MomentaryChat-listPart">
      {openEmojiPicker && (
        <EmojiPicker
          onSelect={(e) => {
            reply(e.native);
            setOpenEmojiPicker(false);
          }}
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
        <span className="MomentaryChat-time">{item.time}</span>
      </div>
      <div
        className="MomentaryChat-text ck-content"
        dangerouslySetInnerHTML={sanitize(item.text)}
      />
      {item.replies.map(([text, count]) => (
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

const MomentaryChatContent = React.memo<{
  chatList: ChatList;
  replyChat: ReplyChat;
}>(({ chatList, replyChat }) => {
  const chatListRef = useRef<HTMLUListElement | null>(null);
  useLayoutEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  });

  return (
    <ul className="MomentaryChat-list" ref={chatListRef}>
      {chatList.map((item) => (
        <MomentaryChatContentPart
          key={item.key}
          item={item}
          replyChat={replyChat}
        />
      ))}
    </ul>
  );
});

export const MomentaryChat = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { chatList, sendChat, replyChat } = useMomentaryChat(
    roomId,
    userId,
    nickname
  );

  const clearRef = useRef<() => void>();
  const registerClear = (clear: () => void) => {
    clearRef.current = clear;
  };

  const [text, setText] = useState("");
  const onClick = () => {
    if (text) {
      sendChat(text);
      setText("");
      if (clearRef.current) {
        clearRef.current();
      }
    }
  };

  return (
    <div className="MomentaryChat-container" ref={containerRef}>
      <MomentaryChatContent chatList={chatList} replyChat={replyChat} />
      <div className="MomentaryChat-editor">
        <WysiwygEditor registerClear={registerClear} onChange={setText} />
      </div>
      <div className="MomentaryChat-button">
        <button type="button" onClick={onClick} disabled={!text}>
          Send
        </button>
      </div>
    </div>
  );
});
