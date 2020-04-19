import React, { useState } from "react";

import "./MomentaryChat.css";
import { useMomentaryChat } from "../hooks/useMomentaryChat";

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
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" disabled={!text}>
          Send
        </button>
      </form>
      <ul className="MomentaryChat-list">
        {chatList.map((item) => (
          <li key={item.key}>
            {item.nickname} - {item.text} {JSON.stringify(item.replies)}
            <button
              type="button"
              onClick={() => {
                replyChat("👍", item.replyTo);
              }}
            >
              <span role="img" aria-label="Thumb Up">
                👍
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MomentaryChat;
