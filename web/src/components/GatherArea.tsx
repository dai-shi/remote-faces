/* eslint jsx-a11y/no-static-element-interactions: off */

import React, { Suspense, useCallback, useRef, useState } from "react";

import "./GatherArea.css";
import { useGatherArea, RegionData } from "../hooks/useGatherArea";
import { useFaceImages } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { RegionEditor } from "./RegionEditor";
import { LinkOpener } from "./LinkOpener";
import { FaceList } from "./FaceList";
import { FaceCard } from "./FaceCard";
import { SuspenseFallback } from "./SuspenseFallback";

const MomentaryChat = React.lazy(() => import("./MomentaryChat"));
const MediaShare = React.lazy(() => import("./MediaShare"));
const GoBoard = React.lazy(() => import("./GoBoard"));

type OnMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

const Region = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
  id: string;
  data: RegionData;
  highlight?: boolean;
}>(({ roomId, userId, nickname, id, data, highlight }) => {
  const boxShadow =
    (data.type === "meeting" &&
      (highlight ? "0 0 0 5px pink" : "0 0 0 1px pink")) ||
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
        zIndex: data.type !== "chat" ? data.zIndex : undefined,
        background: data.background,
        border: data.border,
      }}
    >
      {data.iframe && <iframe title={id} src={data.iframe} frameBorder="0" />}
      {data.type === "chat" && (
        <Suspense fallback={<SuspenseFallback />}>
          <MomentaryChat
            roomId={roomId}
            userId={userId}
            nickname={nickname}
            uniqueId={id}
          />
        </Suspense>
      )}
      {data.type === "media" && (
        <Suspense fallback={<SuspenseFallback />}>
          <MediaShare
            roomId={roomId}
            userId={userId}
            nickname={nickname}
            uniqueId={id}
          />
        </Suspense>
      )}
      {data.type === "goboard" && (
        <Suspense fallback={<SuspenseFallback />}>
          <GoBoard roomId={roomId} userId={userId} uniqueId={id} />
        </Suspense>
      )}
    </div>
  );
});

const Avatar = React.memo<{
  nickname: string;
  statusMesg: string;
  setStatusMesg?: (mesg: string) => void;
  image?: string;
  obsoleted?: boolean;
  position: [left: number, top: number];
  setPosition?: (nextPosition: [number, number]) => void;
  registerOnMouseDrag: (onMouseMove?: OnMouseMove) => void;
  stream?: MediaStream;
  muted?: boolean;
}>(
  ({
    nickname,
    statusMesg,
    setStatusMesg,
    image,
    obsoleted,
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
          setStatusMesg={setStatusMesg}
          obsoleted={!!obsoleted}
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
  setStatusMesg: (mesg: string) => void;
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
    setStatusMesg,
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
      const { type, position, size } = regionMap[id] as RegionData;
      return (
        type === "meeting" &&
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

    const [showModal, setShowModal] = useState<
      null | "region-editor" | "link-opener"
    >(null);

    const twoMinAgo = Date.now() - 2 * 60 * 1000;

    return (
      <div className="GatherArea-container">
        <div
          className="GatherArea-body"
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
              roomId={roomId}
              userId={userId}
              nickname={nickname}
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
                obsoleted={imageData.updated < twoMinAgo}
                position={avatarData.position}
                registerOnMouseDrag={registerOnMouseDrag}
                stream={faceStreamMap[uid]}
              />
            );
          })}
          <Avatar
            nickname={nickname}
            statusMesg={statusMesg}
            setStatusMesg={setStatusMesg}
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
        <div className="GatherArea-facelist">
          <FaceList
            roomId={roomId}
            userId={userId}
            avatar={avatar}
            nickname={nickname}
            statusMesg={statusMesg}
            setStatusMesg={setStatusMesg}
            suspended={suspended}
            videoDeviceId={videoDeviceId}
          />
        </div>
        <div className="GatherArea-toolbar">
          <div>
            <button
              type="button"
              onClick={() =>
                setShowModal(
                  showModal === "region-editor" ? null : "region-editor"
                )
              }
            >
              {showModal === "region-editor"
                ? "Close Region Editor"
                : "Open Region Editor"}
            </button>
            {showModal === "region-editor" && (
              <div className="GatherArea-region-editor">
                <RegionEditor roomId={roomId} userId={userId} />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                setShowModal(showModal === "link-opener" ? null : "link-opener")
              }
            >
              {showModal === "link-opener"
                ? "Close Link Opener"
                : "Open Link Opener"}
            </button>
            {showModal === "link-opener" && (
              <div className="GatherArea-link-opener">
                <LinkOpener roomId={roomId} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default GatherArea;
