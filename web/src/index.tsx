import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./components/App";

const ele = document.getElementById("root");
if (!ele) {
  throw new Error("no root");
}

createRoot(ele).render(
  <StrictMode>
    <App />
  </StrictMode>
);
