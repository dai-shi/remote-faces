import { useCallback, useEffect, useState, useRef } from "react";

import { getFaceVideoStream } from "../media/video";
import { getAudioStream } from "../media/audio";
import { useRoomMedia } from "./useRoom";

const addTrackToStream = (
  track: MediaStreamTrack,
  stream: MediaStream | null,
  disposeStream: (s: MediaStream) => void
) => {
  const newStream = stream || new MediaStream();
  newStream.addTrack(track);
  newStream.dispatchEvent(new MediaStreamTrackEvent("addtrack", { track }));
  track.addEventListener("ended", () => {
    newStream.removeTrack(track);
    if (newStream.getTracks().length === 0) {
      disposeStream(newStream);
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
  audioDeviceId?: string,
  uniqueMediaId?: string
) => {
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
  const [faceStreamMap, setFaceStreamMap] = useState<{
    [userId: string]: MediaStream;
  }>({});

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onTrack = useCallback(async (track, info) => {
    const disposeStream = (s: MediaStream) => {
      if (isMounted.current) {
        setFaceStreamMap((prev) => {
          const { [info.userId]: oldStream, ...rest } = prev;
          if (oldStream === s) {
            return rest;
          }
          return prev;
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

  const addVideoTrack = useRoomMedia(
    roomId,
    userId,
    onTrack,
    videoEnabled ? `${uniqueMediaId || "face"}Video` : undefined
  );

  const addAudioTrack = useRoomMedia(
    roomId,
    userId,
    onTrack,
    audioEnabled ? `${uniqueMediaId || "face"}Audio` : undefined
  );

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (videoEnabled && addVideoTrack) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getFaceVideoStream(videoDeviceId);
        const [videoTrack] = videoStream.getVideoTracks();
        const removeVideoTrack = addVideoTrack(videoTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(videoTrack, prev, disposeStream)
        );
        dispose = () => {
          removeVideoTrack();
          disposeVideo();
          // XXX we need to manually dispatch ended event, why?
          videoTrack.dispatchEvent(new Event("ended"));
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, videoEnabled, videoDeviceId, addVideoTrack]);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    if (audioEnabled && addAudioTrack) {
      (async () => {
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const [audioTrack] = audioStream.getAudioTracks();
        const removeAudioTrack = addAudioTrack(audioTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(audioTrack, prev, disposeStream)
        );
        dispose = () => {
          removeAudioTrack();
          disposeAudio();
          // XXX we need to manually dispatch ended event, why?
          audioTrack.dispatchEvent(new Event("ended"));
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, audioEnabled, audioDeviceId, addAudioTrack]);
  useEffect(() => {
    if (faceStream) {
      faceStream.getAudioTracks().forEach((track) => {
        const audioTrack = track;
        audioTrack.enabled = micOn;
      });
      const onaddtrack = (event: MediaStreamTrackEvent) => {
        const { track } = event;
        if (track.kind === "audio") {
          track.enabled = micOn;
        }
      };
      faceStream.addEventListener("addtrack", onaddtrack);
      return () => {
        faceStream.removeEventListener("addtrack", onaddtrack);
      };
    }
    return undefined;
  }, [faceStream, micOn]);

  return { faceStream, faceStreamMap };
};
