import { memo, useCallback, useState, useRef, useEffect } from "react";

import "./MeetingScreen.css";
import { useMediaShare } from "../hooks/useMediaShare";
import { useNicknameMap } from "../hooks/useNicknameMap";

const Video = memo<{
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
    <div className="MeetingScreen-card">
      <video className="MeetingScreen-video" ref={videoRef} autoPlay muted />
      <div className="MeetingScreen-nickname">{nickname}</div>
    </div>
  );
});

export const MeetingScreen = memo<{
  roomId: string;
  userId: string;
  nickname: string;
  uniqueId: string;
  isActive: boolean;
}>(({ roomId, userId, nickname, uniqueId, isActive }) => {
  const [isSharing, setIsSharing] = useState(false);
  useEffect(() => {
    if (!isActive) {
      setIsSharing(false);
    }
  }, [isActive]);
  const close = useCallback(() => {
    setIsSharing(false);
  }, []);
  const { videoStream, videoStreamMap } = useMediaShare(
    roomId,
    userId,
    isSharing ? "SCREEN" : null,
    close,
    uniqueId
  );
  const nicknameMap = useNicknameMap(roomId, userId);

  return (
    <div className="MeetingScreen-container">
      <div className="MeetingScreen-toolbar">
        {isSharing && (
          <button type="button" onClick={close}>
            Stop sharing
          </button>
        )}
        {!isSharing && (
          <button type="button" onClick={() => setIsSharing(true)}>
            Start Screen Share
          </button>
        )}
      </div>
      <div className="MeetingScreen-body">
        {videoStream && <Video nickname={nickname} stream={videoStream} />}
        {Object.keys(videoStreamMap).map((mediaUserId) => {
          const stream = videoStreamMap[mediaUserId];
          if (!stream) return null;
          return (
            <Video
              key={mediaUserId}
              nickname={nicknameMap[mediaUserId] || "No Name"}
              stream={stream}
            />
          );
        })}
      </div>
    </div>
  );
});

export default MeetingScreen;
