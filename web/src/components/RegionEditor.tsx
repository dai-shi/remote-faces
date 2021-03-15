import React, { useState } from "react";

import { getRoomState } from "../states/roomMap";
import { RegionData } from "../hooks/useGatherArea";

export const RegionEditor = React.memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const [regionId, setRegionId] = useState("");
  const [isMeeting, setIsMeeting] = useState(false);
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [zIndex, setZIndex] = useState(0);
  const [background, setBackground] = useState("");
  const [iframe, setIframe] = useState("");

  const addRegion = () => {
    const data: RegionData = {
      isMeeting,
      position: [left, top],
      size: [width, height],
      zIndex,
      background,
      iframe,
    };
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap("gatherRegionMap");
    map.set(regionId, data);
  };

  return (
    <div className="RegionEditor-container">
      <h3>Region Editor</h3>
      <label>
        Region ID:{" "}
        <input value={regionId} onChange={(e) => setRegionId(e.target.value)} />
      </label>
      <hr />
      <label>
        Is Meeting:{" "}
        <input
          type="checkbox"
          checked={isMeeting}
          onChange={() => setIsMeeting((p) => !p)}
        />
      </label>
      <hr />
      <label>
        Left:{" "}
        <input
          type="number"
          value={left}
          onChange={(e) => setLeft(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        Top:{" "}
        <input
          type="number"
          value={top}
          onChange={(e) => setTop(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        Width:{" "}
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        Height:{" "}
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        zIndex:{" "}
        <input
          type="number"
          value={zIndex}
          max={0}
          onChange={(e) => setZIndex(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        Background:{" "}
        <input
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </label>
      <hr />
      <label>
        Iframe:{" "}
        <input value={iframe} onChange={(e) => setIframe(e.target.value)} />
      </label>
      <hr />
      <button type="button" onClick={() => addRegion()} disabled={!regionId}>
        Add Region
      </button>
    </div>
  );
});
