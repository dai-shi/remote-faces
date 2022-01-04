import { memo } from "react";

import "./FaceCard.css";
import { useFaceImageObsoleted } from "../hooks/useFaceImages";
import { BLANK_IMAGE } from "../media/imagePresets";
import { isEmoji } from "../utils/emoji";

export const FaceCard = memo<{
  image?: string;
  nickname: string;
  statusMesg: string;
  setStatusMesg?: (mesg: string) => void;
  updated?: number; // in milliseconds
  inFaceList?: boolean;
  liveMode?: boolean;
  stream?: MediaStream;
  muted: boolean;
  micOn: boolean;
  speakerOn: boolean;
}>(
  ({
    image,
    nickname,
    statusMesg,
    setStatusMesg,
    updated,
    inFaceList,
    liveMode,
    stream,
    muted,
    micOn,
    speakerOn,
  }) => {
    const obsoleted = useFaceImageObsoleted(updated);
    const updatedDate = updated && new Date(updated);
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
        const mesg = window.prompt("Enter status message");
        if (mesg !== null) {
          setStatusMesg(mesg);
        }
      }
    };
    return (
      <div
        className="FaceCard-container"
        style={{
          opacity: obsoleted ? 0.2 : 1,
          cursor: inFaceList && setStatusMesg ? "pointer" : "inherit",
        }}
        title={inFaceList ? statusMesg || "(No status message)" : undefined}
        onClick={inFaceList && setStatusMesg ? editStatusMesg : undefined}
        aria-hidden="true"
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
        {inFaceList && <div className="FaceCard-mesg">{emoji}</div>}
        {inFaceList && updatedDate && (
          <div className="FaceCard-updated">
            <span title={updatedDate.toLocaleString()}>
              {`${updatedDate.getHours()}`.padStart(2, "0")}:
              {`${updatedDate.getMinutes()}`.padStart(2, "0")}
            </span>
          </div>
        )}
        {!inFaceList && liveMode && stream && (
          <div className="FaceCard-mic-speaker-icons">
            {micOn && <span title="Mic On">&#x1F3A4;</span>}
            {speakerOn && <span title="Speaker On">&#x1F508;</span>}
          </div>
        )}
      </div>
    );
  }
);
