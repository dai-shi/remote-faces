import React from "react";

import ErrorFallback from "./ErrorFallback";
import SingleRoomEntrance from "./SingleRoomEntrance";
import "./App.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) return <ErrorFallback />;
    return children;
  }
}

const App: React.FC = () => (
  <div className="App">
    <ErrorBoundary>
      <SingleRoomEntrance />
    </ErrorBoundary>
  </div>
);

export default App;
