/* eslint jsx-a11y/no-static-element-interactions: off */

import {
  ClipboardEvent,
  DragEvent,
  Suspense,
  lazy,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { useSnapshot } from "valtio";

import "./GatherArea.css";
import { globalState } from "../states/global";
import {
  useGatherArea,
  RegionData,
  RegionMap,
  AvatarData,
} from "../hooks/useGatherArea";
import { useFaceImages, useFaceImageObsoleted } from "../hooks/useFaceImages";
import { useFaceVideos } from "../hooks/useFaceVideos";
import { ControlPanel } from "./ControlPanel";
import { FaceCard } from "./reusable/FaceCard";
import { SuspenseFallback } from "./reusable/SuspenseFallback";
import { rand4 } from "../utils/crypto";
import { encodeBase64Async } from "../utils/base64";

const FaceList = lazy(() => import("./FaceList"));
const MomentaryChat = lazy(() => import("./reusable/MomentaryChat"));
const MediaShare = lazy(() => import("./reusable/MediaShare"));
const MeetingScreen = lazy(() => import("./reusable/MeetingScreen"));
const GoBoard = lazy(() => import("./reusable/GoBoard"));
const TalkyStarter = lazy(() => import("./reusable/TalkyStarter"));

type OnMouseMove = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | "ended"
) => void;

const getActiveMeetingRegionId = (avatar: AvatarData, regionMap: RegionMap) => {
  const regionIdList = Object.keys(regionMap).sort(
    (a, b) => (regionMap[b].zIndex ?? 0) - (regionMap[a].zIndex ?? 0)
  );
  const activeId = regionIdList.find((id) => {
    const { type, position, size } = regionMap[id] as RegionData;
    return (
      type === "meeting" &&
      position[0] <= avatar.position[0] + 36 &&
      position[1] <= avatar.position[1] + 36 &&
      avatar.position[0] <= position[0] + size[0] &&
      avatar.position[1] <= position[1] + size[1]
    );
  });
  return activeId;
};

const getMicOn = (avatar: AvatarData, regionMap: RegionMap, id?: string) => {
  if (!id) return undefined;
  const { position, size } = regionMap[id];
  const micOn =
    position[0] <= avatar.position[0] &&
    position[1] <= avatar.position[1] &&
    avatar.position[0] + 36 <= position[0] + size[0] &&
    avatar.position[1] + 36 <= position[1] + size[1];
  return micOn;
};

const Region = memo<{
  roomId: string;
  userId: string;
  nickname: string;
  id: string;
  data: RegionData;
  highlight?: "meeting" | "active-meeting" | "micon-meeting";
  updateRegion: (regionId: string, data: RegionData | null) => void;
  registerOnMouseDrag: (onMouseMove?: OnMouseMove) => void;
  isSelected: boolean;
  setSelectedRegionId: (regionId: string) => void;
  activeMeetingRegionId: string | undefined;
}>(
  ({
    roomId,
    userId,
    nickname,
    id,
    data,
    highlight,
    updateRegion,
    registerOnMouseDrag,
    isSelected,
    setSelectedRegionId,
    activeMeetingRegionId,
  }) => {
    let boxShadow: string | undefined;
    if (isSelected) {
      boxShadow = "0 0 0 2px rgb(128, 128, 128, 0.9)";
    }
    if (highlight === "micon-meeting") {
      boxShadow = "0 0 0 5px rgba(255, 0, 0, 0.6)";
    } else if (highlight === "active-meeting") {
      boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.3)";
    } else if (highlight === "meeting") {
      boxShadow = "0 0 0 1px rgba(255, 0, 0, 0.3)";
    }
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
        onMouseDown={(e) => {
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            setSelectedRegionId(id);
            return;
          }
          if (!data.movable) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          const target = e.currentTarget;
          const offset = [
            e.clientX - parseInt(target.style.left, 10),
            e.clientY - parseInt(target.style.top, 10),
          ];
          registerOnMouseDrag((e) => {
            if (e === "ended") {
              return;
            }
            const left = e.clientX - offset[0];
            const top = e.clientY - offset[1];
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
            updateRegion(id, { ...data, position: [left, top] });
          });
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
        {data.type === "screen" && (
          <Suspense fallback={<SuspenseFallback />}>
            <MeetingScreen
              roomId={roomId}
              userId={userId}
              nickname={nickname}
              uniqueId={id}
              isActive={
                !!activeMeetingRegionId &&
                activeMeetingRegionId === data.meetingRegionId
              }
            />
          </Suspense>
        )}
        {data.type === "goboard" && (
          <Suspense fallback={<SuspenseFallback />}>
            <GoBoard roomId={roomId} userId={userId} uniqueId={id} />
          </Suspense>
        )}
        {data.type === "talky" && (
          <Suspense fallback={<SuspenseFallback />}>
            <TalkyStarter roomId={roomId} uniqueId={id} />
          </Suspense>
        )}
        {isSelected && (
          <div
            className="GatherArea-region-delete"
            title="Delete"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const ok = window.confirm("Are you sure to delete it?");
              if (ok) {
                updateRegion(id, null);
              }
            }}
          >
            &#x274C;
          </div>
        )}
        {isSelected && (
          <div
            className="GatherArea-region-copy"
            title="Copy"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const target = (e.target as any).parentNode.parentNode;
              const left = target.scrollLeft + e.clientX - data.size[0] / 2;
              const top = target.scrollTop + e.clientY - data.size[1] / 2;
              updateRegion(`${id}_${rand4()}`, {
                ...data,
                position: [left, top],
              });
            }}
          >
            &#x267B;
          </div>
        )}
        {isSelected && (
          <div
            className="GatherArea-region-move"
            title="Move"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const target = e.currentTarget.parentNode as HTMLDivElement;
              const offset = [
                e.clientX - parseInt(target.style.left, 10),
                e.clientY - parseInt(target.style.top, 10),
              ];
              registerOnMouseDrag((e) => {
                if (e === "ended") {
                  return;
                }
                const left = e.clientX - offset[0];
                const top = e.clientY - offset[1];
                target.style.left = `${left}px`;
                target.style.top = `${top}px`;
                updateRegion(id, { ...data, position: [left, top] });
              });
            }}
          >
            &#x271B;
          </div>
        )}
        {isSelected && (
          <div
            className="GatherArea-region-resize"
            title="Resize"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const target = e.currentTarget.parentNode as HTMLDivElement;
              const offset = [
                e.clientX - parseInt(target.style.width, 10),
                e.clientY - parseInt(target.style.height, 10),
              ];
              registerOnMouseDrag((e) => {
                if (e === "ended") {
                  return;
                }
                const width = e.clientX - offset[0];
                const height = e.clientY - offset[1];
                if (width < 1 || height < 1) {
                  return;
                }
                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
                updateRegion(id, { ...data, size: [width, height] });
              });
            }}
          >
            &#x2198;
          </div>
        )}
      </div>
    );
  }
);

