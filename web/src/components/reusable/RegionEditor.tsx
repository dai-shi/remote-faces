import { memo, useState } from "react";

import "./RegionEditor.css";
import { getRoomState } from "../../states/roomMap";
import { RegionData } from "../../hooks/useGatherArea";

const RegionEditor = memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const roomState = getRoomState(roomId, userId);
  const [regionId, setRegionId] = useState("");
  const [type, setType] = useState<RegionData["type"]>("meeting");
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const addRegion = () => {
    const data: RegionData = {
      type,
      position: [left, top],
      size: [width, height],
    };
    roomState.gatherRegionMap[regionId] = data;
  };

  const [allRegionData, setAllRegionData] = useState<string | null>(null);

  const loadAllRegionData = () => {
    setAllRegionData(JSON.stringify(roomState.gatherRegionMap, null, 2));
  };

  const saveAllRegionData = () => {
    try {
      Object.entries(JSON.parse(allRegionData || "")).forEach(
        ([key, value]) => {
          roomState.gatherRegionMap[key] = value;
        }
      );
      setAllRegionData(null);
    } catch (e) {
      console.log("failed to save all region data", e);
    }
  };

  return (
    <div className="RegionEditor-container">
      <label>
        Region ID:{" "}
        <input value={regionId} onChange={(e) => setRegionId(e.target.value)} />
      </label>
      <label>
        Type:{" "}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as RegionData["type"])}
        >
          <option value="meeting">Meeting</option>
          <option value="chat">Chat</option>
          <option value="media">Media</option>
          <option value="goboard">Go Board</option>
        </select>
      </label>
      <br />
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
      <br />
      <button type="button" onClick={addRegion} disabled={!regionId}>
        Add Region (Or overwrite)
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
            <textarea
              value={allRegionData}
              onChange={(e) => setAllRegionData(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={saveAllRegionData}>
            Replace (Be careful)
          </button>
        </div>
      )}
    </div>
  );
});

export default RegionEditor;
