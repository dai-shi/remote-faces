import React, { useEffect, useState } from "react";

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
  disableAudioInput?: boolean;
  enableAudioOutput?: boolean;
}>(
  ({
    image,
    nickname,
    statusMesg,
    obsoleted,
    liveMode,
    stream,
    disableAudioInput,
    enableAudioOutput,
  }) => {
    const [hasVideo, setHasVideo] = useState(false);
    const [hasAudioOrig, setHasAudio] = useState(false);
    const hasAudio = hasAudioOrig && !disableAudioInput;
    const videoTrack = stream && stream.getVideoTracks()[0];
    const audioTrack = stream && stream.getAudioTracks()[0];
    useEffect(() => {
      if (videoTrack) {
        setHasVideo(!videoTrack.muted);
        const onmute = () => setHasVideo(false);
        const onunmute = () => setHasVideo(true);
        videoTrack.addEventListener("mute", onmute);
        videoTrack.addEventListener("unmute", onunmute);
        return () => {
          videoTrack.removeEventListener("mute", onmute);
          videoTrack.removeEventListener("unmute", onunmute);
        };
      }
      return undefined;
    }, [videoTrack]);
    useEffect(() => {
      if (audioTrack) {
        setHasAudio(!audioTrack.muted);
        const onmute = () => setHasAudio(false);
        const onunmute = () => setHasAudio(true);
        audioTrack.addEventListener("mute", onmute);
        audioTrack.addEventListener("unmute", onunmute);
        return () => {
          audioTrack.removeEventListener("mute", onmute);
          audioTrack.removeEventListener("unmute", onunmute);
        };
      }
      return undefined;
    }, [audioTrack]);
    return (
      <div className="FaceImages-card" style={{ opacity: obsoleted ? 0.2 : 1 }}>
        {liveMode && stream ? (
          <video
            className="FaceImages-photo"
            ref={(videoEle) => {
              if (videoEle) {
                // eslint-disable-next-line no-param-reassign
                videoEle.srcObject = stream;
              }
            }}
            autoPlay
            muted={!enableAudioOutput}
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
        {liveMode && !stream && !obsoleted && (
          <div className="FaceImages-live-indicator" title="Video On">
            &#9678;
          </div>
        )}
      </div>
    );
  }
);

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
  statusMesg: string;
  liveMode: boolean;
  micOn: boolean;
  speakerOn: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
};

const FaceImages: React.FC<Props> = ({
  roomId,
  userId,
  nickname,
  statusMesg,
  liveMode,
  micOn,
  speakerOn,
  videoDeviceId,
  audioDeviceId,
}) => {
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    nickname,
    statusMesg,
    liveMode,
    videoDeviceId
  );
  const { faceStream, faceStreamMap } = useFaceVideos(
    roomId,
    userId,
    liveMode,
    liveMode,
    micOn,
    videoDeviceId,
    audioDeviceId
  );

  return (
    <div className="FaceImage-container">
      <FaceImage
        image={myImage}
        nickname={nickname}
        statusMesg={statusMesg}
        liveMode={liveMode}
        stream={faceStream || undefined}
        disableAudioInput={!micOn}
      />
      {roomImages.map((item) => (
        <FaceImage
          key={item.userId}
          image={item.image}
          nickname={item.info.nickname}
          statusMesg={item.info.message}
          obsoleted={item.obsoleted}
          liveMode={item.info.liveMode}
          stream={faceStreamMap[item.userId] || undefined}
          enableAudioOutput={speakerOn}
        />
      ))}
    </div>
  );
};

export default React.memo(FaceImages);
