import { useEffect, useState, useRef } from "react";
import { useProxy } from "valtio";

import { getVideoStream } from "../media/video";
import { getRoomState } from "../states/roomMap";

const videoType = "cameraVideo";

export const useVideoShare = (
  roomId: string,
  userId: string,
  enabled: boolean,
  setEnabled: (enabled: boolean) => void,
  videoDeviceId?: string
) => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoStreamMap, setVideoStreamMap] = useState<{
    [userId: string]: MediaStream | null;
  }>({});

  type CleanupFn = () => void;
  const cleanupFns = useRef<CleanupFn[]>([]);
  useEffect(() => {
    const cleanup = () => {
      cleanupFns.current.forEach((fn) => fn());
    };
    return cleanup;
  }, []);

  const onTrack = ([uid, track]: [string, MediaStreamTrack]) => {
    if (track.readyState === "ended") return;
    if (videoStreamMap[uid]?.getTracks().includes(track)) return;
    setVideoStreamMap((prev) => ({
      ...prev,
      [uid]: new MediaStream([track]),
    }));
    const onended = () => {
      setVideoStreamMap((prev) => ({
        ...prev,
        [uid]: null,
      }));
    };
    track.addEventListener("ended", onended);
    cleanupFns.current.push(() => {
      track.removeEventListener("ended", onended);
    });
  };

  const trackMap = useProxy(getRoomState(roomId, userId).trackMap);
  Object.entries(trackMap[videoType] || {}).forEach(onTrack);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    roomState.addMediaType(videoType);
    return () => {
      roomState.removeMediaType(videoType);
    };
  }, [roomId, userId]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let cleanup: (() => void) | null | false = null;
    if (enabled) {
      (async () => {
        const result = await getVideoStream(videoDeviceId);
        const [track] = result.stream.getVideoTracks();
        roomState.addTrack(videoType, track);
        setVideoStream(result.stream);
        track.addEventListener("ended", () => {
          if (cleanup) cleanup();
          cleanup = null;
        });
        const dispose = () => {
          roomState.removeTrack(videoType);
          result.dispose();
          setVideoStream(null);
          setEnabled(false);
        };
        if (cleanup === false) {
          dispose();
        } else {
          cleanup = dispose;
        }
      })();
    }
    return () => {
      if (cleanup) cleanup();
      cleanup = false;
    };
  }, [roomId, userId, videoDeviceId, enabled, setEnabled]);

  return { videoStream, videoStreamMap };
};
