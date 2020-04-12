import React, { useState } from "react";

import { secureRandomId } from "../utils/crypto";
import { getRoomIdFromUrl } from "../utils/url";
import SingleRoom from "./SingleRoom";
import "./SingleRoomEntrance.css";

const roomIdFromUrl = getRoomIdFromUrl();
const userId = secureRandomId();

const SingleRoomEntrance: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(roomIdFromUrl);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRoomId(secureRandomId());
  };

  if (roomId) {
    return <SingleRoom roomId={roomId} userId={userId} />;
  }

  return (
    <form className="SingleRoomEntrance-init" onSubmit={onSubmit}>
      <input type="submit" value="Create a new room" />
    </form>
  );
};

export default SingleRoomEntrance;
