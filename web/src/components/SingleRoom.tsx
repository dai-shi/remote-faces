import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import FaceImages from "./FaceImages";
import MomentaryChat from "./MomentaryChat";

type LiveType = "off" | "video" | "video+audio";

type Props = {
  roomId: string;
  userId: string;
};

const initialNickname = getStringItem("nickname");

const SingleRoom: React.FC<Props> = ({ roomId, userId }) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [statusMesg, setStatusMesg] = useState("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const videoDevices = useVideoDevices();
  const audioDevices = useAudioDevices();
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [audioDeviceId, setAudioDeviceId] = useState<string>();
  const [liveType, setLiveType] = useState<LiveType>("off");
  const [configOpen, setConfigOpen] = useState<boolean>(true);

  const networkStatus = useRoomNetworkStatus(roomId);

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <>
      <div className="SingleRoom-status">{JSON.stringify(networkStatus)}</div>
      <div className="SingleRoom-room-info">
        {configOpen ? (
          <>
            <button type="button" onClick={() => setConfigOpen(false)}>
              Hide config
            </button>
            <div>
              Link to this room:
              <input value={window.location.href} readOnly />
              (Share this link with your colleagues)
              <a href={appLink}>Open App</a>
            </div>
            <div className="SingleRoom-nickname">
              Your Name:{" "}
              <input
                defaultValue={initialNickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setStringItem("nickname", e.target.value);
                }}
              />
            </div>
            <div className="SingleRoom-statusmesg">
              Your Status:{" "}
              <input
                onChange={(e) => {
                  setStatusMesg(e.target.value);
                }}
                placeholder="Enter status message"
              />
            </div>
            <div>
              Select Camera:{" "}
              <select onChange={(e) => setVideoDeviceId(e.target.value)}>
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
            <div>
              Select Mic:{" "}
              <select onChange={(e) => setAudioDeviceId(e.target.value)}>
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
            <div>
              Live Type:{" "}
              <select onChange={(e) => setLiveType(e.target.value as LiveType)}>
                <option value="off">Off</option>
                <option value="video">Video Only</option>
                <option value="video+audio">Video and Audio</option>
              </select>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setConfigOpen(true)}>
            Show config
          </button>
        )}
      </div>
      <FaceImages
        roomId={roomId}
        userId={userId}
        videoDeviceId={videoDeviceId}
        audioDeviceId={audioDeviceId}
        nickname={nickname}
        statusMesg={statusMesg}
        liveType={liveType}
      />
      <MomentaryChat roomId={roomId} userId={userId} nickname={nickname} />
    </>
  );
};

export default SingleRoom;
