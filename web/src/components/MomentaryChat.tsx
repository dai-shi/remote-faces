import React, { useState, useRef, useLayoutEffect } from "react";

import "./MomentaryChat.css";
import { useMomentaryChat } from "../hooks/useMomentaryChat";

type ChatList = ReturnType<typeof useMomentaryChat>["chatList"];
type ReplyChat = ReturnType<typeof useMomentaryChat>["replyChat"];

const reactions = ["👍", "❤️", "😁", "😎", "🤣"];

const ReactionButton = React.memo<{
  text: string;
  onClick: (text: string) => void;
}>(({ text, onClick }) => (
  <button type="button" onClick={() => onClick(text)}>
    <span aria-label="Reaction">{text}</span>
  </button>
));

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
      {chatList.map((item) => {
        const reply = (text: string) => replyChat(text, item.replyTo);
        return (
          <li key={item.key} className="MomentaryChat-listPart">
            <div className="MomentaryChat-listPart-header">
              <div className="MomentaryChat-iconButton-container">
                <div className="MomentaryChat-iconButton">
                  {reactions.map((text) => (
                    <ReactionButton key={text} text={text} onClick={reply} />
                  ))}
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
                className="Momentary-icon"
                type="button"
                onClick={() => reply(text)}
              >
                {text} {count}
              </button>
            ))}
          </li>
        );
      })}
    </ul>
  );
});

export const MomentaryChat = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const containerRef = useRef<HTMLDivElement>();
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
