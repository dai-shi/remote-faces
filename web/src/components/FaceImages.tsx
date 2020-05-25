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
  mySpeakerOn?: boolean;
  micOn?: boolean;
  speakerOn?: boolean;
}>(
  ({
    image,
    nickname,
    statusMesg,
    obsoleted,
    liveMode,
    stream,
    mySpeakerOn,
    micOn,
    speakerOn,
  }) => (
    <div className="FaceImages-card" style={{ opacity: obsoleted ? 0.2 : 1 }}>
      {liveMode && !obsoleted && stream ? (
        <video
          className="FaceImages-photo"
          ref={(videoEle) => {
            if (videoEle && videoEle.srcObject !== stream) {
              // eslint-disable-next-line no-param-reassign
              videoEle.srcObject = stream;
            }
          }}
          autoPlay
          playsInline
          muted={!mySpeakerOn}
        />
      ) : (
        <img
          src={image || BLANK_IMAGE}
          className="FaceImages-photo"
          alt="myself"
        />
      )}
      <div className="FaceImages-name">{nickname}</div>
      <div
        className="FaceImages-mesg"
        title={[...statusMesg][1] ? statusMesg : "Enter status message"}
      >
        {[...statusMesg][0]}
      </div>
      {liveMode && !obsoleted && stream && (
        <div className="FaceImages-live-indicator" title="Live Mode On">
          &#9673;
        </div>
      )}
      {liveMode && !obsoleted && !stream && (
        <div className="FaceImages-live-indicator" title="Live Mode Available">
          &#9678;
        </div>
      )}
      {micOn && (
        <div className="FaceImages-mic-indicator" title="Mic On">
          <>&#x1F3A4;</>
        </div>
      )}
      {speakerOn && (
        <div className="FaceImages-speaker-indicator" title="Speaker On">
          <>&#x1F508;</>
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
      micOn,
      speakerOn,
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
      <>
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
            mySpeakerOn={speakerOn}
            micOn={item.info.micOn}
            speakerOn={item.info.speakerOn}
          />
        ))}
      </>
    );
  }
);
