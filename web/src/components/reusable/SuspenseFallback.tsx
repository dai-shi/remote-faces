import { memo } from "react";

import "./SuspenseFallback.css";

export const SuspenseFallback = memo(() => (
  <div className="SuspenseFallback-container">
    <div>Loading...</div>
  </div>
));
