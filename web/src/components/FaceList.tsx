import { memo } from "react";
import { useSnapshot } from "valtio";

import "./FaceList.css";
import { Loading } from "./reusable/Loading";
import { useFaceImages } from "../hooks/useFaceImages";
import { FaceCard } from "./reusable/FaceCard";
import { NG_IMAGE } from "../media/imagePresets";
import { globalState } from "../states/global";

// XXX temporary global state for debugging
import { getRoomState } from "../states/roomMap";

const setStatusMesg = (mesg: string) => {
  globalState.statusMesg = mesg;
};

export const FaceList = memo(() => {
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
});
