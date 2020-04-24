import React, { useRef, useEffect } from "react";

import "./FaceImages.css";
import { useFaceImages } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

const FaceImage = React.memo<{
  image?: string;
  nickname: string;
  statusMesg: string;
  obsoleted?: boolean;
  stream?: MediaStream;
  unmuted?: boolean;
}>(({ image, nickname, statusMesg, obsoleted, stream, unmuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div className="FaceImages-card" style={{ opacity: obsoleted ? 0.2 : 1 }}>
      {stream ? (
        <video
          className="FaceImages-photo"
          ref={videoRef}
          autoPlay
          muted={!unmuted}
        />
      ) : (
        <img
          src={image || BLANK_IMAGE}
          className="FaceImages-photo"
          alt="myself"
        />
      )}
      <div className="FaceImages-name">{nickname}</div>
      <div className="FaceImages-mesg">{statusMesg}</div>
      {!!stream && <div className="FaceImages-live-indicator">&#9673;</div>}
    </div>
  );
});

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
  statusMesg: string;
  liveMode: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
};

const FaceImages: React.FC<Props> = ({
  roomId,
  userId,
  nickname,
  statusMesg,
  liveMode,
  videoDeviceId,
  audioDeviceId,
}) => {
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    nickname,
    statusMesg,
    videoDeviceId
  );
  const { myStream, streamMap } = useFaceVideos(
    roomId,
    liveMode,
    videoDeviceId,
    audioDeviceId
  );

  return (
    <div className="FaceImage-container">
      <FaceImage
        image={myImage}
        nickname={nickname}
        statusMesg={statusMesg}
        stream={myStream || undefined}
      />
      {roomImages.map((item) => (
        <FaceImage
          key={item.userId}
          image={item.image}
          nickname={item.info.nickname}
          statusMesg={item.info.message}
          obsoleted={item.obsoleted}
          stream={streamMap[item.userId]}
          unmuted
        />
      ))}
    </div>
  );
};

export default React.memo(FaceImages);
