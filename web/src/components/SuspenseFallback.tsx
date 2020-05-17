import React from "react";

import "./SuspenseFallback.css";

export const SuspenseFallback = React.memo(() => (
  <div className="Loading-container">
    <div>Loading...</div>
  </div>
));
