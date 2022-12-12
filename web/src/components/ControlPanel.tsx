import { memo, useState } from "react";

import "./ControlPanel.css";
import { globalState } from "../states/global";

export const ControlPanel = memo(() => {
  const [pos, setPos] = useState([40, 5] as const);
  // TODO

  return (
    <div
      className="ControlPanel-container"
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`,
      }}
    >
      <h1>TODO</h1>
      <h2>{globalState.config.nickname}</h2>
    </div>
  );
});
