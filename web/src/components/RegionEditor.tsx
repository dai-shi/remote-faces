import React, { useState } from "react";

import "./RegionEditor.css";
import { getRoomState } from "../states/roomMap";
import { ROOM_STATE_KEY, RegionData } from "../hooks/useGatherArea";

export const RegionEditor = React.memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const [regionId, setRegionId] = useState("");
  const [type, setType] = useState<RegionData["type"]>("background");
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [zIndex, setZIndex] = useState(0);
  const [background, setBackground] = useState("");
  const [border, setBorder] = useState("");
  const [iframe, setIframe] = useState("");

  const addRegion = () => {
    const data: RegionData = {
      type,
      position: [left, top],
      size: [width, height],
      zIndex,
      background,
      border,
      iframe,
    };
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap(ROOM_STATE_KEY);
    map.set(regionId, data);
  };

  const [allRegionData, setAllRegionData] = useState<string | null>(null);

  const loadAllRegionData = () => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap(ROOM_STATE_KEY);
    setAllRegionData(JSON.stringify(map.toJSON()));
  };

  const saveAllRegionData = () => {
    const roomState = getRoomState(roomId, userId);
    const map = roomState.ydoc.getMap(ROOM_STATE_KEY);
    try {
      Object.entries(JSON.parse(allRegionData || "")).forEach(
        ([key, value]) => {
          map.set(key, value);
        }
      );
      setAllRegionData(null);
    } catch (e) {
      console.log("failed to save all region data", e);
    }
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
        Type:{" "}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as RegionData["type"])}
        >
          <option value="background">Background</option>
          <option value="meeting">Meeting</option>
          <option value="chat">Chat</option>
          <option value="media">Media</option>
        </select>
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
      <label>
        Height:{" "}
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </label>
      <hr />
      {type !== "chat" && (
        <label>
          zIndex:{" "}
          <input
            type="number"
            value={zIndex}
            max={0}
            onChange={(e) => setZIndex(Number(e.target.value))}
          />
        </label>
      )}
      <hr />
      <label>
        Background:{" "}
        <input
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </label>
      <label>
        Border:{" "}
        <input value={border} onChange={(e) => setBorder(e.target.value)} />
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
      <hr />
      <button
        type="button"
        className="RegionEditor-toggle"
        onClick={() => {
          if (allRegionData) {
            setAllRegionData(null);
          } else {
            loadAllRegionData();
          }
        }}
      >
        Import/Export {allRegionData ? <>&#9660;</> : <>&#9654;</>}
      </button>
      {!!allRegionData && (
        <div>
          <label>
            All Region Data:{" "}
            <textarea
              value={allRegionData}
              onChange={(e) => setAllRegionData(e.target.value)}
            />
          </label>
          <button type="button" onClick={saveAllRegionData}>
            Replace (Be careful)
          </button>
        </div>
      )}
    </div>
  );
});
