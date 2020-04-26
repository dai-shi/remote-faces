import "emoji-mart/css/emoji-mart.css";
import { EmojiData } from "emoji-mart";

export { Emoji, Picker as EmojiPicker } from "emoji-mart";
export type EmojiDataType = EmojiData;

export const parseEmojiJson = (emojiJson: string) => {
  try {
    const emoji = JSON.parse(emojiJson);
    return emoji as EmojiDataType; // TODO should be checked EmojiData type
  } catch (e) {
    return null;
  }
};
