import { useEffect, useState, useRef } from "react";

import { getScreenStream } from "../media/screen";
import { useRoomMedia } from "./useRoom";

const isScreenTrack = (track: MediaStreamTrack) => {
  console.log(track, track.getSettings());
  // TODO
  return true;
};

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
  const { addTrack, removeTrack, latestTrack } = useRoomMedia(
    roomId,
    userId,
    true
  );

  type CleanupFn = () => void;
  const cleanupFns = useRef<CleanupFn[]>([]);
  useEffect(() => {
    const cleanup = () => {
      cleanupFns.current.forEach((fn) => fn());
    };
    return cleanup;
  }, []);

  useEffect(() => {
    if (!latestTrack) return;
    const { track, info } = latestTrack;
    if (!isScreenTrack(track)) return;
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
    // XXX we don't get "ended" event with removeTrack,
    // so a workaround with "mute" but "mute" is dispatched occasionally,
    // so use this timeout hack
    let timeout: NodeJS.Timeout;
    const onmute = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScreenStreamMap((prev) => ({
          ...prev,
          [info.userId]: null,
        }));
      }, 3000);
    };
    track.addEventListener("mute", onmute);
    const onunmute = () => {
      clearTimeout(timeout);
    };
    track.addEventListener("unmute", onunmute);
    cleanupFns.current.push(() => {
      track.removeEventListener("ended", onended);
      track.removeEventListener("mute", onmute);
      track.removeEventListener("unmute", onunmute);
    });
  }, [latestTrack]);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && addTrack && removeTrack) {
      (async () => {
        const result = await getScreenStream();
        if (!result) {
          setEnabled(false);
          return;
        }
        const track = result.stream.getVideoTracks()[0];
        (track as any).contentHint = "screen";
        addTrack(track);
        setScreenStream(result.stream);
        dispose = () => {
          removeTrack(track);
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
