import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { getStringItem } from "../utils/storage";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { FaceImages } from "./FaceImages";
import { MomentaryChat } from "./MomentaryChat";
import { SettingPanel } from "./SettingPanel";
import { UserStatus } from "./UserStatus";
import { EmojiDataType } from "../utils/emoji";

const ScreenShare = React.lazy(() => import("./ScreenShare"));
const VideoShare = React.lazy(() => import("./VideoShare"));
const CollabWhiteBoard = React.lazy(() => import("./CollabWhiteBoard"));

const initialNickname = getStringItem("nickname");
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

  const [videoDeviceId, setVideoDeviceId] = useState(initialVideoDeviceId);
  const [audioDeviceId, setAudioDeviceId] = useState(initialAudioDeviceId);
  const [liveMode, setLiveMode] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [screenShareMode, setScreenShareMode] = useState(false);
  const [videoShareMode, setVideoShareMode] = useState(false);
  const [collabWBOpen, setCollabWBOpen] = useState(false);

  useNicknameMap(roomId, userId); // to enable caching

  return (
    <>
      <div className="SingleRoom-body">
        <div className="SingleRoom-1st-column">
          <FaceImages
            roomId={roomId}
            userId={userId}
            videoDeviceId={videoDeviceId}
            audioDeviceId={audioDeviceId}
            nickname={nickname}
            statusMesg={`${emoji?.native || " "}${statusMesg}`}
            liveMode={liveMode}
            micOn={micOn}
            speakerOn={speakerOn}
          />
        </div>
        <div className="SingleRoom-2nd-column">
          <UserStatus
            emoji={emoji}
            setEmoji={setEmoji}
            setStatusMesg={setStatusMesg}
          />
          <SettingPanel
            roomId={roomId}
            userId={userId}
            nickname={nickname}
            setNickname={setNickname}
            videoDeviceId={videoDeviceId}
            setVideoDeviceId={setVideoDeviceId}
            audioDeviceId={audioDeviceId}
            setAudioDeviceId={setAudioDeviceId}
            liveMode={liveMode}
            setLiveMode={setLiveMode}
            micOn={micOn}
            setMicOn={setMicOn}
            speakerOn={speakerOn}
            setSpeakerOn={setSpeakerOn}
            screenShareMode={screenShareMode}
            setScreenShareMode={setScreenShareMode}
            videoShareMode={videoShareMode}
            setVideoShareMode={setVideoShareMode}
            collabWBOpen={collabWBOpen}
            setCollabWBOpen={setCollabWBOpen}
          />
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

export default SingleRoom;
