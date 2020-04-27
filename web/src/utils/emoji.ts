import "emoji-mart/css/emoji-mart.css";
import { BaseEmoji } from "emoji-mart";

export { Emoji, Picker as EmojiPicker } from "emoji-mart";
export type EmojiDataType = BaseEmoji;

export const isEmojiDataType = (
  emojiData: unknown
): emojiData is EmojiDataType => {
  try {
    const { id } = emojiData as EmojiDataType;
    if (typeof id === "string") return true;
    return false;
  } catch (e) {
    return false;
  }
};
