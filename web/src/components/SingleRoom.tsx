import React, { useEffect, useState } from "react";

import "./SingleRoom.css";
import { setRoomIdToUrl } from "../utils/url";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";
import { useVideoDevices } from "../hooks/useVideoDevices";
import FaceImages from "./FaceImages";
import MomentaryChat from "./MomentaryChat";

type Props = {
  roomId: string;
  userId: string;
};

const initialNickname = getStringItem("nickname");

const SingleRoom: React.FC<Props> = ({ roomId, userId }) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [statusMesg, setStatusMesg] = useState("");
  useEffect(() => {
    setRoomIdToUrl(roomId);
  }, [roomId]);

  const [liveMode, setLiveMode] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const [configOpen, setConfigOpen] = useState<boolean>(true);
  const videoDevices = useVideoDevices();

  const networkStatus = useRoomNetworkStatus(roomId);

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <>
      <div className="SingleRoom-status">{JSON.stringify(networkStatus)}</div>
      <div className="SingleRoom-room-info">
        {configOpen ? (
          <>
            <button type="button" onClick={() => setConfigOpen(false)}>
              Hide config
            </button>
            <div>
              Link to this room:
              <input value={window.location.href} readOnly />
              (Share this link with your colleagues)
              <a href={appLink}>Open App</a>
            </div>
            <div className="SingleRoom-nickname">
              Your Name:{" "}
              <input
                defaultValue={initialNickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setStringItem("nickname", e.target.value);
                }}
              />
            </div>
            <div className="SingleRoom-statusmesg">
              Your Status:{" "}
              <input
                onChange={(e) => {
                  setStatusMesg(e.target.value);
                }}
                placeholder="Enter status message"
              />
            </div>
            <div>
              Select Camera:{" "}
              <select onChange={(e) => setDeviceId(e.target.value)}>
                {videoDevices.map((videoDevice) => (
                  <option
                    key={videoDevice.deviceId}
                    value={videoDevice.deviceId}
                  >
                    {videoDevice.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {/* FIXME I don't know why this rule complains */
              /* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>
                Live Mode:{" "}
                <input
                  type="checkbox"
                  checked={liveMode}
                  onChange={(e) => setLiveMode(e.target.checked)}
                />
              </label>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setConfigOpen(true)}>
            Show config
          </button>
        )}
      </div>
      <FaceImages
        roomId={roomId}
        userId={userId}
        deviceId={deviceId}
        nickname={nickname}
        statusMesg={statusMesg}
        liveMode={liveMode}
      />
      <MomentaryChat roomId={roomId} userId={userId} nickname={nickname} />
    </>
  );
};

export default SingleRoom;
