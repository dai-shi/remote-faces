import { memo } from "react";
import { useSnapshot } from "valtio";

import "./FaceList.css";
import { Loading } from "./Loading";
import { useFaceImages } from "../hooks/useFaceImages";
import { FaceCard } from "./FaceCard";
import { NG_IMAGE } from "../media/imagePresets";

// XXX temporary global state for debugging
import { getRoomState } from "../states/roomMap";

export const FaceList = memo<{
  roomId: string;
  userId: string;
  avatar: string;
  nickname: string;
  statusMesg: string;
  setStatusMesg: (mesg: string) => void;
  videoDeviceId?: string;
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
    suspended,
  }) => {
    const roomState = getRoomState(roomId, userId);
    const { userIdList } = useSnapshot(roomState);
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
    return (
      <div className="FaceList-list">
        <div className="FaceList-item">
          <FaceCard
            image={myImage}
            nickname={nickname}
            statusMesg={statusMesg}
            setStatusMesg={setStatusMesg}
            inFaceList
            muted
            micOn={false}
            speakerOn={false}
          />
        </div>
        {roomImages.map((item) => (
          <div key={item.userId} className="FaceList-item">
            <FaceCard
              image={
                userIdList.some(
                  (x) => x.userId === item.userId && x.peerIndex !== "closed"
                )
                  ? item.image
                  : NG_IMAGE
              }
              nickname={item.info.nickname}
              statusMesg={item.info.message}
              updated={item.updated}
              inFaceList
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
