type StringItemName =
  | "nickname"
  | "avatar_img"
  | "config_hidden"
  | "faceimage_video_device_id"
  | "faceimage_audio_device_id";

type JsonItemName = "TODO2" | "TODO3";

export const setStringItem = (name: StringItemName, value: string) => {
  try {
    window.localStorage.setItem(name, value);
  } catch (e) {
    console.info("Failed to save string to localStorage", e);
  }
};

export const getStringItem = (name: StringItemName) => {
  try {
    return window.localStorage.getItem(name) || "";
  } catch (e) {
    // ignore
    return "";
  }
};

export const setJsonItem = (name: JsonItemName, value: unknown) => {
  try {
    window.localStorage.setItem(name, JSON.stringify(value));
  } catch (e) {
    console.info("Failed to save json to localStorage", e);
  }
};

export const getJsonItem = (name: JsonItemName): unknown | null => {
  try {
    return JSON.parse(window.localStorage.getItem(name) || "");
  } catch (e) {
    // ignore
    return null;
  }
};

export const removeItem = (name: StringItemName | JsonItemName) => {
  try {
    window.localStorage.removeItem(name);
  } catch (e) {
    // ignore
  }
};
