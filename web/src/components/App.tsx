import React from "react";

import "./App.css";
import { ErrorFallback } from "./ErrorFallback";
import { SingleRoomEntrance } from "./SingleRoomEntrance";
import { GitHubCorner } from "./GitHubCorner";

class ErrorBoundary extends React.PureComponent {
  state: { err?: Error } = {};

  static getDerivedStateFromError(err: Error) {
    return { err };
  }

  render() {
    const { children } = this.props;
    const { err } = this.state;
    if (err) return <ErrorFallback err={err} />;
    return children;
  }
}

export const App = React.memo(() => (
  <div className="App">
    <ErrorBoundary>
      <SingleRoomEntrance />
      <GitHubCorner size={40} fill="gray" />
    </ErrorBoundary>
  </div>
));
