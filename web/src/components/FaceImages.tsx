import React from "react";

import "./FaceImages.css";
import { BLANK_IMAGE } from "../media/imagePresets";
import { useFaceImages } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";

const FaceImage = React.memo<{
  image?: string;
  nickname: string;
  statusMesg: string;
  obsoleted?: boolean;
  liveMode: boolean;
  stream?: MediaStream;
  muted: boolean;
  micOn: boolean;
  speakerOn: boolean;
}>(
  ({
    image,
    nickname,
    statusMesg,
    obsoleted,
    liveMode,
    stream,
    muted,
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
          muted={muted}
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
        title={[...statusMesg][1] ? statusMesg : "(No status message)"}
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
      {liveMode && !obsoleted && (
        <div className="FaceImages-mic-speaker-icons">
          {micOn && <span title="Mic On">&#x1F3A4;</span>}
          {speakerOn && <span title="Speaker On">&#x1F508;</span>}
        </div>
      )}
    </div>
  )
);

export const FaceImages = React.memo<{
  roomId: string;
  userId: string;
  avatar: string;
  nickname: string;
  statusMesg: string;
  suspended: boolean;
  liveMode: boolean;
  micOn: boolean;
  speakerOn: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
}>(
  ({
    roomId,
    userId,
    avatar,
    nickname,
    statusMesg,
    suspended,
    liveMode,
    micOn,
    speakerOn,
    videoDeviceId,
    audioDeviceId,
  }) => {
    const { myImage, roomImages } = useFaceImages(
      roomId,
      userId,
      avatar,
      nickname,
      statusMesg,
      suspended,
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
          muted
          micOn={micOn}
          speakerOn={speakerOn}
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
            muted={!speakerOn}
            micOn={item.info.micOn}
            speakerOn={item.info.speakerOn}
          />
        ))}
      </>
    );
  }
);
