import React from "react";

import { ErrorFallback } from "./ErrorFallback";
import { SingleRoomEntrance } from "./SingleRoomEntrance";
import "./App.css";

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
    </ErrorBoundary>
  </div>
));
