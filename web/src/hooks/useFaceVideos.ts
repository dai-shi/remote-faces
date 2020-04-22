import { useEffect, useMemo } from "react";

import { getVideoStream } from "../media/video";
import { useRoomMedia } from "./useRoom";

export const useFaceVideos = (
  roomId: string,
  enabled: boolean,
  deviceId?: string
) => {
  const { myStream, streamList } = useRoomMedia(roomId, enabled);
  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && myStream) {
      (async () => {
        const result = await getVideoStream(deviceId);
        myStream.addTrack(result.stream.getVideoTracks()[0]);
        dispose = result.dispose;
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, enabled, deviceId, myStream]);
  const streamMap = useMemo(() => {
    const map: { [userId: string]: MediaStream } = {};
    streamList.forEach((item) => {
      if (typeof item.attachedData === "object") {
        const { userId } = item.attachedData as { userId: unknown };
        if (typeof userId === "string") {
          map[userId] = item.stream;
        }
      }
    });
    return map;
  }, [streamList]);
  return { myStream, streamMap };
};
