import { useCallback, useEffect, useState, useRef } from "react";

import { getFaceVideoStream, isVideoTrackFaceSize } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

const addTrackWithNewStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null
) => {
  const prevVideoTrack = stream && stream.getVideoTracks()[0];
  const prevAudioTrack = stream && stream.getAudioTracks()[0];
  if (stream && (prevVideoTrack === track || prevAudioTrack === track)) {
    // not changed
    return stream;
  }
  const newStream = new MediaStream();
  newStream.addTrack(track);
  if (track.kind === "video" && prevAudioTrack) {
    newStream.addTrack(prevAudioTrack);
  } else if (track.kind === "audio" && prevVideoTrack) {
    newStream.addTrack(prevVideoTrack);
  }
  return newStream;
};

const removeTrackWithNewStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null
) => {
  const prevVideoTrack = stream && stream.getVideoTracks()[0];
  const prevAudioTrack = stream && stream.getAudioTracks()[0];
  const newStream = new MediaStream();
  if (track.kind === "video" && prevAudioTrack) {
    newStream.addTrack(prevAudioTrack);
  } else if (track.kind === "audio" && prevVideoTrack) {
    newStream.addTrack(prevVideoTrack);
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
  micOn: boolean,
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
    setFaceStreamMap((prev) => {
      const oldStream = prev[info.userId];
      const newStream = addTrackWithNewStream(track, oldStream);
      if (oldStream === newStream) {
        return prev;
      }
      return { ...prev, [info.userId]: newStream };
    });
    const onended = () => {
      setFaceStreamMap((prev) => ({
        ...prev,
        [info.userId]: removeTrackWithNewStream(track, prev[info.userId]),
      }));
    };
    track.addEventListener("ended", onended);
    cleanupFns.current.push(() => {
      track.removeEventListener("ended", onended);
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
        } = await getFaceVideoStream(videoDeviceId);
        const [videoTrack] = videoStream.getVideoTracks();
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
        const [audioTrack] = audioStream.getAudioTracks();
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
  useEffect(() => {
    if (faceStream) {
      const [audioTrack] = faceStream.getAudioTracks();
      if (audioTrack) {
        audioTrack.enabled = micOn;
      }
    }
  }, [faceStream, micOn]);

  return { faceStream, faceStreamMap };
};
