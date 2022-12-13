import { proxy, subscribe } from "valtio";

import { secureRandomId } from "../utils/crypto";
import { getRoomIdFromUrl } from "../utils/url";
import { NEUTRAL_FACE } from "../media/imagePresets";
import {
  getJsonItem,
  setJsonItem,
  getStringItem,
  setStringItem,
} from "../utils/storage";

type Config = {
  avatar: string;
  nickname: string;
  takePhoto: boolean;
  videoDeviceId: string;
  audioDeviceId: string;
};

type Preference = {
  photoSize?: number;
  controlPanelPosition?: readonly [number, number];
  hideFaceList?: boolean;
};

const isPreferenceType = (x: unknown): x is Preference => {
  try {
    const obj = x as Preference;
    if (
      (typeof obj.photoSize === "undefined" ||
        typeof obj.photoSize === "number") &&
      (typeof obj.controlPanelPosition === "undefined" ||
        (Array.isArray(obj.controlPanelPosition) &&
          obj.controlPanelPosition.length === 2 &&
          typeof obj.controlPanelPosition[0] === "number" &&
          typeof obj.controlPanelPosition[1] === "number")) &&
      (typeof obj.hideFaceList === "undefined" ||
        typeof obj.hideFaceList === "boolean")
    ) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

type GlobalState = {
  roomId: string;
  roomEntered: boolean;
  userId: string;
  statusMesg: string;
  config: Config;
  preference: Preference;
};

const initialAvatar = getStringItem("avatar_img") || NEUTRAL_FACE;
const initialNickname = getStringItem("nickname");
const initialTakePhoto = getStringItem("take_photo");
const initialVideoDeviceId = getStringItem("faceimage_video_device_id");
const initialAudioDeviceId = getStringItem("faceimage_audio_device_id");
const initialPreference = getJsonItem("preference");

export const globalState = proxy<GlobalState>({
  roomId: getRoomIdFromUrl() || "",
  roomEntered: false,
  userId: secureRandomId(),
  statusMesg: "",
  config: {
    avatar: initialAvatar,
    nickname: initialNickname,
    takePhoto: !!initialTakePhoto,
    videoDeviceId: initialVideoDeviceId,
    audioDeviceId: initialAudioDeviceId,
  },
  preference: isPreferenceType(initialPreference) ? initialPreference : {},
});

subscribe(globalState.config, () => {
  setStringItem("avatar_img", globalState.config.avatar);
  setStringItem("nickname", globalState.config.nickname);
  setStringItem("take_photo", globalState.config.takePhoto ? "yes" : "");
  setStringItem("faceimage_video_device_id", globalState.config.videoDeviceId);
  setStringItem("faceimage_video_device_id", globalState.config.videoDeviceId);
});

subscribe(globalState.preference, () => {
  setJsonItem("preference", globalState.preference);
});
