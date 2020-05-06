export const getScreenStream = async () => {
  try {
    const constraints = { video: true };
    const stream = (await (navigator.mediaDevices as any).getDisplayMedia(
      constraints
    )) as MediaStream;
    const [track] = stream.getVideoTracks();
    const dispose = () => {
      track.stop();
    };
    return {
      stream,
      dispose,
    };
  } catch (e) {
    return null;
  }
};
