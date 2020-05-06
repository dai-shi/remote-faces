import { sleep } from "../utils/sleep";

const captureImage = async (stream: MediaStream, track: MediaStreamTrack) => {
  if (typeof ImageCapture !== "undefined") {
    const imageCapture = new ImageCapture(track);
    await sleep(2000);
    let srcImg;
    try {
      const blob = await imageCapture.takePhoto();
      srcImg = await createImageBitmap(blob);
    } catch (e) {
      srcImg = await imageCapture.grabFrame();
    }
    const srcW = srcImg.width;
    const srcH = srcImg.height;
    return { srcImg, srcW, srcH };
  }
  const video = document.getElementById("internal-video") as HTMLVideoElement;
  video.style.display = "block";
  const savedSrcObject = video.srcObject;
  const revert = () => {
    video.srcObject = savedSrcObject;
  };
  video.srcObject = stream;
  await sleep(2000);
  const srcImg = video;
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  return { srcImg, srcW, srcH, revert };
};

export const takePhoto = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const track = stream.getVideoTracks()[0];
  const canvas = document.getElementById(
    "internal-canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const dstW = 72;
  const dstH = 72;
  canvas.width = dstW;
  canvas.height = dstH;
  const { srcImg, srcW, srcH, revert } = await captureImage(stream, track);
  const ratio = Math.max(dstW / srcW, dstH / srcH);
  const width = Math.min(srcW, dstW / ratio);
  const height = Math.min(srcH, dstH / ratio);
  const x = (srcW - width) / 2;
  const y = (srcH - height) / 2;
  ctx.drawImage(srcImg, x, y, width, height, 0, 0, dstW, dstH);
  if (revert) {
    revert();
  }
  track.stop();
  return canvas.toDataURL("image/jpeg");
};
