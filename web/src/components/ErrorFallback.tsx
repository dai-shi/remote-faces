import React, { useEffect, useState } from "react";

const ErrorFallback: React.FC = () => {
  const [waitSec, setWaitSec] = useState(60);

  useEffect(() => {
    if (waitSec > 0) {
      setTimeout(() => {
        setWaitSec(waitSec - 1);
      }, 1000);
    } else {
      window.location.reload();
    }
  });

  return (
    <div>
      <h1>Unrecoverable error occurred.</h1>
      <p>Will auto reload in {waitSec} sec.</p>
    </div>
  );
};

export default ErrorFallback;
