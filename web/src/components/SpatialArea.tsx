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
  const [texture, setTexture] = useState<THREE.CanvasTexture>();
  const videoTrack = faceStream?.getVideoTracks()[0];
  useEffect(() => {
    if (!videoTrack) return undefined;
    const canvas = document.createElement("canvas");
    const canvasTexture = new THREE.CanvasTexture(canvas);
    setTexture(canvasTexture);
    const imageCapture = new ImageCapture(videoTrack);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const timer = setInterval(async () => {
      try {
        const bitmap = await imageCapture.grabFrame();
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
        ctx.font = "18px selif";
        ctx.textBaseline = "top";
        ctx.fillStyle = "blue";
        ctx.fillText(nickname, 2, 2);
        canvasTexture.needsUpdate = true;
      } catch (e) {
        // ignore
      }
    }, 1000 / 7.5);
    return () => {
      clearInterval(timer);
    };
  }, [nickname, videoTrack]);
  const isMyself = !!setPosition;
  const audioTrack = !isMyself && faceStream?.getAudioTracks()[0];
  const setGainRef = useRef<(value: number) => void>();
  useEffect(() => {
    if (!audioTrack) return undefined;
    const audio = new Audio();
    audio.srcObject = new MediaStream();
    const capture = (audio as any).captureStream();
    capture.addTrack(audioTrack);
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(capture);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    setGainRef.current = (value: number) => {
      gainNode.gain.setValueAtTime(value, audioCtx.currentTime + 1);
    };
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    return () => {
      audioCtx.close();
    };
  }, [audioTrack]);
  useEffect(() => {
    if (!setGainRef.current) return;
    if (distance === undefined || muted) {
      setGainRef.current(0.0);
      return;
    }
    setGainRef.current(Math.min(1.0, Math.max(0.0, (5 - distance) / 5)));
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
