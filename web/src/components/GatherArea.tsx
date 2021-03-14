import React, { useCallback, useRef, useState } from "react";

import "./GatherArea.css";
import { useGatherArea, RegionData } from "../hooks/useGatherArea";
import { useFaceImages } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { RegionEditor } from "./RegionEditor";
import { FaceCard } from "./FaceCard";

type OnMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

const Region = React.memo<{
  id: string;
  data: RegionData;
  highlight?: boolean;
}>(({ id, data, highlight }) => {
  const boxShadow =
    (data.isMeeting && (highlight ? "0 0 0 5px pink" : "0 0 0 1px pink")) ||
    undefined;
  return (
    <div
      className="GatherArea-region"
      style={{
        left: `${data.position[0]}px`,
        top: `${data.position[1]}px`,
        width: `${data.size[0]}px`,
        height: `${data.size[1]}px`,
        boxShadow,
        zIndex: data.zIndex,
        background: data.background,
      }}
    >
      {data.iframe && <iframe title={id} src={data.iframe} />}
    </div>
  );
});

const Avatar = React.memo<{
  nickname: string;
  statusMesg: string;
  image?: string;
  position: [left: number, top: number];
  setPosition?: (nextPosition: [number, number]) => void;
  registerOnMouseDrag: (onMouseMove?: OnMouseMove) => void;
  stream?: MediaStream;
  muted?: boolean;
}>(
  ({
    nickname,
    statusMesg,
    image,
    position,
    setPosition,
    registerOnMouseDrag,
    stream,
    muted,
  }) => {
    const isMyself = !!setPosition;
    return (
      <div
        className="GatherArea-avatar"
        style={{
          left: `${position[0]}px`,
          top: `${position[1]}px`,
        }}
        role="button"
        tabIndex={-1}
        onMouseDown={(e) => {
          e.preventDefault();
          if (isMyself) {
            const target = e.currentTarget;
            const offset = [e.clientX - position[0], e.clientY - position[1]];
            registerOnMouseDrag((e) => {
              const left = e.clientX - offset[0];
              const top = e.clientY - offset[1];
              target.style.left = `${left}px`;
              target.style.top = `${top}px`;
              setPosition?.([left, top]);
            });
          }
        }}
      >
        <FaceCard
          image={image}
          nickname={nickname}
          statusMesg={statusMesg}
          obsoleted={false}
          liveMode={!!stream}
          stream={stream}
          muted={!!muted}
          micOn={!!stream}
          speakerOn={!!stream}
        />
      </div>
    );
  }
);

export const GatherArea = React.memo<{
  roomId: string;
  userId: string;
  avatar: string;
  nickname: string;
  statusMesg: string;
  suspended: boolean;
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
      false,
      false,
      false,
      videoDeviceId
    );
    const { avatarMap, myAvatar, setMyAvatar, regionMap } = useGatherArea(
      roomId,
      userId
    );

    const onMouseDragRef = useRef<OnMouseMove>();
    const registerOnMouseDrag = useCallback((onMouseMove?: OnMouseMove) => {
      onMouseDragRef.current = onMouseMove;
    }, []);

    const regionIdList = Object.keys(regionMap).sort(
      (a, b) => (regionMap[b].zIndex ?? 0) - (regionMap[a].zIndex ?? 0)
    );
    const activeMeetingRegionId = regionIdList.find((id) => {
      const { isMeeting, position, size } = regionMap[id] as RegionData;
      return (
        isMeeting &&
        position[0] <= myAvatar.position[0] &&
        position[1] <= myAvatar.position[1] &&
        myAvatar.position[0] + 36 <= position[0] + size[0] &&
        myAvatar.position[1] + 36 <= position[1] + size[1]
      );
    });

    const { faceStream, faceStreamMap } = useFaceVideos(
      roomId,
      userId,
      !!activeMeetingRegionId,
      !!activeMeetingRegionId,
      true,
      videoDeviceId,
      audioDeviceId,
      `gatherArea/meeting/${activeMeetingRegionId}/`
    );

    const [showRegionEditor, setShowRegionEditor] = useState(false);

    return (
      <div className="GatherArea-container">
        <div
          className="GatherArea-body"
          role="button"
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseMove={(e) => {
            if (onMouseDragRef.current) {
              onMouseDragRef.current(e);
            }
          }}
          onMouseUp={() => {
            registerOnMouseDrag();
          }}
        >
          {Object.entries(regionMap).map(([regionId, regionData]) => (
            <Region
              key={regionId}
              id={regionId}
              data={regionData}
              highlight={regionId === activeMeetingRegionId}
            />
          ))}
          {Object.entries(avatarMap).map(([uid, avatarData]) => {
            if (uid === userId) {
              return null;
            }
            const imageData = roomImages.find((data) => data.userId === uid);
            if (!imageData) {
              return null;
            }
            return (
              <Avatar
                key={uid}
                nickname={imageData.info.nickname}
                statusMesg={imageData.info.message}
                image={imageData.image}
                position={avatarData.position}
                registerOnMouseDrag={registerOnMouseDrag}
                stream={faceStreamMap[uid]}
              />
            );
          })}
          <Avatar
            nickname={nickname}
            statusMesg={statusMesg}
            image={myImage}
            position={myAvatar.position}
            setPosition={(position) =>
              setMyAvatar((prev) => ({ ...prev, position }))
            }
            registerOnMouseDrag={registerOnMouseDrag}
            stream={faceStream || undefined}
            muted
          />
        </div>
        <div className="GatherArea-toolbar">
          <div>
            <button
              type="button"
              onClick={() => setShowRegionEditor((p) => !p)}
            >
              {showRegionEditor ? "Close Region Editor" : "Open Region Editor"}
            </button>
            {showRegionEditor && (
              <div className="GatherArea-region-editor">
                <RegionEditor roomId={roomId} userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default GatherArea;
