import React, { Suspense, createElement, useState } from "react";

import { SuspenseFallback } from "./SuspenseFallback";
import "./SelectivePane.css";

type Name =
  | "Welcome"
  | "Screen Share"
  | "Video Share"
  | "White Board"
  | "Spatial Area"
  | "Go Board";

const components = {
  Welcome: React.lazy(() => import("./Welcome")),
  "Screen Share": React.lazy(() => import("./ScreenShare")),
  "Video Share": React.lazy(() => import("./VideoShare")),
  "White Board": React.lazy(() => import("./CollabWhiteBoard")),
  "Spatial Area": React.lazy(() => import("./SpatialArea")),
  "Go Board": React.lazy(() => import("./GoBoard")),
};

export const SelectivePane = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const [activePane, setActivePane] = useState<Name>("Welcome");
  return (
    <div className="SelectivePane-container">
      <div className="SelectivePane-select">
        &#9776;
        <select
          value={activePane}
          onChange={(e) => setActivePane(e.target.value as Name)}
        >
          {Object.keys(components).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <Suspense fallback={<SuspenseFallback />}>
        {createElement(components[activePane], {
          roomId,
          userId,
          nickname,
        })}
      </Suspense>
    </div>
  );
});
