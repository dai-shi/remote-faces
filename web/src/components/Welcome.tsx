import React from "react";

import "./Welcome.css";
import { Landing } from "./Landing";

export const Welcome = React.memo(() => (
  <div className="Welcome-container">
    <h1>Welcome to Remote Faces!</h1>
    <Landing hideHowto />
  </div>
));

export default Welcome;
