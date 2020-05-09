import { sleep } from "../utils/sleep";

const setupMap = new WeakMap<MediaStreamTrack, boolean>();

// XXX we don't get "ended" event with removeTrack,
// so a workaround is onmute and transceiver.currentDirection
export const setupTrackStopOnLongMute = (
  track: MediaStreamTrack,
  pc: RTCPeerConnection
) => {
  if (setupMap.has(track)) {
    return track;
  }
  setupMap.set(track, true);
  const onmute = async () => {
    await sleep(5000);
    const transceiver = pc
      .getTransceivers()
      .find((t) => t.receiver.track === track);
    if (
      transceiver &&
      (transceiver.currentDirection === "inactive" ||
        transceiver.currentDirection === "sendonly")
    ) {
      track.stop();
      // XXX we need to manually dispatch ended event, why?
      track.dispatchEvent(new Event("ended"));
    }
  };
  track.addEventListener("mute", onmute);
  return track;
};
