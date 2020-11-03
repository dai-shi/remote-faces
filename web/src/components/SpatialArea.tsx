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
  setPosition: (nextPosition: [number, number, number]) => void;
}>(({ nickname, faceStream, position, setPosition }) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const firstPosition = useRef<[number, number, number]>();
  const bind = useDrag(
    ({ first, initial: [ix, iy], xy: [x, y] }) => {
      if (first) {
        firstPosition.current = position;
      }
      const [fx, fy] = firstPosition.current as [number, number, number];
      setPosition([fx + (x - ix) / aspect, fy - (y - iy) / aspect, 0]);
      console.log("set pos");
    },
    { eventOptions: { pointer: true } }
  );
  const [texture, setTexture] = useState<THREE.CanvasTexture>();
  useEffect(() => {
    const videoTrack = faceStream?.getVideoTracks()[0];
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
  }, [nickname, faceStream]);
  if (!texture) return null;
  return (
    <sprite {...bind()} position={position}>
      <spriteMaterial map={texture} />
    </sprite>
  );
});

const getInitialPosition = (uid: string) => [
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
  setAvatar: (uid: string, avatarData: AvatarData) => void;
}>(
  ({
    userId,
    nickname,
    faceStream,
    nicknameMap,
    faceStreamMap,
    avatarMap,
    setAvatar,
  }) => {
    const getPosition = (uid: string) =>
      avatarMap[uid]?.position || getInitialPosition(uid);

    const setPosition = (uid: string) => (
      nextPosition: [number, number, number]
    ) => {
      setAvatar(uid, { position: nextPosition });
    };

    return (
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          {Object.keys(faceStreamMap).map(
            (uid) =>
              uid !== userId && (
                <Avatar
                  key={uid}
                  nickname={nicknameMap[uid] || ""}
                  faceStream={faceStreamMap[uid] || null}
                  position={getPosition(uid)}
                  setPosition={setPosition(uid)}
                />
              )
          )}
          <Avatar
            nickname={nickname}
            faceStream={faceStream}
            position={getPosition(userId)}
            setPosition={setPosition(userId)}
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
  const { avatarMap, setAvatar } = useSpatialArea(roomId, userId);

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
          setAvatar={setAvatar}
        />
      </div>
    </div>
  );
});

export default SpatialArea;
