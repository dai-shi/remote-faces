import React, { useCallback, useRef } from "react";

import "./FaceImages.css";
import { useFaceImages } from "../hooks/useFaceImages";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

type Props = {
  roomId: string;
  userId: string;
  deviceId?: string;
  nickname: string;
  statusMesg: string;
};

const FaceImages: React.FC<Props> = ({
  roomId,
  userId,
  deviceId,
  nickname,
  statusMesg,
}) => {
  const faceInfo = useRef({ nickname, message: statusMesg });
  faceInfo.current = { nickname, message: statusMesg };
  const getFaceInfo = useCallback(() => faceInfo.current, []);
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    getFaceInfo,
    deviceId
  );

  return (
    <div>
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
