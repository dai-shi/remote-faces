import React, { useState } from "react";

import "./UserStatus.css";
import { Emoji, EmojiPicker, EmojiDataType } from "../utils/emoji";

export const UserStatus = React.memo<{
  setStatusMesg: (mesg: string) => void;
}>(({ setStatusMesg }) => {
  const [emoji, setEmoji] = useState<EmojiDataType | null>(null);
  const [text, setText] = useState("");
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text) {
      setStatusMesg(`${emoji?.native || " "}${text}`);
    }
  };
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  return (
    <div className="UserStatus-container">
      <div className="UserStatus-status-area">
        <div className="UserStatus-emoji">
          <button
            type="button"
            onClick={() => {
              setOpenEmojiPicker(!openEmojiPicker);
            }}
          >
            {emoji ? <Emoji emoji={emoji} size={10} /> : ":)"}
          </button>
        </div>
        {emoji && (
          <div className="UserStatus-statusmesg">
            <form onSubmit={onSubmit}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter status message..."
              />
              <button type="submit" disabled={!text}>
                Set
              </button>
            </form>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setEmoji(null);
            setText("");
            setStatusMesg("");
            setOpenEmojiPicker(false);
          }}
          disabled={!emoji}
        >
          Clear
        </button>
      </div>
      {openEmojiPicker && (
        <EmojiPicker
          onSelect={(e) => {
            setEmoji(e);
            setStatusMesg(`${e?.native || " "}${text}`);
            setOpenEmojiPicker(false);
          }}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
});
