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
  video.srcObject = stream;
  await sleep(2000);
  const srcImg = video;
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  return { srcImg, srcW, srcH };
};

export const takePhoto = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const track = stream.getVideoTracks()[0];
  const canvas = document.getElementById(
    "internal-canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const dstW = (canvas.width = 72);
  const dstH = (canvas.height = 72);
  const { srcImg, srcW, srcH } = await captureImage(stream, track);
  const ratio = Math.max(dstW / srcW, dstH / srcH);
  const width = Math.min(srcW, dstW / ratio);
  const height = Math.min(srcH, dstH / ratio);
  const x = (srcW - width) / 2;
  const y = (srcH - height) / 2;
  ctx.drawImage(srcImg, x, y, width, height, 0, 0, dstW, dstH);
  track.stop();
  return canvas.toDataURL("image/png");
};
