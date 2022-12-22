/* eslint jsx-a11y/no-static-element-interactions: off */
/* eslint jsx-a11y/mouse-events-have-key-events: off */

import { Suspense, lazy, memo, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import "./ControlPanel.css";
import { globalState } from "../states/global";
import { SuspenseFallback } from "./reusable/SuspenseFallback";

const MySetting = lazy(() => import("./MySetting"));
const RegionEditor = lazy(() => import("./reusable/RegionEditor"));
const LinkOpener = lazy(() => import("./reusable/LinkOpener"));

type OnMouseMove = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | "ended"
) => void;

export const ControlPanel = memo(() => {
  const {
    roomId,
    userId,
    preference: { hideMemberList },
  } = useSnapshot(globalState);

  const positionRef = useRef<readonly [number, number]>(
    globalState.preference.controlPanelPosition || [40, 350]
  );
  const onMouseDragRef = useRef<OnMouseMove>();
  const [showModal, setShowModal] = useState<
    null | "region-editor" | "link-opener" | "setting"
  >(null);

  return (
    <>
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
        <div className="ControlPanel-toolbar">
          <div>
            <button
              type="button"
              onClick={() => {
                globalState.preference.hideMemberList = !hideMemberList;
              }}
            >
              {hideMemberList ? "Show Member List" : "Hide Member List"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                setShowModal(showModal === "setting" ? null : "setting")
              }
            >
              {showModal === "setting" ? "Close Setting" : "Open Setting"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                setShowModal(
                  showModal === "region-editor" ? null : "region-editor"
                )
              }
            >
              {showModal === "region-editor"
                ? "Close Region Editor"
                : "Open Region Editor"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                setShowModal(showModal === "link-opener" ? null : "link-opener")
              }
            >
              {showModal === "link-opener"
                ? "Close Link Opener"
                : "Open Link Opener"}
            </button>
          </div>
        </div>
      </div>
      {!!showModal && (
        <div className="ControlPanel-dialog">
          <button type="button" onClick={() => setShowModal(null)}>
            Close
          </button>
          <Suspense fallback={<SuspenseFallback />}>
            {showModal === "setting" && (
              <div className="ControlPanel-setting">
                <MySetting />
              </div>
            )}
            {showModal === "region-editor" && (
              <div className="ControlPanel-region-editor">
                <RegionEditor roomId={roomId} userId={userId} />
              </div>
            )}
            {showModal === "link-opener" && (
              <div className="ControlPanel-link-opener">
                <LinkOpener roomId={roomId} />
              </div>
            )}
          </Suspense>
        </div>
      )}
    </>
  );
});
