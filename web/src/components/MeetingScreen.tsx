import { memo, useCallback, useState, useEffect } from "react";

import "./MeetingScreen.css";
import { useMediaShare } from "../hooks/useMediaShare";
import { useNicknameMap } from "../hooks/useNicknameMap";

const StreamOpener = memo<{
  nickname: string;
  stream: MediaStream;
}>(({ nickname, stream }) => {
  const open = useCallback(() => {
    const win = window.open("stream_viewer.html", "_blank");
    if (!win) {
      return;
    }
    win.onload = async () => {
      win.document.title = nickname;
      const pc = new RTCPeerConnection();
      pc.addTrack(stream.getVideoTracks()[0], stream);
      pc.onicecandidate = (evt) => {
        if (!evt.candidate && pc.localDescription) {
          win.postMessage(pc.localDescription.sdp);
        }
      };
      window.addEventListener("message", async (evt) => {
        await pc.setRemoteDescription({ type: "answer", sdp: evt.data });
      });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    };
  }, [nickname, stream]);
  return (
    <div className="MeetingScreen-opener">
      <button type="button" onClick={open}>
        {nickname}
      </button>
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
        {videoStream && (
          <StreamOpener nickname={nickname} stream={videoStream} />
        )}
        {Object.keys(videoStreamMap).map((mediaUserId) => {
          const stream = videoStreamMap[mediaUserId];
          if (!stream) return null;
          return (
            <StreamOpener
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
