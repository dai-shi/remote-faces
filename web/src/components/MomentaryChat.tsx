import React, { useState, useRef, useLayoutEffect } from "react";

import "./MomentaryChat.css";
import { useMomentaryChat, ChatItem } from "../hooks/useMomentaryChat";
import { EmojiPicker } from "../utils/emoji";

type ChatList = ReturnType<typeof useMomentaryChat>["chatList"];
type ReplyChat = ReturnType<typeof useMomentaryChat>["replyChat"];

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
      <div>{item.text}</div>
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
  onUpdateLayout: (height: number) => void;
}>(({ chatList, replyChat, onUpdateLayout }) => {
  const chatListRef = useRef<HTMLUListElement | null>(null);
  useLayoutEffect(() => {
    if (chatListRef.current) {
      onUpdateLayout(chatListRef.current.scrollHeight);
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

  const [text, setText] = useState("");
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text) {
      sendChat(text);
      setText("");
    }
  };

  return (
    <div className="MomentaryChat-container" ref={containerRef}>
      <MomentaryChatContent
        chatList={chatList}
        replyChat={replyChat}
        onUpdateLayout={(height: number) => {
          if (containerRef.current) {
            containerRef.current.scrollTop = height;
          }
        }}
      />
      <form onSubmit={onSubmit}>
        <div className="MomentaryChat-message-input-area">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter chat message"
          />
          <button type="submit" disabled={!text}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
});
