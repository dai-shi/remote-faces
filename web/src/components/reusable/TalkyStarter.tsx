import { memo } from "react";

import "./TalkyStarter.css";
import { ROOM_ID_PREFIX_LEN } from "../../network/common";

const TalkyStarter = memo<{
  roomId: string;
  uniqueId?: string;
}>(({ roomId, uniqueId }) => {
  const talkyUrl = `https://talky.io/${roomId.slice(0, ROOM_ID_PREFIX_LEN)}_${
    uniqueId || "default"
  }`;

  return (
    <div className="TalkyStarter-container">
      <div className="TalkyStarter-body">
        <a href={talkyUrl} target="_blank" rel="noreferrer">
          Open Talky
        </a>
      </div>
    </div>
  );
});

export default TalkyStarter;
