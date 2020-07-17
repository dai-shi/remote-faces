import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import "./SettingPanel.css";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";

const initialConfigOpen = getStringItem("config_hidden") !== "true";

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

export const SettingPanel = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  videoDeviceId: string;
  setVideoDeviceId: Dispatch<SetStateAction<string>>;
  audioDeviceId: string;
  setAudioDeviceId: Dispatch<SetStateAction<string>>;
}>(
  ({
    roomId,
    userId,
    nickname,
    setNickname,
    videoDeviceId,
    setVideoDeviceId,
    audioDeviceId,
    setAudioDeviceId,
  }) => {
    const [configOpen, setConfigOpen] = useState(initialConfigOpen);
    useEffect(() => {
      setStringItem("config_hidden", configOpen ? "false" : "true");
    }, [configOpen]);

    const videoDevices = useVideoDevices();
    const audioDevices = useAudioDevices();
    const networkStatus = useRoomNetworkStatus(roomId, userId);

    const appLink = `remote-faces://${window.location.href.replace(
      /^https:\/\//,
      ""
    )}`;

    return (
      <div className="SettingPanel-container">
        <button
          type="button"
          className="SettingPanel-config-toggle"
          onClick={() => setConfigOpen((o) => !o)}
        >
          Setting{configOpen ? <>&#9660;</> : <>&#9654;</>}
        </button>
        {configOpen && (
          <div className="SettingPanel-config">
            <div className="SettingPanel-config-row">
              <span title="Share this link with your colleagues">
                Room Link:{" "}
              </span>
              <input value={window.location.href} readOnly />{" "}
              <a href={appLink} title="Open this link in the desktop app">
                Open App
              </a>
            </div>
            <div className="SettingPanel-config-row">
              Your Name:{" "}
              <TextField
                initialText={nickname}
                onUpdate={(text) => {
                  setNickname(text);
                  setStringItem("nickname", text);
                }}
                placeholder="Enter your name"
                buttonLabel="Set"
              />
            </div>
            <div className="SettingPanel-config-row">
              Select Camera:{" "}
              <select
                value={videoDeviceId}
                onChange={(e) => {
                  setVideoDeviceId(e.target.value);
                  setStringItem("faceimage_video_device_id", e.target.value);
                }}
              >
                {videoDevices.map((videoDevice) => (
                  <option
                    key={videoDevice.deviceId}
                    value={videoDevice.deviceId}
                  >
                    {videoDevice.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="SettingPanel-config-row">
              Select Mic:{" "}
              <select
                value={audioDeviceId}
                onChange={(e) => {
                  setAudioDeviceId(e.target.value);
                  setStringItem("faceimage_audio_device_id", e.target.value);
                }}
              >
                {audioDevices.map((audioDevice) => (
                  <option
                    key={audioDevice.deviceId}
                    value={audioDevice.deviceId}
                  >
                    {audioDevice.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="SettingPanel-status">
              {JSON.stringify(networkStatus)}
            </div>
          </div>
        )}
      </div>
    );
  }
);
