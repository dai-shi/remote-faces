export const getAudioStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        audio: { deviceId },
      }
    : { audio: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getAudioTracks();
  await track.applyConstraints({
    echoCancellation: true,
    echoCancellationType: { ideal: "system" },
    noiseSuppression: { ideal: true },
  } as MediaTrackConstraints);
  const dispose = () => {
    track.stop();
  };
  return {
    stream,
    dispose,
  };
};
