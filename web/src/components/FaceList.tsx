import React from "react";
import { useSnapshot } from "valtio";

import "./FaceList.css";
import { Loading } from "./Loading";
import { useFaceImages } from "../hooks/useFaceImages";
import { FaceCard } from "./FaceCard";
import { NG_IMAGE } from "../media/imagePresets";

// XXX temporary global state for debugging
import { getRoomState } from "../states/roomMap";

export const FaceList = React.memo<{
  roomId: string;
  userId: string;
  avatar: string;
  nickname: string;
  statusMesg: string;
  setStatusMesg: (mesg: string) => void;
  videoDeviceId?: string;
  toggleSuspended: () => void;
  suspended: boolean;
}>(
  ({
    roomId,
    userId,
    avatar,
    nickname,
    statusMesg,
    setStatusMesg,
    videoDeviceId,
    toggleSuspended,
    suspended,
  }) => {
    const userIdMap = useSnapshot(getRoomState(roomId, userId).userIdMap);
    const { myImage, roomImages } = useFaceImages(
      roomId,
      userId,
      avatar,
      nickname,
      statusMesg,
      suspended,
      false,
      false,
      false,
      videoDeviceId
    );
    const twoMinAgo = Date.now() - 2 * 60 * 1000;

    return (
      <div className="FaceList-list">
        <div className="FaceList-item">
          <FaceCard
            image={myImage}
            nickname={nickname}
            statusMesg={statusMesg}
            setStatusMesg={setStatusMesg}
            liveMode={false}
            muted
            micOn={false}
            speakerOn={false}
            toggleSuspended={toggleSuspended}
            suspended={suspended}
          />
        </div>
        {roomImages.map((item) => (
          <div key={item.userId} className="FaceList-item">
            <FaceCard
              image={
                typeof userIdMap[item.userId] === "number"
                  ? item.image
                  : NG_IMAGE
              }
              nickname={item.info.nickname}
              statusMesg={item.info.message}
              obsoleted={item.updated < twoMinAgo}
              liveMode={false}
              muted
              micOn={false}
              speakerOn={false}
            />
          </div>
        ))}
        {!roomImages.length && (
          <div className="FaceList-item">
            <Loading />
          </div>
        )}
      </div>
    );
  }
);
