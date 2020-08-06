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

export const loopbackPeerConnection = (
  track: MediaStreamTrack
): Promise<MediaStreamTrack> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const pcIn = new RTCPeerConnection();
      const pcOut = new RTCPeerConnection();
      pcIn.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate) {
          pcOut.addIceCandidate(candidate);
        }
      });
      pcOut.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate) {
          pcIn.addIceCandidate(candidate);
        }
      });
      pcOut.addEventListener("track", (event) => {
        resolve(event.track);
      });
      track.addEventListener("ended", () => {
        pcIn.close();
        pcOut.close();
      });
      pcIn.addTrack(track);
      const offer = await pcIn.createOffer();
      await pcIn.setLocalDescription(offer);
      await pcOut.setRemoteDescription(offer);
      const answer = await pcOut.createAnswer();
      await pcOut.setLocalDescription(answer);
      await pcIn.setRemoteDescription(answer);
    } catch (e) {
      reject(e);
    }
  });
