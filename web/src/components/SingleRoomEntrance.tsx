import React, { useState } from "react";

import { sha256 } from "../utils/hash";
import SingleRoom from "./SingleRoom";

const SingleRoomEntrance: React.FC = () => {
  const [roomId, setRoomId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRoomId(await sha256(roomName));
    setUserId(await sha256(`${roomName}_${Date.now()}`));
  };

  if (roomId && userId && nickname) {
    return <SingleRoom roomId={roomId} userId={userId} nickname={nickname} />;
  }

  return (
    <form className="init" onSubmit={onSubmit}>
      <table>
        <tbody>
          <tr>
            <td>Room Name:</td>
            <td>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Your Name:</td>
            <td>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="submit"
                value="Enter"
                disabled={!roomName || !nickname}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default SingleRoomEntrance;
