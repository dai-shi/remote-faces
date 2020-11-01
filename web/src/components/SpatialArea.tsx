import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import "./SpatialArea.css";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { useNicknameMap } from "../hooks/useNicknameMap";

const Avatar = React.memo<{
  nickname: string;
  faceStream: MediaStream | null;
  position: [number, number, number];
}>(({ nickname, faceStream, position }) => {
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
      const bitmap = await imageCapture.grabFrame();
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      ctx.drawImage(bitmap, 0, 0);
      ctx.font = "18px selif";
      ctx.textBaseline = "top";
      ctx.fillStyle = "blue";
      ctx.fillText(nickname, 2, 2);
      canvasTexture.needsUpdate = true;
    }, 1000 / 7.5);
    return () => {
      clearInterval(timer);
    };
  }, [nickname, faceStream]);
  if (!texture) return null;
  return (
    <sprite position={position}>
      <spriteMaterial map={texture} />
    </sprite>
  );
});

const SpatialCanvas = React.memo<{
  nickname: string;
  faceStream: MediaStream | null;
}>(({ nickname, faceStream }) => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight />
        <Avatar
          nickname={nickname}
          faceStream={faceStream}
          position={[Math.random(), Math.random(), 0]}
        />
      </Suspense>
    </Canvas>
  );
});

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
        <SpatialCanvas nickname={nickname} faceStream={faceStream} />
      </div>
    </div>
  );
});

export default SpatialArea;
