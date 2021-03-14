import React from "react";

import "./FaceCard.css";
import { BLANK_IMAGE } from "../media/imagePresets";

export const FaceCard = React.memo<{
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
    <div
      className="FaceCard-container"
      style={{ opacity: obsoleted ? 0.2 : 1 }}
    >
      {liveMode && !obsoleted && stream ? (
        <video
          className="FaceCard-photo"
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
          className="FaceCard-photo"
          alt="faceImage"
        />
      )}
      <div className="FaceCard-name">{nickname}</div>
      <div
        className="FaceCard-mesg"
        title={[...statusMesg][1] ? statusMesg : "(No status message)"}
      >
        {[...statusMesg][0]}
      </div>
      {liveMode && !obsoleted && stream && (
        <div className="FaceCard-live-indicator" title="Live Mode On">
          &#9673;
        </div>
      )}
      {liveMode && !obsoleted && !stream && (
        <div className="FaceCard-live-indicator" title="Live Mode Available">
          &#9678;
        </div>
      )}
      {liveMode && !obsoleted && (
        <div className="FaceCard-mic-speaker-icons">
          {micOn && <span title="Mic On">&#x1F3A4;</span>}
          {speakerOn && <span title="Speaker On">&#x1F508;</span>}
        </div>
      )}
    </div>
  )
);
