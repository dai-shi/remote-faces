import { sleep } from "../utils/sleep";

const captureImage = async (stream: MediaStream, track: MediaStreamTrack) => {
  if (typeof ImageCapture !== "undefined") {
    const imageCapture = new ImageCapture(track);
    await sleep(2000);
    let srcImg: ImageBitmap;
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
  const video = document.createElement("video");
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.style.display = "block";
  video.style.width = "1px";
  video.style.height = "1px";
  video.style.position = "absolute";
  video.style.bottom = "0";
  document.body.appendChild(video);
  const dispose = () => {
    document.body.removeChild(video);
  };
  video.srcObject = stream;
  await sleep(2000);
  const srcImg = video;
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  return { srcImg, srcW, srcH, dispose };
};

export const takePhoto = async (deviceId?: string) => {
  const constraints = {
    video: {
      deviceId,
      width: 1280,
      height: 720,
    },
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getVideoTracks();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const dstW = 72;
  const dstH = 72;
  canvas.width = dstW;
  canvas.height = dstH;
  const { srcImg, srcW, srcH, dispose } = await captureImage(stream, track);
  const ratio = Math.max(dstW / srcW, dstH / srcH);
  const width = Math.min(srcW, dstW / ratio);
  const height = Math.min(srcH, dstH / ratio);
  const x = (srcW - width) / 2;
  const y = (srcH - height) / 2;
  ctx.drawImage(srcImg, x, y, width, height, 0, 0, dstW, dstH);
  if (dispose) {
    dispose();
  }
  track.stop();
  return canvas.toDataURL("image/jpeg");
};
