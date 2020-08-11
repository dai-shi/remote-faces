import { useCallback, useEffect, useState, useRef } from "react";

import { getScreenStream } from "../media/screen";
import { useRoomMedia } from "./useRoom";

export const useScreenShare = (
  roomId: string,
  userId: string,
  enabled: boolean,
  setEnabled: (enabled: boolean) => void
) => {
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

  const onTrack = useCallback(async (track, info) => {
    setScreenStreamMap((prev) => ({
      ...prev,
      [info.userId]: new MediaStream([track]),
    }));
    const onended = () => {
      setScreenStreamMap((prev) => ({
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
    "screenVideo"
  );

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && addTrack && removeTrack) {
      (async () => {
        const result = await getScreenStream();
        if (!result) {
          setEnabled(false);
          return;
        }
        const [track] = result.stream.getVideoTracks();
        addTrack(track);
        setScreenStream(result.stream);
        dispose = () => {
          removeTrack();
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
  }, [roomId, enabled, setEnabled, addTrack, removeTrack]);

  return { screenStream, screenStreamMap };
};
