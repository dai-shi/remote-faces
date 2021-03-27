import { useEffect, useState, useRef } from "react";
import { useSnapshot } from "valtio";

import { getFaceVideoStream } from "../media/video";
import { getAudioStream } from "../media/audio";
import { getRoomState } from "../states/roomMap";

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
  const videoType = `${uniqueMediaId || "face"}Video`;
  const audioType = `${uniqueMediaId || "face"}Audio`;
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
  const [faceStreamMap, setFaceStreamMap] = useState<{
    [userId: string]: MediaStream;
  }>({});

  const isMounted = useRef(true);
  useEffect(() => {
    const cleanup = () => {
      isMounted.current = false;
    };
    return cleanup;
  }, []);

  const onTrack = ([uid, track]: [string, MediaStreamTrack]) => {
    if (track.readyState === "ended") return;
    if (faceStreamMap[uid]?.getTracks().includes(track)) return;
    const disposeStream = (s: MediaStream) => {
      if (isMounted.current) {
        setFaceStreamMap((prev) => {
          const { [uid]: oldStream, ...rest } = prev;
          if (oldStream === s) {
            return rest;
          }
          return prev;
        });
      }
    };
    setFaceStreamMap((prev) => {
      const stream = prev[uid];
      const newStream = addTrackToStream(track, stream, disposeStream);
      if (stream === newStream) {
        return prev;
      }
      return { ...prev, [uid]: newStream };
    });
  };

  const trackMap = useSnapshot(getRoomState(roomId, userId).trackMap);
  Object.entries(trackMap[videoType] || {}).forEach(onTrack);
  Object.entries(trackMap[audioType] || {}).forEach(onTrack);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let cleanup: (() => void) | null | false = null;
    if (videoEnabled) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getFaceVideoStream(videoDeviceId);
        const [videoTrack] = videoStream.getVideoTracks();
        roomState.addMediaType(videoType);
        roomState.addTrack(videoType, videoTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(videoTrack, prev, disposeStream)
        );
        const dispose = () => {
          roomState.removeMediaType(videoType);
          roomState.removeTrack(videoType);
          disposeVideo();
          // XXX we need to manually dispatch ended event, why?
          videoTrack.dispatchEvent(new Event("ended"));
        };
        if (cleanup === false) {
          dispose();
        } else {
          cleanup = dispose;
        }
      })();
    }
    return () => {
      if (cleanup) cleanup();
      cleanup = false;
    };
  }, [roomId, userId, videoEnabled, videoDeviceId, videoType]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let cleanup: (() => void) | null | false = null;
    if (audioEnabled) {
      (async () => {
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const [audioTrack] = audioStream.getAudioTracks();
        roomState.addMediaType(audioType);
        roomState.addTrack(audioType, audioTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(audioTrack, prev, disposeStream)
        );
        const dispose = () => {
          roomState.removeMediaType(audioType);
          roomState.removeTrack(audioType);
          disposeAudio();
          // XXX we need to manually dispatch ended event, why?
          audioTrack.dispatchEvent(new Event("ended"));
        };
        if (cleanup === false) {
          dispose();
        } else {
          cleanup = dispose;
        }
      })();
    }
    return () => {
      if (cleanup) cleanup();
      cleanup = false;
    };
  }, [roomId, userId, audioEnabled, audioDeviceId, audioType]);

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
