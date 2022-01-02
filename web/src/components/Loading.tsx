import { memo } from "react";

import "./Loading.css";

export const Loading = memo(() => (
  <div className="Loading-container">
    <div className="loader">
      <div>Loading...</div>
    </div>
  </div>
));
