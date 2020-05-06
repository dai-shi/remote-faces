import React from "react";

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
  speakerOn?: boolean;
}>(
  ({ image, nickname, statusMesg, obsoleted, liveMode, stream, speakerOn }) => (
    <div className="FaceImages-card" style={{ opacity: obsoleted ? 0.2 : 1 }}>
      {liveMode && stream ? (
        <video
          className="FaceImages-photo"
          ref={(videoEle) => {
            if (videoEle && videoEle.srcObject !== stream) {
              // eslint-disable-next-line no-param-reassign
              videoEle.srcObject = stream;
            }
          }}
          autoPlay
          muted={!speakerOn}
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
      {liveMode && stream && (
        <div className="FaceImages-live-indicator" title="Live Mode On">
          &#9673;
        </div>
      )}
      {liveMode && !stream && !obsoleted && (
        <div className="FaceImages-live-indicator" title="Live Mode Available">
          &#9678;
        </div>
      )}
    </div>
  )
);

export const FaceImages = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
  statusMesg: string;
  liveMode: boolean;
  micOn: boolean;
  speakerOn: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
}>(
  ({
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
        />
        {roomImages.map((item) => (
          <FaceImage
            key={item.userId}
            image={item.image}
            nickname={item.info.nickname}
            statusMesg={item.info.message}
            obsoleted={item.obsoleted}
            liveMode={item.info.liveMode}
            stream={(liveMode && faceStreamMap[item.userId]) || undefined}
            speakerOn={speakerOn}
          />
        ))}
      </div>
    );
  }
);
