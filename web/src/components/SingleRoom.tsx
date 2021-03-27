import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import "./SingleRoom.css";
import { singleRoomState, toggleConfigTakePhoto } from "../states/singleRoom";
import { setRoomIdToUrl } from "../utils/url";
import { FaceImages } from "./FaceImages";
import { ControlPanel } from "./ControlPanel";
import { SelectivePane } from "./SelectivePane";

export const SingleRoom = React.memo(() => {
  const { roomId, userId, config } = useSnapshot(singleRoomState);
  const [statusMesg, setStatusMesg] = useState("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const [liveMode, setLiveMode] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [secondColumnOpen, setSecondColumnOpen] = useState(true);

  return (
    <div className="SingleRoom-container">
      <div className="SingleRoom-1st-column">
        <ControlPanel
          suspended={!config.takePhoto}
          toggleSuspended={toggleConfigTakePhoto}
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
          videoDeviceId={config.videoDeviceId}
          audioDeviceId={config.audioDeviceId}
          avatar={config.avatar}
          nickname={config.nickname}
          statusMesg={statusMesg}
          suspended={!config.takePhoto}
          liveMode={liveMode}
          micOn={micOn}
          speakerOn={speakerOn}
        />
      </div>
      <div
        className="SingleRoom-2nd-column"
        style={{ display: secondColumnOpen ? "inherit" : "none" }}
      >
        <SelectivePane
          roomId={roomId}
          userId={userId}
          avatar={config.avatar}
          nickname={config.nickname}
          statusMesg={statusMesg}
          setStatusMesg={setStatusMesg}
          suspended={!config.takePhoto}
          videoDeviceId={config.videoDeviceId}
          audioDeviceId={config.audioDeviceId}
        />
      </div>
    </div>
  );
});

export default SingleRoom;
