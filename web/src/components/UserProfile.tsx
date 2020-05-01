import React, { useState } from "react";

import "./UserProfile.css";
import {
  Emoji,
  EmojiPicker,
  EmojiDataType,
  isEmojiDataType,
} from "../utils/emoji";

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

export const UserProfile = React.memo<{
  initialNickname: string;
  emoji: EmojiDataType | null;
  onUpdateNickname: (e: string) => void;
  onUpdateStatusMesg: (e: string) => void;
  onUpdateEmoji: (e: EmojiDataType | null) => void;
}>(
  ({
    initialNickname,
    emoji,
    onUpdateNickname,
    onUpdateStatusMesg,
    onUpdateEmoji,
  }) => {
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    return (
      <div className="UserProfile-container">
        <div className="UserProfile-nickname">
          <TextField
            initialText={initialNickname}
            onUpdate={onUpdateNickname}
            placeholder="Enter your name"
            buttonLabel="Set"
          />
        </div>
        <div className="UserProfile-status-area">
          <div className="UserProfile-emoji">
            <button
              type="button"
              onClick={() => {
                setOpenEmojiPicker(!openEmojiPicker);
              }}
            >
              {emoji ? <Emoji emoji={emoji} size={10} /> : ":)"}
            </button>
          </div>
          <div className="UserProfile-statusmesg">
            <TextField
              initialText=""
              onUpdate={onUpdateStatusMesg}
              placeholder="Enter status message"
              buttonLabel="Set"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onUpdateEmoji(null);
              onUpdateStatusMesg("");
              setOpenEmojiPicker(false);
            }}
          >
            Clear
          </button>
        </div>
        {openEmojiPicker && (
          <EmojiPicker
            onSelect={(e) => {
              if (isEmojiDataType(e)) {
                onUpdateEmoji(e);
              }
              setOpenEmojiPicker(false);
            }}
          />
        )}
      </div>
    );
  }
);