const Avatar = memo<{
  nickname: string;
  statusMesg: string;
  image?: string;
  updated?: number; // in milliseconds
  position: [left: number, top: number];
  setPosition?: (nextPosition: [number, number]) => void;
  registerOnMouseDrag: (onMouseMove?: OnMouseMove) => void;
  stream?: MediaStream;
  liveMode: boolean;
  muted?: boolean;
  micOn?: boolean;
}>(
  ({
    nickname,
    statusMesg,
    image,
    updated,
    position,
    setPosition,
    registerOnMouseDrag,
    stream,
    liveMode,
    muted,
    micOn,
  }) => {
    const obsoleted = useFaceImageObsoleted(updated);
    return (
      <div
        className="GatherArea-avatar"
        style={{
          left: `${position[0]}px`,
          top: `${position[1]}px`,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (setPosition) {
            const target = e.currentTarget;
            const offset = [
              e.clientX - parseInt(target.style.left, 10),
              e.clientY - parseInt(target.style.top, 10),
            ];
            registerOnMouseDrag((e) => {
              if (e === "ended") {
                return;
              }
              const left = e.clientX - offset[0];
              const top = e.clientY - offset[1];
              target.style.left = `${left}px`;
              target.style.top = `${top}px`;
              setPosition([left, top]);
            });
          }
        }}
      >
        {statusMesg && (
          <div
            className="GatherArea-avatar-balloon"
            style={{ opacity: obsoleted ? 0.2 : 1 }}
          >
            {statusMesg}
          </div>
        )}
        <FaceCard
          image={image}
          nickname={nickname}
          statusMesg={statusMesg}
          updated={updated}
          liveMode={liveMode}
          stream={stream}
          muted={!!muted}
          micOn={!!micOn}
          speakerOn={liveMode}
        />
      </div>
    );
  }
);

