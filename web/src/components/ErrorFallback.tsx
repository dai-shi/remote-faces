import React, { useEffect, useState } from "react";

type Props = {
  err: Error;
};

const ErrorFallback: React.FC<Props> = ({ err }) => {
  const [waitSec, setWaitSec] = useState(30);

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
      {err && (
        <h6>
          {err.name}: {err.message}
        </h6>
      )}
      <p>Will auto reload in {waitSec} sec.</p>
    </div>
  );
};

export default ErrorFallback;
