/* eslint react/jsx-props-no-spreading: off */

import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "react-three-fiber";
import { useDrag } from "react-use-gesture";

import "./SpatialArea.css";
import { useSpatialArea, AvatarData, AvatarMap } from "../hooks/useSpatialArea";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { loopbackPeerConnection } from "../network/trackUtils";

const useStreamTracks = (stream: MediaStream | null) => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  useEffect(() => {
    if (stream) {
      const s = stream;
      const callback = () => {
        setVideoTrack(s.getVideoTracks()[0]);
        setAudioTrack(s.getAudioTracks()[0]);
      };
      stream.addEventListener("addtrack", callback);
      callback();
      return () => stream.removeEventListener("addtrack", callback);
    }
    return undefined;
  }, [stream]);
  useEffect(() => {
    if (videoTrack) {
      videoTrack.addEventListener("ended", () => {
        setVideoTrack(undefined);
      });
    }
  }, [videoTrack]);
  useEffect(() => {
    if (audioTrack) {
      audioTrack.addEventListener("ended", () => {
        setAudioTrack(undefined);
      });
    }
  }, [audioTrack]);
  return { videoTrack, audioTrack };
};

const Avatar = React.memo<{
  nickname: string;
  faceStream: MediaStream | null;
  position: [number, number, number];
  setPosition?: (nextPosition: [number, number, number]) => void;
  distance?: number;
  muted?: boolean;
}>(({ nickname, faceStream, position, setPosition, distance, muted }) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const firstPosition = useRef<[number, number, number]>();
  const bind = useDrag(({ first, initial: [ix, iy], xy: [x, y] }) => {
    if (first) {
      firstPosition.current = position;
    }
    const [fx, fy] = firstPosition.current as [number, number, number];
    if (setPosition) {
      setPosition([fx + (x - ix) / aspect, fy - (y - iy) / aspect, 0]);
    }
  });
  const [texture, setTexture] = useState<THREE.VideoTexture>();
  const { videoTrack, audioTrack } = useStreamTracks(faceStream);
  const isMyself = !!setPosition;
  const gainValueRef = useRef<number | null>(null);
  useEffect(() => {
    if (!videoTrack) return undefined;
    const videoEle = document.createElement("video");
    videoEle.autoplay = true;
    videoEle.setAttribute("playsinline", "");
    videoEle.style.display = "block";
    videoEle.style.width = "1px";
    videoEle.style.height = "1px";
    videoEle.style.position = "absolute";
    videoEle.style.bottom = "0px";
    document.body.appendChild(videoEle);
    videoEle.srcObject = new MediaStream([videoTrack]);
    const videoTexture = new THREE.VideoTexture(videoEle);
    setTexture(videoTexture);
    return () => {
      document.body.removeChild(videoEle);
    };
  }, [nickname, isMyself, videoTrack]);
  const setGainRef = useRef<((value: number) => void) | null>(null);
  useEffect(() => {
    if (isMyself || !audioTrack) return undefined;
    const audioCtx = new AudioContext();
    const destination = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createMediaStreamSource(
      new MediaStream([audioTrack])
    );
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    gainValueRef.current = 0.5;
    setGainRef.current = (value: number) => {
      gainNode.gain.setValueAtTime(value, audioCtx.currentTime);
      gainValueRef.current = value;
    };
    source.connect(gainNode);
    gainNode.connect(destination);
    const gainedAudioTrack = destination.stream.getAudioTracks()[0];
    const videoEle = document.createElement("video");
    videoEle.autoplay = true;
    videoEle.setAttribute("playsinline", "");
    videoEle.style.display = "block";
    videoEle.style.width = "1px";
    videoEle.style.height = "1px";
    videoEle.style.position = "absolute";
    videoEle.style.bottom = "0px";
    document.body.appendChild(videoEle);
    (async () => {
      videoEle.srcObject = new MediaStream([
        await loopbackPeerConnection(gainedAudioTrack),
      ]);
    })();
    return () => {
      setGainRef.current = null;
      gainValueRef.current = null;
      audioCtx.close();
      gainedAudioTrack.dispatchEvent(new Event("ended"));
      document.body.removeChild(videoEle);
    };
  }, [isMyself, audioTrack]);
  useEffect(() => {
    if (!setGainRef.current) return;
    if (distance === undefined || muted) {
      setGainRef.current(0.0);
      return;
    }
    setGainRef.current(Math.min(1.0, Math.max(0.0, (5 - distance) / 4)));
  }, [muted, distance]);
  if (!texture) return null;
  return (
    <sprite {...(setPosition && bind())} position={position}>
      <spriteMaterial map={texture} />
    </sprite>
  );
});

