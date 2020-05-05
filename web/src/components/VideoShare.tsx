import React, { useState, useRef, useEffect } from "react";

import "./VideoShare.css";
import { useVideoShare } from "../hooks/useVideoShare";
import { useVideoDevices } from "../hooks/useAvailableDevices";
import { useNicknameMap } from "../hooks/useNicknameMap";

const Video = React.memo<{
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
      <div className="VideoShare-nickname">{nickname}</div>
      <video className="VideoShare-video" ref={videoRef} autoPlay muted />
    </div>
  );
});

export const VideoShare = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const videoDevices = useVideoDevices();
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [enabled, setEnabled] = useState(false);
  const { videoStream, videoStreamMap } = useVideoShare(
    roomId,
    userId,
    enabled,
    setEnabled,
    videoDeviceId
  );
  const nicknameMap = useNicknameMap(roomId, userId);

  return (
    <div className="VideoShare-container">
      <div>
        Select Camera:{" "}
        <select
          value={videoDeviceId}
          onChange={(e) => setVideoDeviceId(e.target.value)}
        >
          {videoDevices.map((videoDevice) => (
            <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
              {videoDevice.label}
            </option>
          ))}
        </select>
      </div>
      <button type="button" onClick={() => setEnabled(!enabled)}>
        {enabled ? "Stop video share" : "Start video share"}
      </button>
      <div
        className="VideoShare-body"
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            Math.sqrt(1 + Object.keys(videoStreamMap).length)
          )}, 1fr)`,
        }}
      >
        {videoStream && <Video nickname={nickname} stream={videoStream} />}
        {Object.keys(videoStreamMap).map((screenUserId) => {
          const stream = videoStreamMap[screenUserId];
          if (!stream) return null;
          return (
            <Video
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
