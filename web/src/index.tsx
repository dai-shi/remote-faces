import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./components/App";
import * as serviceWorker from "./serviceWorker";

const ele = document.getElementById("root");
if (!ele) {
  throw new Error("no root");
}

createRoot(ele).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
