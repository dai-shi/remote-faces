import React, { useState } from "react";

import "./MomentaryChat.css";
import { useMomentaryChat } from "../hooks/useMomentaryChat";

type ChatList = ReturnType<typeof useMomentaryChat>["chatList"];
type ReplyChat = ReturnType<typeof useMomentaryChat>["replyChat"];

const reactions = ["👍", "❤️", "😁", "😎", "🤣"];

const ReactionButton: React.FC<{
  text: string;
  onClick: (text: string) => void;
}> = ({ text, onClick }) => (
  <button type="button" onClick={() => onClick(text)}>
    <span aria-label="Reaction">{text}</span>
  </button>
);

const MomentaryChatContent = React.memo<{
  chatList: ChatList;
  replyChat: ReplyChat;
}>(({ chatList, replyChat }) => (
  <ul className="MomentaryChat-list">
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
            <div className="MomentaryChat-nickname">
              {item.nickname || "No Name"}
            </div>
            <div className="MomentaryChat-time">{item.time}</div>
          </div>
          <div>{item.text}</div>
          {item.replies.map(([text, count]) => (
            <div className="Momentary-icon">
              {text} {count}
            </div>
          ))}
        </li>
      );
    })}
  </ul>
));

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
};

const MomentaryChat: React.FC<Props> = ({ roomId, userId, nickname }) => {
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
    <div className="MomentaryChat-container">
      <form onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter chat message"
        />
        <button type="submit" disabled={!text}>
          Send
        </button>
      </form>
      <MomentaryChatContent chatList={chatList} replyChat={replyChat} />
    </div>
  );
};

export default React.memo(MomentaryChat);
