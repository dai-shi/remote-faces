import React, { createElement, useState } from "react";

import "./TabPane.css";

type TabName = "Welcome" | "Screen Share" | "Video Share" | "White Board";

const tabComponents = {
  Welcome: React.lazy(() => import("./Welcome")),
  "Screen Share": React.lazy(() => import("./ScreenShare")),
  "Video Share": React.lazy(() => import("./VideoShare")),
  "White Board": React.lazy(() => import("./CollabWhiteBoard")),
};

export const TabPane = React.memo<{
  roomId: string;
  userId: string;
  nickname: string;
}>(({ roomId, userId, nickname }) => {
  const [activeTab, setActiveTab] = useState<TabName>("Welcome");
  return (
    <div className="TabPane-container">
      <div className="TabPane-tabList">
        {Object.keys(tabComponents).map((tab, index) => (
          <button
            type="button"
            className={activeTab === tab ? "TabPane-active" : ""}
            style={{
              transform: `translateX(-30px) translateY(${
                40 + 70 * index
              }px) rotate(-90deg)`,
            }}
            onClick={() => setActiveTab(tab as TabName)}
          >
            {tab}
          </button>
        ))}
      </div>
      {createElement(tabComponents[activeTab], {
        roomId,
        userId,
        nickname,
      })}
    </div>
  );
});
