import React, { Suspense, createElement, useState } from "react";

import { SuspenseFallback } from "./SuspenseFallback";
import "./SelectivePane.css";

const components = {
  Welcome: React.lazy(() => import("./Welcome")),
  "Momentary Chat": React.lazy(() => import("./MomentaryChat")),
  "Gather Area": React.lazy(() => import("./GatherArea")),
  "Spatial Area": React.lazy(() => import("./SpatialArea")),
  "Screen Share": React.lazy(() => import("./ScreenShare")),
  "White Board": React.lazy(() => import("./CollabWhiteBoard")),
  "Video Share": React.lazy(() => import("./VideoShare")),
  "Go Board": React.lazy(() => import("./GoBoard")),
};

export const SelectivePane = React.memo<{
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
    const [activePane, setActivePane] = useState<string[]>([
      "Welcome",
      "Momentary Chat",
    ]);
    const togglePane = (name: string) => {
      setActivePane((prev) => {
        if (prev.includes(name)) {
          return prev.filter((item) => item !== name);
        }
        return [...prev, name];
      });
    };
    return (
      <div className="SelectivePane-container">
        <div className="SelectivePane-select">
          &#9776;
          <select
            multiple
            size={Object.keys(components).length}
            value={activePane}
            onChange={(e) => togglePane(e.target.value)}
          >
            {Object.keys(components).map((name) => {
              const idx = activePane.indexOf(name);
              if (idx >= 0) {
                return (
                  <option key={name} value={name}>
                    {`[${idx + 1}] ${name}`}
                  </option>
                );
              }
              return (
                <option key={name} value={name}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="SelectivePane-body">
          {activePane.map((name) => (
            <Suspense key={name} fallback={<SuspenseFallback />}>
              {createElement(components[name as keyof typeof components], {
                roomId,
                userId,
                avatar,
                nickname,
                statusMesg,
                setStatusMesg,
                suspended,
                videoDeviceId,
                audioDeviceId,
                uniqueId: undefined,
              })}
            </Suspense>
          ))}
        </div>
      </div>
    );
  }
);
