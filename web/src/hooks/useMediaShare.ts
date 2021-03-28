import { useEffect, useState, useRef } from "react";
import { useSnapshot } from "valtio";

import { getScreenStream } from "../media/screen";
import { getVideoStream } from "../media/video";
import { getRoomState } from "../states/roomMap";

export const useMediaShare = (
  roomId: string,
  userId: string,
  mediaId: { video: string } | "SCREEN" | null,
  close: () => void,
  uniqueShareId?: string
) => {
  const videoType = `${uniqueShareId || "mediaShare"}Video`;
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

  const trackMap = useSnapshot(getRoomState(roomId, userId).trackMap);
  Object.entries(trackMap[videoType] || {}).forEach(onTrack);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    roomState.addMediaType(videoType);
    return () => {
      roomState.removeMediaType(videoType);
    };
  }, [roomId, userId, videoType]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let cleanup: (() => void) | null | false = null;
    if (mediaId) {
      (async () => {
        let result: { stream: MediaStream; dispose: () => void };
        if (mediaId === "SCREEN") {
          const resultOrNull = await getScreenStream();
          if (!resultOrNull) {
            close();
            return;
          }
          result = resultOrNull;
        } else {
          result = await getVideoStream(mediaId.video);
        }
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
          close();
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
  }, [roomId, userId, videoType, mediaId, close]);

  return { videoStream, videoStreamMap };
};
