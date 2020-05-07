const setupMap = new WeakMap<MediaStreamTrack, boolean>();

// XXX we don't get "ended" event with removeTrack,
// so a workaround with "mute" but "mute" is dispatched occasionally,
// so use this timeout hack
export const setupTrackStopOnLongMute = (track: MediaStreamTrack) => {
  if (setupMap.has(track)) {
    return track;
  }
  setupMap.set(track, true);
  let timeout: NodeJS.Timeout;
  const onmute = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      track.stop();
      // XXX we need to manually dispatch ended event, why?
      track.dispatchEvent(new Event("ended"));
    }, 5000);
  };
  const onunmute = () => {
    clearTimeout(timeout);
  };
  track.addEventListener("mute", onmute);
  track.addEventListener("unmute", onunmute);
  // Do we need this cleanup?
  track.addEventListener("ended", () => {
    setupMap.delete(track);
    clearTimeout(timeout);
    track.removeEventListener("mute", onmute);
    track.removeEventListener("unmute", onunmute);
  });
  return track;
};
