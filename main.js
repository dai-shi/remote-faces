const params = Qs.parse(location.hash.slice(1));

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const takePhoto = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const track = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(track);
  await sleep(500);
  const bitmap = await imageCapture.grabFrame()
  track.stop();
  canvas.width = 48;
  canvas.height = 64;
  const ratio  = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const width = Math.min(bitmap.width, canvas.width / ratio);
  const height = Math.min(bitmap.height, canvas.height / ratio);
  const x = (bitmap.width - width) / 2;
  const y = (bitmap.height - height) / 2;
  ctx.drawImage(bitmap, x, y, width, height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
};

const loop = async (connMap) => {
  const dataUrl = await takePhoto();
  const json = {
    id: params.me,
    name: params.me,
    img: dataUrl,
  };
  const data = JSON.stringify(json);
  Object.keys(connMap).forEach(key => {
    const conn = connMap[key];
    if (conn.open) {
      conn.send(data);
    }
  });
  document.getElementById('myself').src = dataUrl;
  await sleep(2 * 60 * 1000);
  loop(connMap);
};

const getImageEle = id => {
  const ele = document.getElementById('img-' + id);
  if (ele) return ele;
  const newEle = document.createElement('img');
  newEle.id = 'img-' + id;
  document.getElementById('app').appendChild(newEle);
  return newEle;
};

const receiver = async data => {
  try {
    const json = JSON.parse(data);
    getImageEle(json.id).src = json.img;
  } catch (e) {
    console.log('receiver', e);
  }
};

const main = async () => {
  const me = params.namespace + '_' + params.me;
  const peer = new Peer(me);
  peer.on('error', err => {
    if (err.type === 'peer-unavailable') return;
    console.error('main', err.type, err);
    alert('Fatal Error');
    location.reload();
  });
  const connMap = {};
  params.friends.forEach(x => {
    const friend = params.namespace + '_' + x;
    const conn = peer.connect(friend);
    connMap[conn.peer] = conn;
    conn.on('data', receiver);
  });
  peer.on('connection', conn => {
    connMap[conn.peer] = conn;
    conn.on('data', receiver);
  });
  loop(connMap);
};

window.onload = main;
