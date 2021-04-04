import React from "react";
import "emoji-mart/css/emoji-mart.css";
import { BaseEmoji, Picker, getEmojiDataFromNative, Data } from "emoji-mart";
import data from "emoji-mart/data/all.json";

export { Emoji } from "emoji-mart";
export type EmojiDataType = BaseEmoji;

// we do not support custom emojis
export const EmojiPicker = Picker as React.ComponentType<
  | Omit<React.ComponentProps<typeof Picker>, "custom" | "onSelect">
  | {
      onSelect: (emoji: BaseEmoji) => void;
    }
>;

export const isEmoji = (s: string) => {
  const emojiData: BaseEmoji | null = getEmojiDataFromNative(
    s,
    "apple",
    (data as unknown) as Data
  );
  return !!emojiData;
};
