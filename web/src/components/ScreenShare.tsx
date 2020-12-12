import React, { useState, useRef, useEffect } from "react";

import "./ScreenShare.css";
import { useScreenShare } from "../hooks/useScreenShare";
import { useNicknameMap } from "../hooks/useNicknameMap";

const Screen = React.memo<{
  nickname: string;
  stream: MediaStream;
}>(({ nickname, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div>
      <div className="ScreenShare-nickname">{nickname}</div>
      <video className="ScreenShare-video" ref={videoRef} autoPlay muted />
    </div>
  );
});

export const ScreenShare = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const [enabled, setEnabled] = useState(false);
  const { screenStream, screenStreamMap } = useScreenShare(
    roomId,
    userId,
    enabled,
    setEnabled
  );
  const nicknameMap = useNicknameMap(roomId, userId);

  return (
    <div className="ScreenShare-container">
      <button type="button" onClick={() => setEnabled(!enabled)}>
        {enabled ? "Stop screen share" : "Start screen share"}
      </button>
      <div className="ScreenShare-body">
        {screenStream && <Screen nickname={nickname} stream={screenStream} />}
        {Object.keys(screenStreamMap).map((screenUserId) => {
          const stream = screenStreamMap[screenUserId];
          if (!stream) return null;
          return (
            <Screen
              key={screenUserId}
              nickname={nicknameMap[screenUserId] || "No Name"}
              stream={stream}
            />
          );
        })}
      </div>
    </div>
  );
});

export default ScreenShare;
