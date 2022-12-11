import { memo, useEffect, useState } from "react";

export const ErrorFallback = memo<{
  err: Error;
}>(({ err }) => {
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
});
