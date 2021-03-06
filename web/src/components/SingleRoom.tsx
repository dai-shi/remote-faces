import React, { useEffect, useState } from "react";
import { useProxy } from "valtio";

import "./SingleRoom.css";
import { singleRoomState } from "../states/singleRoom";
import { setRoomIdToUrl } from "../utils/url";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { FaceImages } from "./FaceImages";
import { MomentaryChat } from "./MomentaryChat";
import { ControlPanel } from "./ControlPanel";
import { SettingPanel } from "./SettingPanel";
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
  const [thirdColumnOpen, setThirdColumnOpen] = useState(true);

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
        style={{ width: secondColumnOpen ? "inherit" : "0" }}
      >
        <button
          type="button"
          className="SingleRoom-toggle-3rd-column"
          onClick={() => setThirdColumnOpen((x) => !x)}
          title={thirdColumnOpen ? "Close Right Pane" : "Open Right Pane"}
        >
          {thirdColumnOpen ? <>&#9664;</> : <>&#9654;</>}
        </button>
        <SettingPanel
          roomId={roomId}
          userId={userId}
          setStatusMesg={setStatusMesg}
        />
        <MomentaryChat
          roomId={roomId}
          userId={userId}
          nickname={config.nickname}
        />
      </div>
      <div
        className="SingleRoom-3rd-column"
        style={{ display: thirdColumnOpen ? "inherit" : "none" }}
      >
        <SelectivePane
          roomId={roomId}
          userId={userId}
          nickname={config.nickname}
          statusMesg={statusMesg}
        />
      </div>
    </div>
  );
});

export default SingleRoom;
