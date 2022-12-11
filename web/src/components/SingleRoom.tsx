import { memo, useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import "./SingleRoom.css";
import { globalState } from "../states/global";
import { setRoomIdToUrl } from "../utils/url";
import { GatherArea } from "./GatherArea";

export const SingleRoom = memo(() => {
  const { roomId } = useSnapshot(globalState);
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
      <GatherArea />
    </div>
  );
});

export default SingleRoom;
