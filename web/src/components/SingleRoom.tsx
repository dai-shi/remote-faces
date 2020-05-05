import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import { FaceImages } from "./FaceImages";
import { MomentaryChat } from "./MomentaryChat";
import { ScreenShare } from "./ScreenShare";
import { VideoShare } from "./VideoShare";
import { CollabWhiteBoard } from "./CollabWhiteBoard";
import { UserProfile } from "./UserProfile";
import { EmojiDataType } from "../utils/emoji";

const initialNickname = getStringItem("nickname");
const initialConfigOpen = getStringItem("config_hidden") !== "true";
const initialVideoDeviceId = getStringItem("faceimage_video_device_id");
const initialAudioDeviceId = getStringItem("faceimage_audio_device_id");

export const SingleRoom = React.memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [statusMesg, setStatusMesg] = useState("");
  const [emoji, setEmoji] = useState<EmojiDataType | null>(null);
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const videoDevices = useVideoDevices();
  const audioDevices = useAudioDevices();
  const [videoDeviceId, setVideoDeviceId] = useState(initialVideoDeviceId);
  const [audioDeviceId, setAudioDeviceId] = useState(initialAudioDeviceId);
  const [liveMode, setLiveMode] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [screenShareMode, setScreenShareMode] = useState(false);
  const [videoShareMode, setVideoShareMode] = useState(false);
  const [collabWBOpen, setCollabWBOpen] = useState(false);

  const [configOpen, setConfigOpen] = useState(initialConfigOpen);
  useEffect(() => {
    setStringItem("config_hidden", configOpen ? "false" : "true");
  }, [configOpen]);

  const networkStatus = useRoomNetworkStatus(roomId, userId);
  useNicknameMap(roomId, userId); // to enable caching

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <>
      <div className="SingleRoom-body">
        <FaceImages
          roomId={roomId}
          userId={userId}
          videoDeviceId={videoDeviceId}
          audioDeviceId={audioDeviceId}
          nickname={nickname}
          statusMesg={`${emoji?.native || ""}${statusMesg}`}
          liveMode={liveMode}
          micOn={micOn}
          speakerOn={speakerOn}
        />
        <div className="SingleRoom-2nd-column">
          <UserProfile
            initialNickname={initialNickname}
            emoji={emoji}
            onUpdateNickname={(text) => {
              setNickname(text);
              setStringItem("nickname", text);
            }}
            onUpdateStatusMesg={(text) => {
              setStatusMesg(text);
            }}
            onUpdateEmoji={(e) => {
              setEmoji(e);
            }}
          />
          <div>
            <button
              type="button"
              className="SingleRoom-config-toggle"
              onClick={() => setConfigOpen((o) => !o)}
            >
              Setting{configOpen ? <>&#9660;</> : <>&#9654;</>}
            </button>
            {configOpen && (
              <div className="SingleRoom-config">
                <div>
                  Link to this room:
                  <input value={window.location.href} readOnly />
                  (Share this link with your colleagues)
                  <a href={appLink}>Open App</a>
                </div>
                <div>
                  Select Camera:{" "}
                  <select
                    value={videoDeviceId}
                    onChange={(e) => {
                      setVideoDeviceId(e.target.value);
                      setStringItem(
                        "faceimage_video_device_id",
                        e.target.value
                      );
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
                <div>
                  Select Mic:{" "}
                  <select
                    value={audioDeviceId}
                    onChange={(e) => {
                      setAudioDeviceId(e.target.value);
                      setStringItem(
                        "faceimage_audio_device_id",
                        e.target.value
                      );
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
                <div>
                  Live Mode:{" "}
                  <button type="button" onClick={() => setLiveMode((x) => !x)}>
                    {liveMode ? "Disable" : "Enable"}
                  </button>
                  {liveMode && <>&#10004;</>}
                  {liveMode && (
                    <div>
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
                    </div>
                  )}
                </div>
                <div>
                  Screen Share:{" "}
                  <button
                    type="button"
                    onClick={() => setScreenShareMode((x) => !x)}
                  >
                    {screenShareMode ? "Close" : "Open"}
                  </button>
                  {screenShareMode && <>&#10004;</>}
                </div>
                <div>
                  Video Share:{" "}
                  <button
                    type="button"
                    onClick={() => setVideoShareMode((x) => !x)}
                  >
                    {videoShareMode ? "Close" : "Open"}
                  </button>
                  {videoShareMode && <>&#10004;</>}
                </div>
                <div>
                  Collab White Board:{" "}
                  <button
                    type="button"
                    onClick={() => setCollabWBOpen((x) => !x)}
                  >
                    {collabWBOpen ? "Close" : "Open"}
                  </button>
                  {collabWBOpen && <>&#10004;</>}
                </div>
                <div className="SingleRoom-status">
                  {JSON.stringify(networkStatus)}
                </div>
              </div>
            )}
          </div>
          <MomentaryChat roomId={roomId} userId={userId} nickname={nickname} />
        </div>
        <div className="SingleRoom-3rd-column">
          {screenShareMode && (
            <ScreenShare roomId={roomId} userId={userId} nickname={nickname} />
          )}
          {videoShareMode && (
            <VideoShare roomId={roomId} userId={userId} nickname={nickname} />
          )}
          {collabWBOpen && <CollabWhiteBoard roomId={roomId} />}
        </div>
      </div>
    </>
  );
});
