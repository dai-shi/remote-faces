import { useCallback, useEffect, useState, useRef } from "react";

import { getFaceVideoStream, isVideoTrackFaceSize } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

const addTrackToStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null,
  disposeStream: () => void
) => {
  const newStream = stream || new MediaStream();
  newStream.addTrack(track);
  track.addEventListener("ended", () => {
    newStream.removeTrack(track);
    if (newStream.getTracks().length === 0) {
      disposeStream();
    }
  });
  return newStream;
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
    [userId: string]: MediaStream;
  }>({});

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = false;
  }, []);

  const onTrack = useCallback(async (track, info) => {
    if (track.kind === "video" && !(await isVideoTrackFaceSize(track))) {
      return;
    }
    const disposeStream = () => {
      if (isMounted.current) {
        setFaceStreamMap((prev) => {
          const { [info.userId]: _, ...rest } = prev;
          return rest;
        });
      }
    };
    setFaceStreamMap((prev) => {
      const stream = prev[info.userId];
      const newStream = addTrackToStream(track, stream, disposeStream);
      if (stream === newStream) {
        return prev;
      }
      return { ...prev, [info.userId]: newStream };
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
        const disposeStream = () => {
          if (isMounted.current) {
            setFaceStream(null);
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(videoTrack, prev, disposeStream)
        );
        dispose = () => {
          removeVideoTrack(videoTrack);
          disposeVideo();
          // XXX we need to manually dispatch ended event, why?
          videoTrack.dispatchEvent(new Event("ended"));
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
        const disposeStream = () => {
          if (isMounted.current) {
            setFaceStream(null);
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(audioTrack, prev, disposeStream)
        );
        dispose = () => {
          removeAudioTrack(audioTrack);
          disposeAudio();
          // XXX we need to manually dispatch ended event, why?
          audioTrack.dispatchEvent(new Event("ended"));
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
