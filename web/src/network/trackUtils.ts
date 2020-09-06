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

export const videoTrackToImageConverter = async (track: MediaStreamTrack) => {
  if (track.kind !== "video") {
    throw new Error("track kind is not video");
  }
  const imageCapture = new ImageCapture(track);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const getImage = async () => {
    try {
      const bitmap = await imageCapture.grabFrame();
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      ctx.drawImage(bitmap, 0, 0);
      return canvas.toDataURL("image/jpeg");
    } catch (e) {
      console.log("failed to grab frame from viedeo track", e);
      return null;
    }
  };
  return { getImage };
};

const createImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const imageToVideoTrackConverter = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const canvasStream = (canvas as any).captureStream() as MediaStream;
  const [videoTrack] = canvasStream.getVideoTracks();
  const setImage = async (dataURL: string) => {
    const img = await createImage(dataURL);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  return { videoTrack, setImage };
};
