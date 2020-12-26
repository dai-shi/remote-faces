export const getVideoStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getVideoTracks();
  const dispose = () => {
    track.stop();
  };
  return {
    stream,
    dispose,
  };
};

export const getFaceVideoStream = async (deviceId?: string) => {
  const constraints = {
    video: { deviceId, width: { exact: 72 }, height: { exact: 72 } },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getVideoTracks();
  const dispose = () => {
    track.stop();
  };
  return {
    stream,
    dispose,
  };
};
