import React, { useRef, useEffect } from "react";

import "./FaceImages.css";
import { useFaceImages, LiveType } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

const FaceImage = React.memo<{
  image?: string;
  nickname: string;
  statusMesg: string;
  obsoleted?: boolean;
  liveType?: LiveType;
  stream?: MediaStream;
  unmuted?: boolean;
}>(({ image, nickname, statusMesg, obsoleted, liveType, stream, unmuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  const hasVideo = !!stream && stream.getVideoTracks().length > 0;
  const hasAudio = !!stream && stream.getAudioTracks().length > 0;
  return (
    <div className="FaceImages-card" style={{ opacity: obsoleted ? 0.2 : 1 }}>
      {liveType !== "off" && stream ? (
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
      {liveType !== "off" && hasVideo && hasAudio && (
        <div className="FaceImages-live-indicator" title="Video/Audio On">
          &#9672;
        </div>
      )}
      {liveType !== "off" && hasVideo && !hasAudio && (
        <div className="FaceImages-live-indicator" title="Video On">
          &#9673;
        </div>
      )}
      {(liveType === "video" || liveType === "video+audio") &&
        !stream &&
        !obsoleted && (
          <div className="FaceImages-live-indicator" title="Video On">
            &#9678;
          </div>
        )}
    </div>
  );
});

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
  statusMesg: string;
  liveType: LiveType;
  videoDeviceId?: string;
  audioDeviceId?: string;
};

const FaceImages: React.FC<Props> = ({
  roomId,
  userId,
  nickname,
  statusMesg,
  liveType,
  videoDeviceId,
  audioDeviceId,
}) => {
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    nickname,
    statusMesg,
    liveType,
    videoDeviceId
  );
  const { faceStream, faceStreamMap } = useFaceVideos(
    roomId,
    userId,
    liveType === "video" || liveType === "video+audio",
    liveType === "video+audio",
    videoDeviceId,
    audioDeviceId
  );

  return (
    <div className="FaceImage-container">
      <FaceImage
        image={myImage}
        nickname={nickname}
        statusMesg={statusMesg}
        liveType={liveType}
        stream={faceStream || undefined}
      />
      {roomImages.map((item) => (
        <FaceImage
          key={item.userId}
          image={item.image}
          nickname={item.info.nickname}
          statusMesg={item.info.message}
          obsoleted={item.obsoleted}
          liveType={item.info.liveType}
          stream={faceStreamMap[item.userId] || undefined}
          unmuted={liveType === "video+audio"}
        />
      ))}
    </div>
  );
};

export default React.memo(FaceImages);
