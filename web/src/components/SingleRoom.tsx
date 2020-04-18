import React, { useCallback, useEffect, useRef, useState } from "react";

import { setRoomIdToUrl } from "../utils/url";
import { setStringItem, getStringItem } from "../utils/storage";
import { useFaceImages } from "../hooks/useFaceImages";
import { useVideoDevices } from "../hooks/useVideoDevices";
import "./SingleRoom.css";

const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";

type Props = {
  roomId: string;
  userId: string;
};

const initialNickname = getStringItem("nickname");

const SingleRoom: React.FC<Props> = ({ roomId, userId }) => {
  const nicknameRef = useRef(initialNickname);
  const messageRef = useRef("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const [deviceId, setDeviceId] = useState<string>();
  const [configOpen, setConfigOpen] = useState<boolean>(true);
  const videoDevices = useVideoDevices();

  const getFaceInfo = useCallback(
    () => ({
      nickname: nicknameRef.current,
      message: messageRef.current,
    }),
    []
  );
  const { myImage, roomImages, networkStatus } = useFaceImages(
    roomId,
    userId,
    getFaceInfo,
    deviceId
  );

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <>
      <div className="SingleRoom-status">{JSON.stringify(networkStatus)}</div>
      {configOpen ? (
        <div className="SingleRoom-room-info">
          <button type="button" onClick={() => setConfigOpen(false)}>
            Hide config
          </button>
          <div>
            Link to this room:
            <input value={window.location.href} readOnly />
            (Share this link with your colleagues)
            <a href={appLink}>Open App</a>
          </div>
          <div>
            Your Name:{" "}
            <input
              defaultValue={initialNickname}
              onChange={(e) => {
                nicknameRef.current = e.target.value;
                setStringItem("nickname", nicknameRef.current);
              }}
            />
          </div>
          <div>
            Select Camera:{" "}
            <select onChange={(e) => setDeviceId(e.target.value)}>
              {videoDevices.map((videoDevice) => (
                <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                  {videoDevice.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfigOpen(true)}>
          Show config
        </button>
      )}
      <div>
        <div className="SingleRoom-card">
          <img
            src={myImage || BLANK_IMAGE}
            className="SingleRoom-photo"
            alt="myself"
          />
          <div className="SingleRoom-name">{nicknameRef.current}</div>
          <div className="SingleRoom-mesg">
            <form>
              <input
                onChange={(e) => {
                  messageRef.current = e.target.value;
                }}
                placeholder="Enter message."
              />
            </form>
          </div>
        </div>
        {roomImages.map((item) => (
          <div
            key={item.userId}
            className="SingleRoom-card"
            style={{ opacity: item.obsoleted ? 0.2 : 1 }}
          >
            <img src={item.image} className="SingleRoom-photo" alt="friend" />
            <div className="SingleRoom-name">{item.info.nickname}</div>
            <div className="SingleRoom-mesg">{item.info.message}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SingleRoom;
