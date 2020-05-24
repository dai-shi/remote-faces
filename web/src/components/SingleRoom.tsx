import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { getStringItem } from "../utils/storage";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { FaceImages } from "./FaceImages";
import { MomentaryChat } from "./MomentaryChat";
import { ControlPanel } from "./ControlPanel";
import { SettingPanel } from "./SettingPanel";
import { UserStatus } from "./UserStatus";
import { TabPane } from "./TabPane";
import { EmojiDataType } from "../utils/emoji";

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
  const [secondColumnOpen, setSecondColumnOpen] = useState(true);
  const [thirdColumnOpen, setThirdColumnOpen] = useState(true);

  useNicknameMap(roomId, userId); // to enable caching

  return (
    <div className="SingleRoom-container">
      <div className="SingleRoom-1st-column">
        <ControlPanel
          liveMode={liveMode}
          setLiveMode={setLiveMode}
          micOn={micOn}
          setMicOn={setMicOn}
          speakerOn={speakerOn}
          setSpeakerOn={setSpeakerOn}
          secondColumnOpen={secondColumnOpen}
          setSecondColumnOpen={setSecondColumnOpen}
        />
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
      <div
        className="SingleRoom-2nd-column"
        style={{ display: secondColumnOpen ? "inherit" : "none" }}
      >
        <button
          type="button"
          className="SingleRoom-toggle-3rd-column"
          onClick={() => setThirdColumnOpen((x) => !x)}
          title={thirdColumnOpen ? "Close Right Pane" : "Open Right Pane"}
        >
          {thirdColumnOpen ? <>&#9664;</> : <>&#9654;</>}
        </button>
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
        />
        <MomentaryChat roomId={roomId} userId={userId} nickname={nickname} />
      </div>
      <div
        className="SingleRoom-3rd-column"
        style={{ display: thirdColumnOpen ? "inherit" : "none" }}
      >
        <TabPane roomId={roomId} userId={userId} nickname={nickname} />
      </div>
    </div>
  );
});

export default SingleRoom;
