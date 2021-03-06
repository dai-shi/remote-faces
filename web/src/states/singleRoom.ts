import { proxy } from "valtio";

import { secureRandomId } from "../utils/crypto";
import { getRoomIdFromUrl } from "../utils/url";
import { NEUTRAL_FACE } from "../media/imagePresets";
import { getStringItem, setStringItem } from "../utils/storage";

const initialAvatar = getStringItem("avatar_img") || NEUTRAL_FACE;
const initialNickname = getStringItem("nickname");
const initialVideoDeviceId = getStringItem("faceimage_video_device_id");
const initialAudioDeviceId = getStringItem("faceimage_audio_device_id");

type SingleRoomState = {
  roomId: string;
  roomEntered: boolean;
  userId: string;
  config: {
    avatar: string;
    nickname: string;
    videoDeviceId: string;
    audioDeviceId: string;
  };
};

export const singleRoomState = proxy<SingleRoomState>({
  roomId: getRoomIdFromUrl() || "",
  roomEntered: false,
  userId: secureRandomId(),
  config: {
    avatar: initialAvatar,
    nickname: initialNickname,
    videoDeviceId: initialVideoDeviceId,
    audioDeviceId: initialAudioDeviceId,
  },
});

export const setConfig = (
  avatar: string,
  nickname: string,
  videoDeviceId: string,
  audioDeviceId: string
) => {
  singleRoomState.config = {
    avatar,
    nickname,
    videoDeviceId,
    audioDeviceId,
  };
  setStringItem("avatar_img", avatar);
  setStringItem("nickname", nickname);
  setStringItem("faceimage_video_device_id", videoDeviceId);
  setStringItem("faceimage_video_device_id", videoDeviceId);
};
