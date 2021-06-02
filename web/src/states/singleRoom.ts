import { proxy } from "valtio";

import { secureRandomId } from "../utils/crypto";
import { getRoomIdFromUrl } from "../utils/url";
import { NEUTRAL_FACE } from "../media/imagePresets";
import { getStringItem, setStringItem } from "../utils/storage";

const initialAvatar = getStringItem("avatar_img") || NEUTRAL_FACE;
const initialNickname = getStringItem("nickname");
const initialTakePhoto = getStringItem("take_photo");
const initialVideoDeviceId = getStringItem("faceimage_video_device_id");
const initialAudioDeviceId = getStringItem("faceimage_audio_device_id");

type SingleRoomState = {
  roomId: string;
  roomEntered: boolean;
  userId: string;
  config: {
    avatar: string;
    nickname: string;
    takePhoto: boolean;
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
    takePhoto: !!initialTakePhoto,
    videoDeviceId: initialVideoDeviceId,
    audioDeviceId: initialAudioDeviceId,
  },
});

export const setConfig = ({
  avatar,
  nickname,
  takePhoto,
  videoDeviceId,
  audioDeviceId,
}: {
  avatar?: string;
  nickname?: string;
  takePhoto?: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
}) => {
  if (avatar) {
    singleRoomState.config.avatar = avatar;
    setStringItem("avatar_img", avatar);
  }
  if (nickname) {
    singleRoomState.config.nickname = nickname;
    setStringItem("nickname", nickname);
  }
  if (takePhoto) {
    singleRoomState.config.takePhoto = takePhoto;
    setStringItem("take_photo", takePhoto ? "yes" : "");
  }
  if (videoDeviceId) {
    singleRoomState.config.videoDeviceId = videoDeviceId;
    setStringItem("faceimage_video_device_id", videoDeviceId);
  }
  if (audioDeviceId) {
    singleRoomState.config.audioDeviceId = audioDeviceId;
    setStringItem("faceimage_audio_device_id", audioDeviceId);
  }
};

export const toggleConfigTakePhoto = () => {
  const takePhoto = !singleRoomState.config.takePhoto;
  singleRoomState.config.takePhoto = takePhoto;
  setStringItem("take_photo", takePhoto ? "yes" : "");
};
