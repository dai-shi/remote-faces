import React from "react";

import "./FaceCard.css";
import { BLANK_IMAGE } from "../media/imagePresets";
import { isEmoji } from "../utils/emoji";

export const FaceCard = React.memo<{
  image?: string;
  nickname: string;
  statusMesg: string;
  setStatusMesg?: (mesg: string) => void;
  obsoleted?: boolean;
  liveMode: boolean;
  stream?: MediaStream;
  muted: boolean;
  micOn: boolean;
  speakerOn: boolean;
  toggleSuspended?: () => void;
  suspended?: boolean;
}>(
  ({
    image,
    nickname,
    statusMesg,
    setStatusMesg,
    obsoleted,
    liveMode,
    stream,
    muted,
    micOn,
    speakerOn,
    toggleSuspended,
    suspended,
  }) => {
    const firstStatusMesgChar: string | undefined = [...statusMesg][0];
    let emoji = setStatusMesg ? String.fromCodePoint(0x1f4dd) : "";
    if (firstStatusMesgChar) {
      if (isEmoji(firstStatusMesgChar)) {
        emoji = firstStatusMesgChar;
      } else {
        emoji = String.fromCodePoint(0x1f4ac);
      }
    }
    const editStatusMesg = () => {
      if (setStatusMesg) {
        // eslint-disable-next-line no-alert
        const mesg = window.prompt("Enter status message");
        if (mesg !== null) {
          setStatusMesg(mesg);
        }
      }
    };
    return (
      <div
        className="FaceCard-container"
        style={{ opacity: obsoleted ? 0.2 : 1 }}
      >
        {liveMode && stream ? (
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
        {setStatusMesg ? (
          <button
            type="button"
            className="FaceCard-mesg"
            title={statusMesg || "(No status message)"}
            onClick={editStatusMesg}
          >
            {emoji}
          </button>
        ) : (
          <div
            className="FaceCard-mesg"
            title={statusMesg || "(No status message)"}
          >
            {emoji}
          </div>
        )}
        {liveMode && stream && (
          <div className="FaceCard-live-indicator" title="Live Mode On">
            &#9673;
          </div>
        )}
        {liveMode && !stream && (
          <div className="FaceCard-live-indicator" title="Live Mode Available">
            &#9678;
          </div>
        )}
        {liveMode && (
          <div className="FaceCard-mic-speaker-icons">
            {micOn && <span title="Mic On">&#x1F3A4;</span>}
            {speakerOn && <span title="Speaker On">&#x1F508;</span>}
          </div>
        )}
        {!liveMode && toggleSuspended && (
          <button
            type="button"
            className="FaceCard-camera"
            onClick={toggleSuspended}
            title={suspended ? "Enable Camera" : "Disable Camera"}
          >
            &#x1F4F7;
            {suspended && (
              <span className="FaceCard-camera-disabled">&#10060;</span>
            )}
          </button>
        )}
      </div>
    );
  }
);
