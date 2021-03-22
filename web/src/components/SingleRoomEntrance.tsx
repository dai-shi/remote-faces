import React, { useState } from "react";
import { useProxy } from "valtio";

import "./SingleRoomEntrance.css";
import { singleRoomState, setConfig } from "../states/singleRoom";
import { secureRandomId, generateCryptoKey } from "../utils/crypto";
import { ROOM_ID_PREFIX_LEN } from "../network/room";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";

const Landing = React.lazy(() => import("./Landing"));
const SingleRoom = React.lazy(() => import("./SingleRoom"));

export const SingleRoomEntrance = React.memo(() => {
  const { roomId, roomEntered, config } = useProxy(singleRoomState);
  const [name, setName] = useState(config.nickname);
  const [takePhoto, setTakePhoto] = useState(config.takePhoto);
  const [avatar, setAvatar] = useState(config.avatar);
  const videoDevices = useVideoDevices();
  const audioDevices = useAudioDevices();
  const [videoDeviceId, setVideoDeviceId] = useState(config.videoDeviceId);
  const [audioDeviceId, setAudioDeviceId] = useState(config.audioDeviceId);
  const [entering, setEntering] = useState(false);

  const onChangeAvatar = (files: FileList | null) => {
    const file = files && files[0];
    if (!file) {
      return;
    }
    if (file.size > 16 * 1024) {
      // eslint-disable-next-line no-alert
      window.alert(`Too large: ${file.size}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onEnter = async () => {
    setEntering(true);
    if (!singleRoomState.roomId) {
      singleRoomState.roomId =
        secureRandomId(ROOM_ID_PREFIX_LEN / 2) + (await generateCryptoKey());
    }
    setConfig(avatar, name, takePhoto, videoDeviceId, audioDeviceId);
    singleRoomState.roomEntered = true;
  };

  if (roomId && roomEntered) {
    return <SingleRoom />;
  }

  return (
    <div className="SingleRoomEntrance-container">
      <Landing>
        <div className="SingleRoomEntrance-input">
          <div>
            <img src={avatar} alt="avatar" />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeAvatar(e.target.files)}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={takePhoto}
                onChange={(e) => setTakePhoto(e.target.checked)}
              />
              Take photo every 2 min
            </label>
          </div>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter nickname"
            />
          </div>
          <div>
            Video:{" "}
            <select
              value={videoDeviceId}
              onChange={(e) => {
                setVideoDeviceId(e.target.value);
              }}
            >
              {videoDevices.map((videoDevice) => (
                <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                  {videoDevice.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            Audio:{" "}
            <select
              value={audioDeviceId}
              onChange={(e) => {
                setAudioDeviceId(e.target.value);
              }}
            >
              {audioDevices.map((audioDevice) => (
                <option key={audioDevice.deviceId} value={audioDevice.deviceId}>
                  {audioDevice.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="button"
              onClick={onEnter}
              disabled={entering || !name}
            >
              {roomId ? "Enter the room" : "Create a new room"}
            </button>
          </div>
        </div>
      </Landing>
    </div>
  );
});
