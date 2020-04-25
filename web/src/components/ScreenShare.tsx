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

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
};

const ScreenShare: React.FC<Props> = ({ roomId, userId, nickname }) => {
  const [enabled, setEnabled] = useState(false);
  const { myStream, streamList } = useScreenShare(
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
      {myStream && <Screen nickname={nickname} stream={myStream} />}
      {streamList.map((item) => (
        <Screen
          key={item.info.userId}
          nickname={nicknameMap[item.info.userId] || "No Name"}
          stream={item.stream}
        />
      ))}
    </div>
  );
};

export default React.memo(ScreenShare);
