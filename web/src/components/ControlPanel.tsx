/* eslint jsx-a11y/no-static-element-interactions: off */
/* eslint jsx-a11y/mouse-events-have-key-events: off */

import { memo, useRef } from "react";

import "./ControlPanel.css";
import { globalState } from "../states/global";

type OnMouseMove = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | "ended"
) => void;

export const ControlPanel = memo(() => {
  const positionRef = useRef<readonly [number, number]>(
    globalState.preference.controlPanelPosition || [40, 350]
  );
  const onMouseDragRef = useRef<OnMouseMove>();
  // TODO

  return (
    <div
      className="ControlPanel-container"
      style={{
        left: `${positionRef.current[0]}px`,
        top: `${positionRef.current[1]}px`,
      }}
    >
      <div
        className="ControlPanel-header"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.currentTarget.parentElement;
          if (!target) {
            throw new Error("no parent element");
          }
          const offset = [
            e.clientX - parseInt(target.style.left, 10),
            e.clientY - parseInt(target.style.top, 10),
          ];
          onMouseDragRef.current?.("ended");
          target.style.boxShadow = "0 0 2px 4px gray";
          onMouseDragRef.current = (e) => {
            if (e === "ended") {
              target.style.boxShadow = "";
              globalState.preference.controlPanelPosition = [
                parseInt(target.style.left, 10),
                parseInt(target.style.top, 10),
              ];
              return;
            }
            const left = e.clientX - offset[0];
            const top = e.clientY - offset[1];
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          };
        }}
        onMouseMove={(e) => {
          if (onMouseDragRef.current) {
            onMouseDragRef.current(e);
          }
        }}
        onMouseUp={() => {
          if (onMouseDragRef.current) {
            onMouseDragRef.current("ended");
            onMouseDragRef.current = undefined;
          }
        }}
        onMouseOut={() => {
          if (onMouseDragRef.current) {
            onMouseDragRef.current("ended");
            onMouseDragRef.current = undefined;
          }
        }}
      />
      <h1>TODO</h1>
      <h2>{globalState.config.nickname}</h2>
    </div>
  );
});
