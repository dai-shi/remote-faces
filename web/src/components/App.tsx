import { PureComponent, ReactNode, Suspense, memo } from "react";

import "./App.css";
import { ErrorFallback } from "./reusable/ErrorFallback";
import { SuspenseFallback } from "./reusable/SuspenseFallback";
import { SingleRoomEntrance } from "./SingleRoomEntrance";
import { GitHubCorner } from "./reusable/GitHubCorner";

class ErrorBoundary extends PureComponent<{ children: ReactNode }> {
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

export const App = memo(() => (
  <div className="App">
    <ErrorBoundary>
      <Suspense fallback={<SuspenseFallback />}>
        <SingleRoomEntrance />
        <GitHubCorner size={40} fill="gray" />
      </Suspense>
    </ErrorBoundary>
  </div>
));