const getInitialPosition = (uid: string): [number, number, number] => [
  parseInt(uid.slice(0, 2), 16) / 128 - 1,
  parseInt(uid.slice(2, 4), 16) / 128 - 1,
  0,
];

const SpatialCanvas = React.memo<{
  userId: string;
  nickname: string;
  faceStream: MediaStream | null;
  nicknameMap: { [userId: string]: string };
  faceStreamMap: { [userId: string]: MediaStream };
  avatarMap: AvatarMap;
  myAvatar?: AvatarData;
  setMyAvatar: (avatarData: AvatarData) => void;
}>(
  ({
    userId,
    nickname,
    faceStream,
    nicknameMap,
    faceStreamMap,
    avatarMap,
    myAvatar,
    setMyAvatar,
  }) => {
    const getPosition = (uid: string) =>
      avatarMap[uid]?.position || getInitialPosition(uid);

    const setMyPosition = (nextPosition: [number, number, number]) => {
      setMyAvatar({ position: nextPosition });
    };
    const myPosition = myAvatar?.position || getInitialPosition(userId);

    return (
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          {Object.keys(faceStreamMap).map((uid) => {
            if (uid === userId) return null;
            const position = getPosition(uid);
            const distance = Math.hypot(
              position[0] - myPosition[0],
              position[1] - myPosition[1],
              position[2] - myPosition[2]
            );
            return (
              <Avatar
                key={uid}
                nickname={nicknameMap[uid] || ""}
                faceStream={faceStreamMap[uid] || null}
                position={getPosition(uid)}
                distance={distance}
              />
            );
          })}
          <Avatar
            nickname={nickname}
            faceStream={faceStream}
            position={myPosition}
            setPosition={setMyPosition}
            muted
          />
        </Suspense>
      </Canvas>
    );
  }
);

export const SpatialArea = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const videoDevices = useVideoDevices();
  const [videoDeviceId, setVideoDeviceId] = useState<string>("");
  const audioDevices = useAudioDevices();
  const [audioDeviceId, setAudioDeviceId] = useState<string>("");
  const { faceStream, faceStreamMap } = useFaceVideos(
    roomId,
    userId,
    !!videoDeviceId,
    !!audioDeviceId,
    !!audioDeviceId,
    videoDeviceId,
    audioDeviceId,
    "spatialArea"
  );
  const nicknameMap = useNicknameMap(roomId, userId);
  const { avatarMap, myAvatar, setMyAvatar } = useSpatialArea(roomId, userId);

  return (
    <div className="SpatialArea-container">
      <div>
        Select Camera:{" "}
        <select
          value={videoDeviceId}
          onChange={(e) => setVideoDeviceId(e.target.value)}
        >
          <option value="">None</option>
          {videoDevices.map((videoDevice) => (
            <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
              {videoDevice.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        Select Mic:{" "}
        <select
          value={audioDeviceId}
          onChange={(e) => {
            setAudioDeviceId(e.target.value);
          }}
        >
          <option value="">None</option>
          {audioDevices.map((audioDevice) => (
            <option key={audioDevice.deviceId} value={audioDevice.deviceId}>
              {audioDevice.label}
            </option>
          ))}
        </select>
      </div>
      <div className="SpatialArea-body">
        <SpatialCanvas
          userId={userId}
          nickname={nickname}
          faceStream={faceStream}
          nicknameMap={nicknameMap}
          faceStreamMap={faceStreamMap}
          avatarMap={avatarMap}
          myAvatar={myAvatar}
          setMyAvatar={setMyAvatar}
        />
      </div>
    </div>
  );
});

export default SpatialArea;
