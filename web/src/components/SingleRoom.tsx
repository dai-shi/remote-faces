import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import FaceImages from "./FaceImages";
import MomentaryChat from "./MomentaryChat";
import ScreenShare from "./ScreenShare";

type Props = {
  roomId: string;
  userId: string;
};

const initialNickname = getStringItem("nickname");

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
  const [liveMode, setLiveMode] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [configOpen, setConfigOpen] = useState<boolean>(true);

  const networkStatus = useRoomNetworkStatus(roomId, userId);

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
              <TextField
                initialText={initialNickname}
                onUpdate={(text) => {
                  setNickname(text);
                  setStringItem("nickname", text);
                }}
                placeholder="Enter your name"
                buttonLabel="Set"
              />
            </div>
            <div className="SingleRoom-statusmesg">
              Your Status:{" "}
              <TextField
                initialText=""
                onUpdate={(text) => {
                  setStatusMesg(text);
                }}
                placeholder="Enter status message"
                buttonLabel="Set"
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
              Live Mode:{" "}
              <button type="button" onClick={() => setLiveMode((x) => !x)}>
                {liveMode
                  ? "Disable Live Mode (currently on)"
                  : "Enable Live Mode (currently off)"}
              </button>
              {liveMode && (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={micOn}
                      onChange={(e) => setMicOn(e.target.checked)}
                    />
                    Mic On
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={speakerOn}
                      onChange={(e) => setSpeakerOn(e.target.checked)}
                    />
                    Speaker On
                  </label>
                </>
              )}
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
        liveMode={liveMode}
        micOn={micOn}
        speakerOn={speakerOn}
      />
      <MomentaryChat roomId={roomId} userId={userId} nickname={nickname} />
      <ScreenShare roomId={roomId} userId={userId} nickname={nickname} />
    </>
  );
};

export default SingleRoom;
