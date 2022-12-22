import { memo } from "react";
import { useSnapshot } from "valtio";

import "./MemberList.css";
import { Loading } from "./reusable/Loading";
import { useFaceImages } from "../hooks/useFaceImages";
import { FaceCard } from "./reusable/FaceCard";
import { NG_IMAGE } from "../media/imagePresets";
import { globalState } from "../states/global";

// XXX temporary global state for debugging
import { getRoomState } from "../states/roomMap";

const MemberList = memo(() => {
  const {
    roomId,
    userId,
    statusMesg,
    config: { avatar, nickname, takePhoto, videoDeviceId },
    preference: { photoSize },
  } = useSnapshot(globalState);
  const roomState = getRoomState(roomId, userId);
  const { userIdList } = useSnapshot(roomState);
  const { myImage, roomImages } = useFaceImages(
    roomId,
    userId,
    avatar,
    nickname,
    statusMesg,
    !takePhoto,
    false,
    false,
    false,
    videoDeviceId,
    photoSize
  );
  return (
    <div className="MemberList-container">
      <div className="MemberList-item">
        <div className="MemberList-face">
          <FaceCard
            image={myImage}
            nickname=""
            statusMesg=""
            muted
            micOn={false}
            speakerOn={false}
          />
        </div>
        <div className="MemberList-name">{nickname}</div>
        <div className="MemberList-item">{statusMesg}</div>
      </div>
      {roomImages.map((item) => (
        <div key={item.userId} className="MemberList-item">
          <div className="MemberList-face">
            <FaceCard
              image={
                userIdList.some(
                  (x) => x.userId === item.userId && x.peerIndex !== "closed"
                )
                  ? item.image
                  : NG_IMAGE
              }
              nickname=""
              statusMesg=""
              updated={item.updated}
              muted
              micOn={false}
              speakerOn={false}
            />
          </div>
          <div className="MemberList-name">{item.info.nickname}</div>
          <div className="MemberList-item">{item.info.message}</div>
        </div>
      ))}
      {!roomImages.length && (
        <div className="MemberList-item">
          <Loading />
        </div>
      )}
    </div>
  );
});

export default MemberList;
