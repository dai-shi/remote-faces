import { memo, useCallback, useRef, useState, useEffect } from "react";

import "./MeetingScreen.css";
import { useMediaShare } from "../../hooks/useMediaShare";
import { useNicknameMap } from "../../hooks/useNicknameMap";
import { secureRandomId } from "../../utils/crypto";

const Video = memo<{
  stream: MediaStream;
}>(({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video className="MeetingScreen-video" ref={videoRef} autoPlay muted />
  );
});

const StreamOpener = memo<{
  nickname: string;
  stream: MediaStream;
}>(({ nickname, stream }) => {
  const winRef = useRef<Window | null>(null);
  const close = useCallback(() => {
    try {
      winRef.current?.close();
    } catch (e) {
      // ignored
    }
  }, []);
  useEffect(() => {
    return close;
  }, [close]);
  const open = useCallback(() => {
    close();
    const id = secureRandomId();
    winRef.current = window.open(`stream_viewer.html#${id}`, "_blank");
    if (!winRef.current) {
      return;
    }
    const win = winRef.current;
    const channel = new BroadcastChannel(id);
    const pc = new RTCPeerConnection();
    pc.addTrack(stream.getVideoTracks()[0], stream);
    pc.onicecandidate = (evt) => {
      channel.postMessage({
        type: "ice",
        candidate: evt.candidate?.candidate,
        sdpMid: evt.candidate?.sdpMid,
        sdpMLineIndex: evt.candidate?.sdpMLineIndex,
      });
    };
    channel.onmessage = (evt) => {
      if (evt.data.type === "ice") {
        pc.addIceCandidate(evt.data.candidate ? evt.data : undefined);
        return;
      }
      pc.setRemoteDescription(evt.data);
    };
    win.onload = async () => {
      win.document.title = nickname;
      const offer = await pc.createOffer();
      channel.postMessage({ type: "offer", sdp: offer.sdp });
      await pc.setLocalDescription(offer);
    };
  }, [nickname, stream, close]);
  return (
    <div className="MeetingScreen-opener">
      <button type="button" onClick={open}>
        {nickname} <Video stream={stream} />
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
          <button
            type="button"
            onClick={() => setIsSharing(true)}
            disabled={!isActive}
          >
            Start Screen Share
          </button>
        )}
      </div>
      {isActive && (
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
      )}
    </div>
  );
});

export default MeetingScreen;
