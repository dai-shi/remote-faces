/* eslint react/jsx-props-no-spreading: off */

import React, {
  Suspense,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import * as THREE from "three";
import { Canvas, useThree } from "react-three-fiber";
import { useDrag } from "react-use-gesture";
import { Text } from "@react-three/drei/Text";

import "./SpatialArea.css";
import { useSpatialArea, AvatarData, AvatarMap } from "../hooks/useSpatialArea";
import { useVideoDevices, useAudioDevices } from "../hooks/useAvailableDevices";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { useNicknameMap } from "../hooks/useNicknameMap";
import { loopbackPeerConnection } from "../network/trackUtils";

const useAvatarVideo = (faceStream: MediaStream | null) => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  useEffect(() => {
    if (faceStream) {
      const stream = faceStream;
      const callback = () => {
        setVideoTrack(stream.getVideoTracks()[0]);
      };
      faceStream.addEventListener("addtrack", callback);
      callback();
      return () => faceStream.removeEventListener("addtrack", callback);
    }
    return undefined;
  }, [faceStream]);
  useEffect(() => {
    if (videoTrack) {
      videoTrack.addEventListener("ended", () => {
        setVideoTrack(undefined);
      });
    }
  }, [videoTrack]);
  const [texture, setTexture] = useState<THREE.VideoTexture>();
  useEffect(() => {
    if (!videoTrack) return;
    const videoEle = document.createElement("video");
    videoEle.autoplay = true;
    videoEle.srcObject = new MediaStream([videoTrack]);
    const videoTexture = new THREE.VideoTexture(videoEle);
    setTexture(videoTexture);
  }, [videoTrack]);
  return texture;
};

const useAvatarAudio = (faceStream: MediaStream | null, isMyself: boolean) => {
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  useEffect(() => {
    if (faceStream) {
      const stream = faceStream;
      const callback = () => {
        setAudioTrack(stream.getAudioTracks()[0]);
      };
      faceStream.addEventListener("addtrack", callback);
      callback();
      return () => faceStream.removeEventListener("addtrack", callback);
    }
    return undefined;
  }, [faceStream]);
  useEffect(() => {
    if (audioTrack) {
      audioTrack.addEventListener("ended", () => {
        setAudioTrack(undefined);
      });
    }
  }, [audioTrack]);
  const setGainValueRef = useRef<((value: number) => void) | null>(null);
  const [gain, setGain] = useState<number | null>(null);
  const setGainCallback = useCallback((value: number) => {
    if (setGainValueRef.current) {
      setGain(value);
      setGainValueRef.current(value);
    } else {
      setGain(null);
    }
  }, []);
  useEffect(() => {
    if (isMyself || !audioTrack) return undefined;
    const audioCtx = new AudioContext();
    const destination = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createMediaStreamSource(
      new MediaStream([audioTrack])
    );
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    setGain(0.5);
    setGainValueRef.current = (value: number) => {
      gainNode.gain.setValueAtTime(value, audioCtx.currentTime);
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
      setGainValueRef.current = null;
      audioCtx.close();
      gainedAudioTrack.dispatchEvent(new Event("ended"));
      document.body.removeChild(videoEle);
    };
  }, [isMyself, audioTrack]);
  return [gain, setGainCallback] as const;
};

const Avatar = React.memo<{
  nickname: string;
  faceStream: MediaStream | null;
  position: [number, number, number];
  setPosition?: (nextPosition: [number, number, number]) => void;
  distance?: number;
  muted?: boolean;
}>(({ nickname, faceStream, position, setPosition, distance, muted }) => {
  const isMyself = !!setPosition;
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
  const texture = useAvatarVideo(faceStream);
  const [gain, setGain] = useAvatarAudio(faceStream, isMyself);
  useEffect(() => {
    if (distance === undefined || muted) {
      setGain(0.0);
      return;
    }
    setGain(Math.min(1.0, Math.max(0.0, (5 - distance) / 4)));
  }, [muted, distance, setGain]);
  if (!texture) return null;
  return (
    <>
      <sprite {...(isMyself && bind())} position={position}>
        <spriteMaterial map={texture} />
      </sprite>
      <Text
        color="blue"
        fontSize={0.3}
        anchorX="left"
        anchorY="top"
        position={[position[0] - 0.5, position[1] + 0.5, position[2]]}
      >
        {nickname}
      </Text>
      {gain !== null && (
        <Text
          color="red"
          fontSize={0.3}
          anchorX="left"
          anchorY="bottom"
          position={[position[0] - 0.5, position[1] - 0.5, position[2]]}
        >
          {gain.toFixed(2)}
        </Text>
      )}
    </>
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
