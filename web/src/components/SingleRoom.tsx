import React, { useEffect, useState } from "react";
import { useProxy } from "valtio";

import "./SingleRoom.css";
import { singleRoomState } from "../states/singleRoom";
import { setRoomIdToUrl } from "../utils/url";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { FaceImages } from "./FaceImages";
import { ControlPanel } from "./ControlPanel";
import { SelectivePane } from "./SelectivePane";

export const SingleRoom = React.memo(() => {
  const { roomId, userId, config } = useProxy(singleRoomState);
  const [statusMesg, setStatusMesg] = useState("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const [suspended, setSuspended] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [secondColumnOpen, setSecondColumnOpen] = useState(true);

  useNicknameMap(roomId, userId); // to enable caching

  return (
    <div className="SingleRoom-container">
      <div className="SingleRoom-1st-column">
        <ControlPanel
          suspended={suspended}
          setSuspended={setSuspended}
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
          suspended={suspended}
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
          nickname={config.nickname}
          statusMesg={statusMesg}
          setStatusMesg={setStatusMesg}
        />
      </div>
    </div>
  );
});

export default SingleRoom;
