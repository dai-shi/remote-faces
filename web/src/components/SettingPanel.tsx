import React, { useEffect, useState } from "react";

import "./SettingPanel.css";
import { setStringItem, getStringItem } from "../utils/storage";
import { useRoomNetworkStatus } from "../hooks/useRoom";

const initialConfigOpen = getStringItem("config_hidden") !== "true";

export const SettingPanel = React.memo<{
  roomId: string;
  userId: string;
}>(({ roomId, userId }) => {
  const [configOpen, setConfigOpen] = useState(initialConfigOpen);
  useEffect(() => {
    setStringItem("config_hidden", configOpen ? "false" : "true");
  }, [configOpen]);

  const networkStatus = useRoomNetworkStatus(roomId, userId);

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <div className="SettingPanel-container">
      <button
        type="button"
        className="SettingPanel-config-toggle"
        onClick={() => setConfigOpen((o) => !o)}
      >
        Setting{configOpen ? <>&#9660;</> : <>&#9654;</>}
      </button>
      {configOpen && (
        <div className="SettingPanel-config">
          <div className="SettingPanel-config-row">
            <span title="Share this link with your colleagues">
              Room Link:{" "}
            </span>
            <input value={window.location.href} readOnly />{" "}
            <a href={appLink} title="Open this link in the desktop app">
              Open App
            </a>
          </div>
          <div className="SettingPanel-status">
            {JSON.stringify(networkStatus)}
          </div>
        </div>
      )}
    </div>
  );
});
