import { useEffect, useState, useRef } from "react";
import { useProxy } from "valtio";

import { getScreenStream } from "../media/screen";
import { getRoomState } from "../states/roomMap";

export const useScreenShare = (
  roomId: string,
  userId: string,
  enabled: boolean,
  setEnabled: (enabled: boolean) => void
) => {
  const videoType = "screenVideo";
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [screenStreamMap, setScreenStreamMap] = useState<{
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
    if (screenStreamMap[uid]?.getTracks().includes(track)) return;
    setScreenStreamMap((prev) => ({
      ...prev,
      [uid]: new MediaStream([track]),
    }));
    const onended = () => {
      setScreenStreamMap((prev) => ({
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
    let dispose: (() => void) | null = null;
    if (enabled) {
      (async () => {
        const result = await getScreenStream();
        if (!result) {
          setEnabled(false);
          return;
        }
        const [track] = result.stream.getVideoTracks();
        roomState.addTrack(videoType, track);
        setScreenStream(result.stream);
        dispose = () => {
          roomState.removeTrack(videoType);
          result.dispose();
          setScreenStream(null);
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
  }, [roomId, userId, enabled, setEnabled]);

  return { screenStream, screenStreamMap };
};
