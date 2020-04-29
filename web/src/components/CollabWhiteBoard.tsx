import React, { useEffect, useState } from "react";

import "./CollabWhiteBoard.css";
import { generateExcalidrawURL } from "../utils/excalidraw";

type Props = {
  roomId: string;
};

const CollabWhiteBoard: React.FC<Props> = ({ roomId }) => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    (async () => {
      const excalidrawUrl = await generateExcalidrawURL(roomId);
      setUrl(excalidrawUrl);
    })();
  }, [roomId]);
  return (
    <div className="CollabWhiteBoard-container">
      {url && <iframe title="Excalidraw" src={url} />}
    </div>
  );
};

export default React.memo(CollabWhiteBoard);
