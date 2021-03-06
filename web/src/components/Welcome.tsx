import React from "react";

import "./Welcome.css";
import { SettingPanel } from "./SettingPanel";

export const Welcome = React.memo<{
  roomId: string;
  userId: string;
  setStatusMesg: (mesg: string) => void;
}>(({ roomId, userId, setStatusMesg }) => (
  <div className="Welcome-container">
    <h1>Welcome to Remote Faces!</h1>
    <SettingPanel
      roomId={roomId}
      userId={userId}
      setStatusMesg={setStatusMesg}
    />
    <h2>Instructions</h2>
    <ul>
      <li>At first, enter Your Name and click Set in Setting.</li>
      <li>Let your colleagues know the room link in Setting.</li>
    </ul>
    <h2>Basic usage</h2>
    <ul>
      <li>See faces at the left most area, which are updated every 2min.</li>
      <li>
        You can text in the right area of the faces. Messages are not stored
        anywhere and will disappear once everyone left the room.
      </li>
    </ul>
    <h2>Advanced usage</h2>
    <ul>
      <li>Install the Electron app. Open App in Setting works for MacOS.</li>
      <li>
        Enable live mode (the top left icon) to share face videos. You can
        toggle mic and speaker.
      </li>
    </ul>
    <h2>Additional features</h2>
    <ul>
      <li>The hamburger menu shows some additional features.</li>
      <li>Screen Share, Video Share, and White Board.</li>
    </ul>
  </div>
));

export default Welcome;
