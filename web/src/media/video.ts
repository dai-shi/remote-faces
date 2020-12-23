import { sleep } from "../utils/sleep";

export const getVideoStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getVideoTracks();
  const dispose = () => {
    track.stop();
  };
  return {
    stream,
    dispose,
  };
};

const rafTasks = new Set<() => void>();
let rafTasksIterator: Iterator<() => void> | null = null;
const loopRafTasks = () => {
  if (!rafTasksIterator && rafTasks.size) {
    rafTasksIterator = rafTasks.values();
  }
  if (rafTasksIterator) {
    const { value, done } = rafTasksIterator.next();
    if (done) {
      rafTasksIterator = null;
    }
    value();
    requestAnimationFrame(loopRafTasks);
  } else {
    setTimeout(loopRafTasks, 1000);
  }
};
loopRafTasks();

export const getFaceVideoStream = async (deviceId?: string) => {
  const constraints = deviceId
    ? {
        video: { deviceId },
      }
    : { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [track] = stream.getVideoTracks();
  const video = document.createElement("video");
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.style.display = "block";
  video.style.width = "1px";
  video.style.height = "1px";
  video.style.position = "absolute";
  video.style.bottom = "0";
  document.body.appendChild(video);
  video.srcObject = stream;
  await sleep(1000);
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  const canvas = document.createElement("canvas");
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
  const task = () => {
    ctx.drawImage(video, x, y, width, height, 0, 0, dstW, dstH);
  };
  rafTasks.add(task);
  const canvasStream = (canvas as any).captureStream() as MediaStream;
  const dispose = () => {
    document.body.removeChild(video);
    rafTasks.delete(task);
    track.stop();
    canvasStream.getVideoTracks()[0].stop();
  };
  return {
    stream: canvasStream,
    dispose,
  };
};
