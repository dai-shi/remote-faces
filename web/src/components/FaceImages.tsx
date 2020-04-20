import React from "react";

import "./FaceImages.css";
import { useFaceImages } from "../hooks/useFaceImages";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
  statusMesg: string;
  deviceId?: string;
};

const FaceImages: React.FC<Props> = ({
  roomId,
  userId,
  nickname,
  statusMesg,
  deviceId,
}) => {
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    nickname,
    statusMesg,
    deviceId
  );

  return (
    <div className="FaceImage-container">
      <div className="FaceImages-card">
        <img
          src={myImage || BLANK_IMAGE}
          className="FaceImages-photo"
          alt="myself"
        />
        <div className="FaceImages-name">{nickname}</div>
        <div className="FaceImages-mesg">{statusMesg}</div>
      </div>
      {roomImages.map((item) => (
        <div
          key={item.userId}
          className="FaceImages-card"
          style={{ opacity: item.obsoleted ? 0.2 : 1 }}
        >
          <img src={item.image} className="FaceImages-photo" alt="friend" />
          <div className="FaceImages-name">{item.info.nickname}</div>
          <div className="FaceImages-mesg">{item.info.message}</div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(FaceImages);
