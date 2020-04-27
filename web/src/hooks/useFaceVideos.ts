import { useCallback, useEffect, useState, useRef } from "react";

import { getVideoStream, isVideoTrackFaceSize } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

const addTrackWithNewStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null
) => {
  const newStream = stream ? stream.clone() : new MediaStream();
  newStream.addTrack(track);
  return newStream;
};

const removeTrackWithNewStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null
) => {
  // XXX removeTrack doesn't remove from the result... a workaround
  // const newStream = stream ? stream.clone() : new MediaStream();
  // newStream.removeTrack(track);
  const newStream = new MediaStream();
  if (stream) {
    stream.getTracks().forEach((t) => {
      if (t !== track) {
        newStream.addTrack(t);
      }
    });
  }
  if (newStream.getTracks().length > 0) {
    return newStream;
  }
  return null;
};

export const useFaceVideos = (
  roomId: string,
  userId: string,
  videoEnabled: boolean,
  audioEnabled: boolean,
  videoDeviceId?: string,
  audioDeviceId?: string
) => {
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
  const [faceStreamMap, setFaceStreamMap] = useState<{
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
    if (track.kind === "video" && !(await isVideoTrackFaceSize(track))) {
      return;
    }
    setFaceStreamMap((prev) => ({
      ...prev,
      [info.userId]: addTrackWithNewStream(track, prev[info.userId]),
    }));
    const onended = () => {
      setFaceStreamMap((prev) => ({
        ...prev,
        [info.userId]: removeTrackWithNewStream(track, prev[info.userId]),
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
        setFaceStreamMap((prev) => ({
          ...prev,
          [info.userId]: removeTrackWithNewStream(track, prev[info.userId]),
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
      clearTimeout(timeout);
      track.removeEventListener("mute", onmute);
      track.removeEventListener("unmute", onunmute);
    });
  }, []);

  const {
    addTrack: addVideoTrack,
    removeTrack: removeVideoTrack,
  } = useRoomMedia(
    roomId,
    userId,
    onTrack,
    videoEnabled ? "faceVideo" : undefined
  );

  const {
    addTrack: addAudioTrack,
    removeTrack: removeAudioTrack,
  } = useRoomMedia(
    roomId,
    userId,
    onTrack,
    audioEnabled ? "faceAudio" : undefined
  );

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (videoEnabled && addVideoTrack && removeVideoTrack) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getVideoStream(videoDeviceId);
        const videoTrack = videoStream.getVideoTracks()[0];
        addVideoTrack(videoTrack);
        setFaceStream((prev) => addTrackWithNewStream(videoTrack, prev));
        dispose = () => {
          setFaceStream((prev) => removeTrackWithNewStream(videoTrack, prev));
          removeVideoTrack(videoTrack);
          disposeVideo();
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, videoEnabled, videoDeviceId, addVideoTrack, removeVideoTrack]);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (audioEnabled && addAudioTrack && removeAudioTrack) {
      (async () => {
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const audioTrack = audioStream.getAudioTracks()[0];
        addAudioTrack(audioTrack);
        setFaceStream((prev) => addTrackWithNewStream(audioTrack, prev));
        dispose = () => {
          setFaceStream((prev) => removeTrackWithNewStream(audioTrack, prev));
          removeAudioTrack(audioTrack);
          disposeAudio();
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, audioEnabled, audioDeviceId, addAudioTrack, removeAudioTrack]);

  return { faceStream, faceStreamMap };
};
