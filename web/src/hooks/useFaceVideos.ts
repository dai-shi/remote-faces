import { useEffect, useMemo } from "react";

import { getVideoStream } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

export const useFaceVideos = (
  roomId: string,
  userId: string,
  videoEnabled: boolean,
  audioEnabled: boolean,
  videoDeviceId?: string,
  audioDeviceId?: string
) => {
  const { myStream, streamList } = useRoomMedia(
    roomId,
    userId,
    videoEnabled || audioEnabled
  );
  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (videoEnabled && myStream) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getVideoStream(videoDeviceId);
        const videoTrack = videoStream.getVideoTracks()[0];
        myStream.addTrack(videoTrack);
        const addTrackEvent = new Event("addtrack");
        (addTrackEvent as any).track = videoTrack;
        myStream.dispatchEvent(addTrackEvent);
        dispose = () => {
          myStream.removeTrack(videoTrack);
          disposeVideo();
          const removeTrackEvent = new Event("removetrack");
          (removeTrackEvent as any).track = videoTrack;
          myStream.dispatchEvent(addTrackEvent);
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, videoEnabled, videoDeviceId, myStream]);
  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (audioEnabled && myStream) {
      (async () => {
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const audioTrack = audioStream.getAudioTracks()[0];
        myStream.addTrack(audioTrack);
        const addTrackEvent = new Event("addtrack");
        (addTrackEvent as any).track = audioTrack;
        myStream.dispatchEvent(addTrackEvent);
        dispose = () => {
          myStream.removeTrack(audioTrack);
          disposeAudio();
          const removeTrackEvent = new Event("removetrack");
          (removeTrackEvent as any).track = audioTrack;
          myStream.dispatchEvent(addTrackEvent);
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, audioEnabled, audioDeviceId, myStream]);
  const streamMap = useMemo(() => {
    const map: { [userId: string]: MediaStream } = {};
    streamList.forEach((item) => {
      map[item.info.userId] = item.stream;
    });
    return map;
  }, [streamList]);
  return { myStream, streamMap };
};
