import { sleep } from "../utils/sleep";

export const getVideoStream = async (deviceId?: string) => {
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
  const timer = setInterval(() => {
    ctx.drawImage(video, x, y, width, height, 0, 0, dstW, dstH);
  }, 1000 / 30);
  const canvasStream = (canvas as any).captureStream() as MediaStream;
  const dispose = () => {
    video.style.display = "none";
    clearInterval(timer);
    track.stop();
  };
  return {
    stream: canvasStream,
    dispose,
  };
};
