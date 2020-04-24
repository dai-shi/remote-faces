import { useEffect, useMemo } from "react";

import { getVideoStream } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

export const useFaceVideos = (
  roomId: string,
  enabled: boolean,
  videoDeviceId?: string,
  audioDeviceId?: string
) => {
  const { myStream, streamList } = useRoomMedia(roomId, enabled);
  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (enabled && myStream) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getVideoStream(videoDeviceId);
        const videoTrack = videoStream.getVideoTracks()[0];
        myStream.addTrack(videoTrack);
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const audioTrack = audioStream.getAudioTracks()[0];
        myStream.addTrack(audioTrack);
        myStream.dispatchEvent(new Event("customtrack"));
        dispose = () => {
          myStream.removeTrack(videoTrack);
          disposeVideo();
          myStream.removeTrack(audioTrack);
          disposeAudio();
          myStream.dispatchEvent(new Event("customtrack"));
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, enabled, videoDeviceId, myStream, audioDeviceId]);
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
