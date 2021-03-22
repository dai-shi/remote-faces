import React, { useEffect, useState } from "react";

import "./LinkOpener.css";
import { generateExcalidrawURL } from "../utils/excalidraw";

export const LinkOpener = React.memo<{
  roomId: string;
}>(({ roomId }) => {
  const [excalidrawUrl, setExcalidrawUrl] = useState<string>();
  useEffect(() => {
    (async () => {
      setExcalidrawUrl(await generateExcalidrawURL(roomId));
    })();
  }, [roomId]);

  const appLink = `remote-faces://${window.location.href.replace(
    /^https:\/\//,
    ""
  )}`;

  return (
    <div className="LinkOpener-container">
      <div>
        <span title="Share this link with your colleagues">Room Link: </span>
        <input value={window.location.href} readOnly />
      </div>
      <div>
        <a href={appLink} title="Open this link in the desktop app">
          Open App
        </a>
      </div>
      <div>
        <a href={excalidrawUrl} target="_blank" rel="noreferrer">
          Open Excalidraw
        </a>
      </div>
    </div>
  );
});
