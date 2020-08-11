import { useCallback, useEffect, useState, useRef } from "react";

import { getVideoStream } from "../media/video";
import { useRoomMedia } from "./useRoom";

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

  const onTrack = useCallback(async (track, info) => {
    setVideoStreamMap((prev) => ({
      ...prev,
      [info.userId]: new MediaStream([track]),
    }));
    const onended = () => {
      setVideoStreamMap((prev) => ({
        ...prev,
        [info.userId]: null,
      }));
    };
    track.addEventListener("ended", onended);
    cleanupFns.current.push(() => {
      track.removeEventListener("ended", onended);
    });
  }, []);

  const { addTrack, removeTrack } = useRoomMedia(
    roomId,
    userId,
    onTrack,
    "cameraVideo"
  );

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && addTrack && removeTrack) {
      (async () => {
        const result = await getVideoStream(videoDeviceId);
        const [track] = result.stream.getVideoTracks();
        addTrack(track);
        setVideoStream(result.stream);
        dispose = () => {
          removeTrack();
          result.dispose();
          setVideoStream(null);
          setEnabled(false);
        };
        track.addEventListener("ended", () => {
          if (dispose) dispose();
          dispose = null;
        });
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, videoDeviceId, enabled, setEnabled, addTrack, removeTrack]);

  return { videoStream, videoStreamMap };
};