export const GatherArea = memo(() => {
  const {
    roomId,
    userId,
    statusMesg,
    config: { avatar, nickname, takePhoto, videoDeviceId, audioDeviceId },
    preference: { photoSize, hideFaceList },
  } = useSnapshot(globalState);
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
  const { avatarMap, myAvatar, setMyAvatar, regionMap, updateRegion } =
    useGatherArea(roomId, userId);

  const [selectedRegionId, setSelectedRegionId] = useState<string>();

  const onMouseDragRef = useRef<OnMouseMove>();
  const registerOnMouseDrag = useCallback((onMouseMove?: OnMouseMove) => {
    if (onMouseDragRef.current) {
      onMouseDragRef.current("ended");
    }
    onMouseDragRef.current = onMouseMove;
  }, []);

  const activeMeetingRegionId = getActiveMeetingRegionId(myAvatar, regionMap);
  const activeMeetingMicOn = getMicOn(
    myAvatar,
    regionMap,
    activeMeetingRegionId
  );

  const { faceStream, faceStreamMap } = useFaceVideos(
    roomId,
    userId,
    !!activeMeetingRegionId,
    !!activeMeetingRegionId,
    !!activeMeetingMicOn,
    videoDeviceId,
    audioDeviceId,
    `gatherArea/meeting/${activeMeetingRegionId}/`
  );

  const handlePasteOrDrop = async (e: ClipboardEvent | DragEvent) => {
    e.preventDefault();
    const dataTransfer =
      "clipboardData" in e ? e.clipboardData : e.dataTransfer;
    const text = dataTransfer.getData("text");
    const target = e.currentTarget || (e.target as HTMLDivElement);
    const clientX = "clientX" in e ? e.clientX : target.clientWidth / 2;
    const clientY = "clientY" in e ? e.clientY : target.clientHeight / 2;
    if (/^http.*\.(png|jpg|jpeg|gif|svg)$/.test(text)) {
      const width = 36;
      const height = 36;
      updateRegion(`img${rand4()}`, {
        type: "default",
        position: [
          target.scrollLeft + clientX - width / 2,
          target.scrollTop + clientY - height / 2,
        ],
        size: [width, height],
        background: `url(${text}) center center / contain no-repeat`,
        movable: true,
      });
    } else if (/^https:\/\/www.youtube.com\//.test(text)) {
      const match = /([-0-9a-zA-Z]+)$/.exec(text);
      if (!match) {
        window.alert(`Invalid YouTube URL: ${text}`);
        return;
      }
      const width = 160;
      const height = 120;
      updateRegion(`mov${rand4()}`, {
        type: "default",
        position: [
          target.scrollLeft + clientX - width / 2,
          target.scrollTop + clientY - height / 2,
        ],
        size: [width, height],
        iframe: `https://www.youtube.com/embed/${match[1]}`,
        border: "5px solid #F0F0F020",
      });
    } else if (text) {
      const html = await encodeBase64Async(
        new TextEncoder().encode(`
            <!DOCTYPE html><html>
            <head>
              <meta charset="utf-8"/>
              <style>
                html, body {
                  margin: 0; padding: 0;
                  font: 0.5em -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                }
              </style>
            </head>
            <body>${text}</body>
            </html>`)
      );
      const width = 80;
      const height = 15;
      updateRegion(`text${rand4()}`, {
        type: "default",
        position: [
          target.scrollLeft + clientX - width / 2,
          target.scrollTop + clientY - height / 2,
        ],
        size: [width, height],
        iframe: `data:text/html;base64,${html}`,
        border: "5px solid #F0F0F040",
        movable: true,
      });
    } else {
      window.alert("Unsupported object pasted or dropped");
    }
  };

  return (
    <div className="GatherArea-container">
      <div
        className="GatherArea-body"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handlePasteOrDrop}
        onPaste={handlePasteOrDrop}
        onMouseDown={() => {
          setSelectedRegionId(undefined);
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
            roomId={roomId}
            userId={userId}
            nickname={nickname}
            id={regionId}
            data={regionData}
            highlight={
              (regionId === activeMeetingRegionId &&
                (activeMeetingMicOn ? "micon-meeting" : "active-meeting")) ||
              (regionData.type === "meeting" ? "meeting" : undefined)
            }
            updateRegion={updateRegion}
            registerOnMouseDrag={registerOnMouseDrag}
            isSelected={selectedRegionId === regionId}
            setSelectedRegionId={setSelectedRegionId}
            activeMeetingRegionId={activeMeetingRegionId}
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
              updated={imageData.updated}
              position={avatarData.position}
              registerOnMouseDrag={registerOnMouseDrag}
              stream={faceStreamMap[uid]}
              liveMode={!!activeMeetingRegionId}
              micOn={getMicOn(avatarData, regionMap, activeMeetingRegionId)}
            />
          );
        })}
        <Avatar
          nickname={nickname}
          statusMesg={statusMesg}
          image={myImage}
          position={myAvatar.position}
          setPosition={useCallback(
            (position: [number, number]) =>
              setMyAvatar((prev) => ({ ...prev, position })),
            [setMyAvatar]
          )}
          registerOnMouseDrag={registerOnMouseDrag}
          stream={faceStream || undefined}
          liveMode={!!activeMeetingRegionId}
          muted
          micOn={activeMeetingMicOn}
        />
      </div>
      {!hideFaceList && (
        <div className="GatherArea-facelist">
          <Suspense fallback={<SuspenseFallback />}>
            <FaceList />
          </Suspense>
        </div>
      )}
      <div className="GatherArea-controlpanel">
        <ControlPanel />
      </div>
    </div>
  );
});

export default GatherArea;
