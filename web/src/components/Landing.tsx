import React from "react";

import "./Landing.css";

export const Landing = React.memo(() => (
  <div className="Landing-container">
    <img
      src="https://github.com/dai-shi/remote-faces/raw/master/images/logo.png"
      alt="logo"
    />
  </div>
));

export default Landing;
