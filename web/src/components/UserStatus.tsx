import React, { Dispatch, SetStateAction, useState } from "react";

import "./UserStatus.css";
import { Emoji, EmojiPicker, EmojiDataType } from "../utils/emoji";

const TextField = React.memo<{
  initialText: string;
  onUpdate: (text: string) => void;
  buttonLabel?: string;
  placeholder?: string;
  clearOnUpdate?: boolean;
}>(({ initialText, onUpdate, buttonLabel, placeholder, clearOnUpdate }) => {
  const [text, setText] = useState(initialText);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text) {
      onUpdate(text);
      if (clearOnUpdate) {
        setText("");
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      {buttonLabel && (
        <button type="submit" disabled={!text}>
          {buttonLabel}
        </button>
      )}
    </form>
  );
});

export const UserStatus = React.memo<{
  emoji: EmojiDataType | null;
  setEmoji: Dispatch<SetStateAction<EmojiDataType | null>>;
  setStatusMesg: Dispatch<SetStateAction<string>>;
}>(({ emoji, setEmoji, setStatusMesg }) => {
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
            <TextField
              initialText=""
              onUpdate={setStatusMesg}
              placeholder="Enter status message..."
              buttonLabel="Set"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setEmoji(null);
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
            setOpenEmojiPicker(false);
          }}
        />
      )}
    </div>
  );
});
