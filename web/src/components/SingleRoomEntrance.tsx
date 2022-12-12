import { lazy, memo, useState } from "react";
import { useSnapshot } from "valtio";

import "./SingleRoomEntrance.css";
import { globalState } from "../states/global";
import { secureRandomId, generateCryptoKey } from "../utils/crypto";
import { ROOM_ID_PREFIX_LEN } from "../network/room";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import { useInputAvatar } from "../hooks/useInputAvatar";
import { setRoomPresetToUrl } from "../utils/url";

const Landing = lazy(() => import("./reusable/Landing"));
const SingleRoom = lazy(() => import("./SingleRoom"));

export const SingleRoomEntrance = memo(() => {
  const { roomId, roomEntered, config } = useSnapshot(globalState);
  const [name, setName] = useState(config.nickname);
  const [takePhoto, setTakePhoto] = useState(config.takePhoto);
  const [avatar, onChangeAvatar] = useInputAvatar(config.avatar);
  const videoDevices = useVideoDevices();
  const audioDevices = useAudioDevices();
  const [videoDeviceId, setVideoDeviceId] = useState(config.videoDeviceId);
  const [audioDeviceId, setAudioDeviceId] = useState(config.audioDeviceId);
  const [roomPreset, setRoomPreset] = useState("intro");
  const [entering, setEntering] = useState(false);

  const onEnter = async () => {
    setEntering(true);
    if (!globalState.roomId) {
      if (roomPreset) {
        setRoomPresetToUrl(roomPreset);
      }
      globalState.roomId =
        secureRandomId(ROOM_ID_PREFIX_LEN / 2) + (await generateCryptoKey());
    }
    globalState.config.avatar = avatar;
    globalState.config.nickname = name;
    globalState.config.takePhoto = takePhoto;
    globalState.config.videoDeviceId = videoDeviceId;
    globalState.config.audioDeviceId = audioDeviceId;
    globalState.roomEntered = true;
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
          {!roomId && (
            <div>
              Room Preset:{" "}
              <select
                value={roomPreset}
                onChange={(e) => {
                  setRoomPreset(e.target.value);
                }}
              >
                <option value="">Empty</option>
                <option value="intro">Intro</option>
                <option value="phone">Phone</option>
                <option value="igo">Igo</option>
              </select>
              (It takes about 10 seconds to apply the preset.)
            </div>
          )}
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
