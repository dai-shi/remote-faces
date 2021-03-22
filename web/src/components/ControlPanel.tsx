import React, { Dispatch, SetStateAction } from "react";

import "./ControlPanel.css";

export const ControlPanel = React.memo<{
  suspended: boolean;
  toggleSuspended: () => void;
  liveMode: boolean;
  setLiveMode: Dispatch<SetStateAction<boolean>>;
  micOn: boolean;
  setMicOn: Dispatch<SetStateAction<boolean>>;
  speakerOn: boolean;
  setSpeakerOn: Dispatch<SetStateAction<boolean>>;
  secondColumnOpen: boolean;
  setSecondColumnOpen: Dispatch<SetStateAction<boolean>>;
}>(
  ({
    suspended,
    toggleSuspended,
    liveMode,
    setLiveMode,
    setMicOn,
    setSpeakerOn,
    secondColumnOpen,
    setSecondColumnOpen,
  }) => (
    <div className="ControlPanel-container">
      <button
        type="button"
        onClick={toggleSuspended}
        title={suspended ? "Enable Camera" : "Disable Camera"}
      >
        &#x1F4F7;
        {suspended && <span className="ControlPanel-disabled">&#10060;</span>}
      </button>
      <button
        type="button"
        onClick={() => setSecondColumnOpen((x) => !x)}
        title={secondColumnOpen ? "Close Right Pane" : "Open Right Pane"}
      >
        {secondColumnOpen ? <>&#9664;</> : <>&#9654;</>}
      </button>
      <button
        type="button"
        onClick={() => setLiveMode((x) => !x)}
        title={liveMode ? "Disable Live Mode" : "Enable Live Mode"}
      >
        &#x1F3A5;
        {!liveMode && <span className="ControlPanel-disabled">&#10060;</span>}
      </button>
      <div className="ControlPanel-select">
        &#x1F39B;
        <select
          onChange={(e) => {
            switch (e.target.value) {
              case "off":
                setSpeakerOn(false);
                setMicOn(false);
                break;
              case "speaker":
                setSpeakerOn(true);
                setMicOn(false);
                break;
              case "mic":
                setSpeakerOn(true);
                setMicOn(true);
                break;
              default:
                throw new Error("no option");
            }
          }}
        >
          <option value="off">Audio Off</option>
          <option value="speaker">Speaker Only</option>
          <option value="mic">Mic + Speaker</option>
        </select>
      </div>
    </div>
  )
);
