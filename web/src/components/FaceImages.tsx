import React from "react";

import "./FaceImages.css";
import { Loading } from "./Loading";
import { useFaceImages } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { FaceCard } from "./FaceCard";

export const FaceImages = React.memo<{
  roomId: string;
  userId: string;
  avatar: string;
  nickname: string;
  statusMesg: string;
  suspended: boolean;
  liveMode: boolean;
  micOn: boolean;
  speakerOn: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
}>(
  ({
    roomId,
    userId,
    avatar,
    nickname,
    statusMesg,
    suspended,
    liveMode,
    micOn,
    speakerOn,
    videoDeviceId,
    audioDeviceId,
  }) => {
    const { myImage, roomImages } = useFaceImages(
      roomId,
      userId,
      avatar,
      nickname,
      statusMesg,
      suspended,
      liveMode,
      micOn,
      speakerOn,
      videoDeviceId
    );
    const { faceStream, faceStreamMap } = useFaceVideos(
      roomId,
      userId,
      liveMode,
      liveMode,
      micOn,
      videoDeviceId,
      audioDeviceId
    );
    const twoMinAgo = Date.now() - 2 * 60 * 1000;

    return (
      <div className="FaceImages-list">
        <div className="FaceImages-item">
          <FaceCard
            image={myImage}
            nickname={nickname}
            statusMesg={statusMesg}
            liveMode={liveMode}
            stream={faceStream || undefined}
            muted
            micOn={micOn}
            speakerOn={speakerOn}
          />
        </div>
        {roomImages.map((item) => (
          <div className="FaceImages-item">
            <FaceCard
              key={item.userId}
              image={item.image}
              nickname={item.info.nickname}
              statusMesg={item.info.message}
              obsoleted={item.updated < twoMinAgo}
              liveMode={item.info.liveMode}
              stream={(liveMode && faceStreamMap[item.userId]) || undefined}
              muted={!speakerOn}
              micOn={item.info.micOn}
              speakerOn={item.info.speakerOn}
            />
          </div>
        ))}
        {!roomImages.length && (
          <div className="FaceImages-item">
            <Loading />
          </div>
        )}
      </div>
    );
  }
);
