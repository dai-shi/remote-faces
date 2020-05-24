import React, { Dispatch, SetStateAction } from "react";

import "./ControlPanel.css";

export const ControlPanel = React.memo<{
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
    liveMode,
    setLiveMode,
    micOn,
    setMicOn,
    speakerOn,
    setSpeakerOn,
    secondColumnOpen,
    setSecondColumnOpen,
  }) => (
    <div className="ControlPanel-container">
      <button
        type="button"
        onClick={() => setLiveMode((x) => !x)}
        title={liveMode ? "Disable Live Mode" : "Enable Live Mode"}
      >
        &#x1F3A5;
        {!liveMode && <span className="ControlPanel-disabled">&#10060;</span>}
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
        onClick={() => setMicOn((x) => !x)}
        title={micOn ? "Disable Mic" : "Enable Mic"}
      >
        &#x1F3A4;
        {!micOn && <span className="ControlPanel-disabled">&#10060;</span>}
      </button>
      <button
        type="button"
        onClick={() => setSpeakerOn((x) => !x)}
        title={speakerOn ? "Disable Speaker" : "Enable Speaker"}
      >
        <>&#x1F508;</>
        {!speakerOn && <span className="ControlPanel-disabled">&#10060;</span>}
      </button>
    </div>
  )
);
