import React, { useState } from "react";

import "./SingleRoomEntrance.css";
import { secureRandomId, generateCryptoKey } from "../utils/crypto";
import { ROOM_ID_PREFIX_LEN } from "../network/peerUtils";
import {
  getRoomIdFromUrl,
  extractRoomIdFromLink,
  copyHashFromLink,
} from "../utils/url";

const Landing = React.lazy(() => import("./Landing"));
const SingleRoom = React.lazy(() => import("./SingleRoom"));

const roomIdFromUrl = getRoomIdFromUrl();
const userId = secureRandomId();

export const SingleRoomEntrance = React.memo(() => {
  const [roomId, setRoomId] = useState<string | null>(roomIdFromUrl);
  const [linkShown, setLinkShown] = useState(false);
  const [linkText, setLinkText] = useState("");

  const onCreateNew = async () => {
    setRoomId(
      secureRandomId(ROOM_ID_PREFIX_LEN / 2) + (await generateCryptoKey())
    );
  };

  const onEnter = () => {
    copyHashFromLink(linkText);
    setRoomId(extractRoomIdFromLink(linkText));
  };

  if (roomId) {
    return <SingleRoom roomId={roomId} userId={userId} />;
  }

  return (
    <div className="SingleRoomEntrance-container">
      <Landing />
      <div className="SingleRoomEntrance-input">
        {!linkShown && (
          <>
            <div>
              <button type="button" onClick={onCreateNew}>
                Create a new room
              </button>
            </div>
            <div>OR</div>
            <div>
              <button type="button" onClick={() => setLinkShown(true)}>
                Enter an existing room link
              </button>
            </div>
          </>
        )}
        {linkShown && (
          <div>
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
            <button type="button" onClick={() => setLinkShown(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
