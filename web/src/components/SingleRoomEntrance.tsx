import React, { useState } from "react";

import { secureRandomId } from "../utils/crypto";
import { getRoomIdFromUrl, extractRoomIdFromLink } from "../utils/url";
import SingleRoom from "./SingleRoom";
import "./SingleRoomEntrance.css";

const roomIdFromUrl = getRoomIdFromUrl();
const userId = secureRandomId();

const SingleRoomEntrance: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(roomIdFromUrl);
  const [linkText, setLinkText] = useState("");

  const onCreateNew = () => {
    setRoomId(secureRandomId());
  };

  const onEnter = () => {
    setRoomId(extractRoomIdFromLink(linkText));
  };

  if (roomId) {
    return <SingleRoom roomId={roomId} userId={userId} />;
  }

  return (
    <div className="SingleRoomEntrance-init">
      <button type="button" onClick={onCreateNew}>
        Create a new room
      </button>
      OR
      <input
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
        placeholder="Enter room link..."
      />
      <button
        type="button"
        onClick={onEnter}
        disabled={!extractRoomIdFromLink(linkText)}
      >
        Enter room
      </button>
    </div>
  );
};

export default SingleRoomEntrance;
