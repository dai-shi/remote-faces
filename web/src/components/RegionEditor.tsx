import { memo, useState } from "react";

import "./RegionEditor.css";
import { getRoomState } from "../states/roomMap";
import { RegionData, isRegionData } from "../hooks/useGatherArea";

export const RegionEditor = memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const roomState = getRoomState(roomId, userId);
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

  const updateRegion = () => {
    const found = roomState.gatherRegionList.find(
      (item): item is RegionData => isRegionData(item) && item.id === regionId
    );
    if (found) {
      found.type = type;
      found.position = [left, top];
      found.size = [width, height];
      found.zIndex = zIndex;
      found.background = background;
      found.border = border;
      found.iframe = iframe;
    } else {
      roomState.gatherRegionList.push({
        id: regionId,
        type,
        position: [left, top],
        size: [width, height],
        zIndex,
        background,
        border,
        iframe,
      });
    }
  };

  const [allRegionData, setAllRegionData] = useState<string | null>(null);

  const loadAllRegionData = () => {
    setAllRegionData(JSON.stringify(roomState.gatherRegionList));
  };

  const saveAllRegionData = () => {
    try {
      const newRegionList = JSON.parse(allRegionData || "");
      if (Array.isArray(newRegionList) && newRegionList.every(isRegionData)) {
        roomState.gatherRegionList.splice(0, -1);
        roomState.gatherRegionList.push(...newRegionList);
      }
      setAllRegionData(null);
    } catch (e) {
      console.log("failed to save all region data", e);
    }
  };

  const existingRegionIds = roomState.gatherRegionList
    .filter((item): item is RegionData => isRegionData(item))
    .map((item) => item.id);
  const loadRegionData = (id: string) => {
    setRegionId(id);
    if (!id) return;
    const found = roomState.gatherRegionList.find(
      (item): item is RegionData => isRegionData(item) && item.id === regionId
    );
    if (found) {
      setType(found.type);
      setLeft(found.position[0]);
      setTop(found.position[1]);
      setWidth(found.size[0]);
      setHeight(found.size[1]);
      setZIndex(found.zIndex ?? 0);
      setBackground(found.background ?? "");
      setBorder(found.border ?? "");
      setIframe(found.iframe ?? "");
    }
  };

  return (
    <div className="RegionEditor-container">
      <h3>Region Editor</h3>
      <label>
        Region ID:{" "}
        <input value={regionId} onChange={(e) => setRegionId(e.target.value)} />
      </label>
      <select
        onChange={(e) => {
          loadRegionData(e.target.value);
        }}
      >
        <option value="">(Select to load existing region)</option>
        {existingRegionIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
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
          <option value="goboard">Go Board</option>
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
      <button type="button" onClick={() => updateRegion()} disabled={!regionId}>
        Add/Update Region
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
