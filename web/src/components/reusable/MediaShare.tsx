import { memo, useCallback, useState, useRef, useEffect } from "react";

import "./MediaShare.css";
import { useMediaShare } from "../../hooks/useMediaShare";
import { useVideoDevices } from "../../hooks/useAvailableDevices";
import { useNicknameMap } from "../../hooks/useNicknameMap";

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
    <div className="MediaShare-card">
      <video className="MediaShare-video" ref={videoRef} autoPlay muted />
      <div className="MediaShare-nickname">{nickname}</div>
    </div>
  );
});

export const MediaShare = memo<{
  roomId: string;
  userId: string;
  nickname: string;
  uniqueId?: string;
}>(({ roomId, userId, nickname, uniqueId }) => {
  const videoDevices = useVideoDevices();
  const [videoDeviceId, setVideoDeviceId] = useState<string>("");
  const [mediaId, setMediaId] = useState<{ video: string } | "SCREEN" | null>(
    null
  );
  const close = useCallback(() => {
    setMediaId(null);
  }, []);
  const { videoStream, videoStreamMap } = useMediaShare(
    roomId,
    userId,
    mediaId,
    close,
    uniqueId
  );
  const nicknameMap = useNicknameMap(roomId, userId);
  const [displayMode, setDisplayMode] = useState<"grid" | "vertical">("grid");
  const numOfVideos =
    (videoStream ? 1 : 0) +
    Object.values(videoStreamMap).filter((x) => x).length;
  const sqrtNumOfVideos = Math.ceil(Math.sqrt(numOfVideos));
  const gridRows = Math.ceil(numOfVideos / sqrtNumOfVideos);
  const displayStyle =
    displayMode === "grid"
      ? {
          gridTemplateColumns: `repeat(${sqrtNumOfVideos}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, ${100 / gridRows}%)`,
        }
      : {
          gridTemplateRows: Array(numOfVideos).fill("100%").join(" "),
        };

  const containerRef = useRef<HTMLDivElement>(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const enterFullscreen = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setFullscreenMode(true);
        containerRef.current.onfullscreenchange = () => {
          setFullscreenMode(
            document.fullscreenElement === containerRef.current
          );
        };
      } catch (e) {
        // ignored
      }
    }
  };
  const exitFullscreen = async () => {
    try {
      document.exitFullscreen();
      setFullscreenMode(false);
    } catch (e) {
      // ignored
    }
  };

  return (
    <div className="MediaShare-container" ref={containerRef}>
      <div className="MediaShare-toolbar">
        {!fullscreenMode && (
          <button type="button" onClick={enterFullscreen}>
            Enter Fullscreen
          </button>
        )}
        {fullscreenMode && (
          <button type="button" onClick={exitFullscreen}>
            Exit Fullscreen
          </button>
        )}
        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value as typeof displayMode)}
        >
          <option value="grid">Display in Grid</option>
          <option value="vertical">Display Vertically</option>
        </select>
        {mediaId !== null && (
          <button type="button" onClick={close}>
            Stop sharing
          </button>
        )}
        {mediaId === null && (
          <button type="button" onClick={() => setMediaId("SCREEN")}>
            Start Screen Share
          </button>
        )}
        {mediaId === null && (
          <>
            <select
              value={videoDeviceId}
              onChange={(e) => setVideoDeviceId(e.target.value)}
            >
              <option value="" disabled>
                Select Camera to Share
              </option>
              {videoDevices.map((videoDevice) => (
                <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                  {videoDevice.label}
                </option>
              ))}
            </select>
            {videoDeviceId && (
              <button
                type="button"
                onClick={() => setMediaId({ video: videoDeviceId })}
              >
                Start Video Share
              </button>
            )}
          </>
        )}
      </div>
      <div className="MediaShare-body" style={displayStyle}>
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

export default MediaShare;
