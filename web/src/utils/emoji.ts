import React from "react";
import "emoji-mart/css/emoji-mart.css";
import { BaseEmoji, Picker } from "emoji-mart";

export { Emoji } from "emoji-mart";
export type EmojiDataType = BaseEmoji;

// we do not support custom emojis
export const EmojiPicker = Picker as React.ComponentType<
  | Omit<React.ComponentProps<typeof Picker>, "custom" | "onSelect">
  | {
      onSelect: (emoji: BaseEmoji) => void;
    }
>;
