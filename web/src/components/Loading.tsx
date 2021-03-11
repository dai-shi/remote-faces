import React from "react";

import "./Loading.css";

export const Loading = React.memo(() => (
  <div className="Loading-container">
    <div className="loader">
      <div>Loading...</div>
    </div>
  </div>
));
