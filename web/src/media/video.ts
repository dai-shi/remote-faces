import { sleep } from "../utils/sleep";

export const getVideoStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const track = stream.getVideoTracks()[0];
  const dispose = () => {
    track.stop();
  };
  return {
    stream,
    dispose,
  };
};

export const getFaceVideoStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const track = stream.getVideoTracks()[0];
  const video = document.getElementById("internal-video") as HTMLVideoElement;
  video.style.display = "block";
  video.srcObject = stream;
  await sleep(1000);
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  const canvas = document.getElementById(
    "internal-canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const dstW = 72;
  const dstH = 72;
  canvas.width = dstW;
  canvas.height = dstH;
  const ratio = Math.max(dstW / srcW, dstH / srcH);
  const width = Math.min(srcW, dstW / ratio);
  const height = Math.min(srcH, dstH / ratio);
  const x = (srcW - width) / 2;
  const y = (srcH - height) / 2;
  let timer: NodeJS.Timeout;
  const loop = () => {
    ctx.drawImage(video, x, y, width, height, 0, 0, dstW, dstH);
    timer = setTimeout(loop, 1000 / 15);
  };
  loop();
  const canvasStream = (canvas as any).captureStream() as MediaStream;
  const dispose = () => {
    video.style.display = "none";
    clearTimeout(timer);
    track.stop();
    canvasStream.getVideoTracks()[0].stop();
  };
  return {
    stream: canvasStream,
    dispose,
  };
};

const checkVideTrackFaceSize = async (track: MediaStreamTrack) => {
  try {
    const video = document.createElement("video");
    video.srcObject = new MediaStream([track]);
    for (let i = 0; i < 50; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(100);
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width > 0 && height > 0) {
        return width === 72 && height === 72;
      }
    }
    return true; // fallback to true
  } catch (e) {
    return true; // fallback to true
  }
};

const videoTrackFaceSizeMap = new WeakMap<MediaStreamTrack, Promise<boolean>>();

export const isVideoTrackFaceSize = (track: MediaStreamTrack) => {
  if (videoTrackFaceSizeMap.has(track)) {
    return videoTrackFaceSizeMap.get(track) as Promise<boolean>;
  }
  const promise = checkVideTrackFaceSize(track);
  videoTrackFaceSizeMap.set(track, promise);
  return promise;
};
