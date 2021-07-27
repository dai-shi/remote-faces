import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import "./SingleRoom.css";
import { singleRoomState, toggleConfigTakePhoto } from "../states/singleRoom";
import { setRoomIdToUrl } from "../utils/url";
import { GatherArea } from "./GatherArea";

export const SingleRoom = React.memo(() => {
  const { roomId, userId, config } = useSnapshot(singleRoomState);
  const [statusMesg, setStatusMesg] = useState("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const [inactive, setInactive] = useState(false);
  if (inactive) {
    throw new Error("inactive for too long");
  }
  useEffect(() => {
    let lastTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastTime >= 4 * 60 * 60 * 1000) {
        setInactive(true);
      }
      lastTime = now;
    }, 60 * 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="SingleRoom-container">
      <GatherArea
        roomId={roomId}
        userId={userId}
        avatar={config.avatar}
        nickname={config.nickname}
        statusMesg={statusMesg}
        setStatusMesg={setStatusMesg}
        suspended={!config.takePhoto}
        videoDeviceId={config.videoDeviceId}
        audioDeviceId={config.audioDeviceId}
        toggleSuspended={toggleConfigTakePhoto}
      />
    </div>
  );
});

export default SingleRoom;
