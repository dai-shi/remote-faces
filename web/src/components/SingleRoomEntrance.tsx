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
  const videoDevices = useVideoDevices();
  const audioDevices = useAudioDevices();
  const [videoDeviceId, setVideoDeviceId] = useState(config.videoDeviceId);
  const [audioDeviceId, setAudioDeviceId] = useState(config.audioDeviceId);
  const [entering, setEntering] = useState(false);

  const onEnter = async () => {
    setEntering(true);
    if (!singleRoomState.roomId) {
      singleRoomState.roomId =
        secureRandomId(ROOM_ID_PREFIX_LEN / 2) + (await generateCryptoKey());
    }
    setConfig(name, videoDeviceId, audioDeviceId);
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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter nickname"
            />
          </div>
          <div>
            Select Video Device:{" "}
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
            Select Audio Device:{" "}
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
