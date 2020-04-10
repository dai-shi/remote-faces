import React, { useCallback, useRef } from "react";

import { useFaceImages } from "../hooks/useFaceImages";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

type Props = {
  roomId: string;
  userId: string;
  nickname: string;
};

const SingleRoom: React.FC<Props> = ({ roomId, userId, nickname }) => {
  const messageRef = useRef("");

  const getFaceInfo = useCallback(
    () => ({
      nickname,
      message: messageRef.current,
    }),
    [nickname]
  );
  const { myImage, roomImages, networkStatus } = useFaceImages(
    roomId,
    userId,
    getFaceInfo
  );

  return (
    <>
      <div className="status">{JSON.stringify(networkStatus)}</div>
      <div>
        <div className="card">
          <img src={myImage || BLANK_IMAGE} className="photo" alt="myself" />
          <div className="name">{nickname}</div>
          <div className="mesg">
            <form>
              <input
                onChange={(e) => {
                  messageRef.current = e.target.value;
                }}
              />
            </form>
          </div>
        </div>
        {roomImages.map((item) => (
          <div
            key={item.userId}
            className="card"
            style={{ opacity: item.obsoleted ? 0.2 : 1 }}
          >
            <img src={item.image} className="photo" alt="friend" />
            <div className="name">{item.info.nickname}</div>
            <div className="mesg">{item.info.message}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SingleRoom;
