import { useEffect, useState, useMemo } from "react";

import { getScreenStream } from "../media/screen";
import { useRoomMedia } from "./useRoom";

const hasScreenTrack = (stream: MediaStream) => {
  console.log(stream.getVideoTracks());
  // TODO
  return false;
};

export const useScreenShare = (
  roomId: string,
  userId: string,
  enabled: boolean,
  setEnabled: (enabled: boolean) => void
) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { myStream, streamList } = useRoomMedia(roomId, userId, true);
  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && myStream) {
      (async () => {
        const result = await getScreenStream();
        if (!result) {
          setEnabled(false);
          return;
        }
        const track = result.stream.getVideoTracks()[0];
        (track as any).contentHint = "screen";
        myStream.addTrack(track);
        const addTrackEvent = new Event("addtrack");
        (addTrackEvent as any).track = track;
        myStream.dispatchEvent(addTrackEvent);
        setStream(result.stream);
        dispose = () => {
          myStream.removeTrack(track);
          result.dispose();
          const removeTrackEvent = new Event("removetrack");
          (removeTrackEvent as any).track = track;
          myStream.dispatchEvent(removeTrackEvent);
          setStream(null);
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
  }, [roomId, enabled, setEnabled, myStream]);
  return {
    myStream: stream,
    streamList: useMemo(
      () => streamList.filter((x) => hasScreenTrack(x.stream)),
      [streamList]
    ),
  };
};
