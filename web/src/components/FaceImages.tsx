import React, { useState, useRef, useEffect } from "react";

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
  liveMode?: boolean;
  stream?: MediaStream;
  unmuted?: boolean;
}>(({ image, nickname, statusMesg, obsoleted, liveMode, stream, unmuted }) => {
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    const checkStream = () => {
      setHasVideo(!!stream && stream.getVideoTracks().length > 0);
      setHasAudio(!!stream && stream.getAudioTracks().length > 0);
    };
    if (stream) {
      stream.addEventListener("addtrack", checkStream);
      stream.addEventListener("removetrack", checkStream);
    }
    checkStream();
    return () => {
      if (stream) {
        stream.removeEventListener("addtrack", checkStream);
        stream.removeEventListener("removetrack", checkStream);
      }
    };
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
      {liveMode && hasVideo && hasAudio && (
        <div className="FaceImages-live-indicator" title="Video/Audio On">
          &#9672;
        </div>
      )}
      {liveMode && hasVideo && !hasAudio && (
        <div className="FaceImages-live-indicator" title="Video On">
          &#9673;
        </div>
      )}
      {liveMode && !hasVideo && !hasAudio && (
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
  liveType: "off" | "video" | "video+audio";
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
    videoDeviceId
  );
  const { myStream, streamMap } = useFaceVideos(
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
        liveMode={liveType !== "off"}
        stream={myStream || undefined}
      />
      {roomImages.map((item) => (
        <FaceImage
          key={item.userId}
          image={item.image}
          nickname={item.info.nickname}
          statusMesg={item.info.message}
          obsoleted={item.obsoleted}
          liveMode={item.liveMode}
          stream={streamMap[item.userId]}
          unmuted={liveType === "video+audio"}
        />
      ))}
    </div>
  );
};

export default React.memo(FaceImages);
