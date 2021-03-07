import { useEffect, useState, useRef } from "react";
import { useProxy } from "valtio";

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
    if (faceStreamMap[uid].getTracks().includes(track)) return;
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

  const trackMap = useProxy(getRoomState(roomId, userId).trackMap);
  Object.entries(trackMap[videoType] || {}).forEach(onTrack);
  Object.entries(trackMap[audioType] || {}).forEach(onTrack);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let dispose: (() => void) | null = null;
    if (videoEnabled) {
      (async () => {
        const {
          stream: videoStream,
          dispose: disposeVideo,
        } = await getFaceVideoStream(videoDeviceId);
        const [videoTrack] = videoStream.getVideoTracks();
        roomState.addTrack(videoType, videoTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(videoTrack, prev, disposeStream)
        );
        dispose = () => {
          roomState.removeTrack(videoType);
          disposeVideo();
          // XXX we need to manually dispatch ended event, why?
          videoTrack.dispatchEvent(new Event("ended"));
        };
      })();
    }
    return () => {
      if (dispose) dispose();
    };
  }, [roomId, userId, videoEnabled, videoDeviceId, videoType]);

  useEffect(() => {
    const roomState = getRoomState(roomId, userId);
    let dispose: (() => void) | null = null;
    if (audioEnabled) {
      (async () => {
        const {
          stream: audioStream,
          dispose: disposeAudio,
        } = await getAudioStream(audioDeviceId);
        const [audioTrack] = audioStream.getAudioTracks();
        roomState.addTrack(audioType, audioTrack);
        const disposeStream = (s: MediaStream) => {
          if (isMounted.current) {
            setFaceStream((prev) => (prev === s ? null : prev));
          }
        };
        setFaceStream((prev) =>
          addTrackToStream(audioTrack, prev, disposeStream)
        );
        dispose = () => {
          roomState.removeTrack(audioType);
          disposeAudio();
          // XXX we need to manually dispatch ended event, why?
          audioTrack.dispatchEvent(new Event("ended"));
        };
      })();
    }
    return () => {
      if (dispose) dispose();
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
