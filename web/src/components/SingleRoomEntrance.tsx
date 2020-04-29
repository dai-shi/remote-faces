import React, { useState } from "react";

import "./SingleRoomEntrance.css";
import { secureRandomId, generateCryptoKey } from "../utils/crypto";
import { ROOM_ID_PREFIX_LEN } from "../network/peerUtils";
import { getRoomIdFromUrl, extractRoomIdFromLink } from "../utils/url";
import { SingleRoom } from "./SingleRoom";

const roomIdFromUrl = getRoomIdFromUrl();
const userId = secureRandomId();

export const SingleRoomEntrance = React.memo(() => {
  const [roomId, setRoomId] = useState<string | null>(roomIdFromUrl);
  const [linkText, setLinkText] = useState("");

  const onCreateNew = async () => {
    setRoomId(
      secureRandomId(ROOM_ID_PREFIX_LEN / 2) + (await generateCryptoKey())
    );
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
});
