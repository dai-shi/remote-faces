// utils ---------------------------

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = x => x && CryptoJS.MD5(x).toString().slice(0, 16);

const showError = async (mesg, color, waitSec) => {
  const ele = document.getElementById('error');
  ele.innerHTML = mesg + ' Will reload in ' + waitSec + 's.';
  ele.style.backgroundColor = color;
  ele.style.display = 'block';
  await sleep(waitSec * 1000);
  window.location.reload();
};

const debug = (...args) => {
  console.log(new Date(), ...args);
};

// params --------------------------

const params = Qs.parse(window.location.hash.slice(1));
if (!Array.isArray(params.members)) params.members = [];

const updateParams = () => {
  window.location.hash = '#' + Qs.stringify(params);
};

const updateRoomid = (roomid) => {
  params.roomid = roomid;
  updateParams();
};

const updateMyself = (myself) => {
  params.myself = myself;
  updateParams();
};

const mergeMembers = (members) => {
  let updated = false;
  members.forEach((member) => {
    if (member === params.myself) return;
    if (params.members.includes(member)) return;
    params.members.push(member);
    updated = true;
  });
  if (updated) {
    updateParams();
  }
  return updated;
};

// photo ---------------------------

const captureImage = async (stream, track) => {
  if (typeof ImageCapture !== 'undefined') {
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
  const video = document.querySelector('video');
  video.style.display = 'block';
  video.srcObject = stream;
  await sleep(2000);
  const srcImg = video;
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  return { srcImg, srcW, srcH };
};

const takePhoto = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const track = stream.getVideoTracks()[0];
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const dstW = canvas.width = 72;
  const dstH = canvas.height = 72;
  const { srcImg, srcW, srcH } = await captureImage(stream, track);
  const ratio = Math.max(dstW / srcW, dstH / srcH);
  const width = Math.min(srcW, dstW / ratio);
  const height = Math.min(srcH, dstH / ratio);
  const x = (srcW - width) / 2;
  const y = (srcH - height) / 2;
  ctx.drawImage(srcImg, x, y, width, height, 0, 0, dstW, dstH);
  track.stop();
  return canvas.toDataURL('image/png');
};

const getImageEle = (id) => {
  const ele = document.getElementById(id);
  if (ele) return ele;
  const newEle = document.getElementById('base').cloneNode(true);
  newEle.id = id;
  document.getElementById('app').appendChild(newEle);
  return newEle;
};

const updateImage = (id, name, img) => {
  const ele = getImageEle(id);
  ele.querySelector('img').src = img;
  ele.querySelector('.name').innerHTML = name;
  ele.dataset.modified = Date.now();
  ele.style.opacity = 1.0;
};

const checkObsoletedImage = async () => {
  document.getElementById('app').childNodes.forEach((ele) => {
    const { modified } = ele.dataset || {};
    if (modified) {
      const t = new Date(Number(modified));
      if (t < Date.now() - 2 * 60 * 1000) {
        ele.style.opacity = 0.2;
      }
    }
  });
  await sleep(5000);
  checkObsoletedImage();
};

// peers ---------------------------

let myPeer;
let roomPeer;
let lastData;

const sendPhoto = async () => {
  try {
    const dataUrl = await takePhoto();
    lastData = {
      myself: params.myself,
      members: [params.myself, ...params.members],
      img: dataUrl,
    };
    const { connMap = {} } = myPeer || {};
    Object.keys(connMap).forEach((key) => {
      const conn = connMap[key];
      if (conn.open) {
        const data = Object.assign({}, lastData); // shallow copy
        const last = conn.lastReceived;
        if (last && last < Date.now() - 5 * 60 * 1000) {
          // the conn may be stalled, so not sending img.
          delete data.img;
        }
        conn.send(data);
      }
    });
    document.getElementById('app').style.display = 'block';
    updateImage('base', params.myself, dataUrl);
    await sleep(2 * 60 * 1000);
    lastData = null;
    sendPhoto();
  } catch (e) {
    console.error('sendPhoto', e);
    showError('Unable to capture the image.', 'pink', 20);
  }
};

const receivePhoto = conn => async (data) => {
  try {
    conn.lastReceived = Date.now();
    myPeer.connMap[conn.peer] = conn;
    if (data.myself && data.img) {
      updateImage(conn.peer, data.myself, data.img);
    }
    if (mergeMembers(data.members || [])) {
      connectMembers();
    }
  } catch (e) {
    debug('receivePhoto', e);
  }
};

let peerClosedCounter = 0;

const connectPeer = (id, conn) => {
  if (!conn) {
    if (myPeer.connMap[id] && myPeer.connMap[id].open) return;
    conn = myPeer.connect(id, { serialization: 'json' });
  }
  myPeer.connMap[id] = conn;
  conn.on('data', receivePhoto(conn));
  conn.on('open', () => {
    if (lastData) conn.send(lastData);
  });
  conn.on('close', async () => {
    debug('dataConnection closed', conn);
    peerClosedCounter += 1;
    if (peerClosedCounter > 10) {
      showError('Data connection closed for more than 10 times.', 'grey', 5);
    } else {
      await sleep(5000);
      connectPeer(id);
    }
  });
  conn.on('error', async (err) => {
    if (err.type) {
      debug('dataConnection error', err.type, err);
      await sleep(4 * 60 * 1000);
      connectPeer(id);
    } else {
      debug('dataConnection error: probably offline, giving up.', err);
    }
  });
};

const connectMembers = () => {
  if (!myPeer || !myPeer.connMap) return;
  params.members.forEach((member) => {
    const id = hash(params.roomid) + '_' + hash(member);
    connectPeer(id);
  });
};

const heartbeat = async () => {
  await sleep(5 * 60 * 1000);
  [myPeer, roomPeer].forEach((peer) => {
    if (peer && peer.open) peer.socket.send({ type: 'HEARTBEAT' });
  });
  heartbeat();
};

const createMyPeer = () => {
  const id = hash(params.roomid) + '_' + hash(params.myself);
  myPeer = new Peer(id, {
    host: 'peerjs.axlight.com',
    port: window.location.protocol === 'https:' ? 443 : 80,
    secure: window.location.protocol === 'https:',
  });
  myPeer.on('open', sendPhoto);
  myPeer.on('error', (err) => {
    if (err.type === 'peer-unavailable') return;
    if (myPeer) myPeer.destroy();
    myPeer = null;
    if (err.type === 'network') {
      showError('The network is down.', 'orange', 10);
    } else if (err.type === 'unavailable-id') {
      showError('The name is not available.', 'green', 30);
    } else {
      console.error('main', err.type, err);
      showError('Unknown error occured.', 'red', 60);
    }
  });
  myPeer.connMap = {};
  connectMembers();
  myPeer.on('connection', (conn) => {
    connectPeer(conn.peer, conn);
  });
};

const createRoomPeer = () => {
  if (roomPeer) return;
  // create for others
  const id = hash(params.roomid);
  roomPeer = new Peer(id, {
    host: 'peerjs.axlight.com',
    port: window.location.protocol === 'https:' ? 443 : 80,
    secure: window.location.protocol === 'https:',
  });
  roomPeer.on('error', async (err) => {
    debug('createRoomPeer error', err.type, err);
    if (roomPeer && roomPeer.destroyed) {
      roomPeer = null;
    }
    if (err.type === 'unavailable-id') {
      // already created by others
      await sleep(3 * 60 * 1000);
    } else {
      // retry
      await sleep(5000);
    }
    if (roomPeer) {
      if (roomPeer.disconnected) roomPeer.reconnect();
    } else {
      createRoomPeer();
    }
  });
  roomPeer.on('connection', (conn) => {
    conn.on('open', () => {
      const data = {
        members: [params.myself, ...params.members],
      };
      conn.send(data);
    });
  });
};

const connectRoomPeer = async () => {
  if (!myPeer) {
    await sleep(1000);
    connectRoomPeer();
    return;
  }
  const id = hash(params.roomid);
  const conns = myPeer.connections[id];
  if (conns && conns.find(c => c.open)) return;
  const conn = myPeer.connect(id, { serialization: 'json' });
  conn.on('data', (data) => {
    try {
      if (mergeMembers(data.members || [])) {
        connectMembers();
      }
    } catch (e) {
      debug('connectRoomPeer on data', e);
    }
  });
  conn.on('close', async () => {
    debug('connectRoomPeer close');
    await sleep(5000);
    connectRoomPeer();
  });
  conn.on('error', async (err) => {
    debug('connectRoomPeer error', err.type, err);
    await sleep(60 * 1000);
    connectRoomPeer();
  });
};

const initParams = () => new Promise((resolve) => {
  document.getElementById('param-roomid').value = params.roomid || '';
  document.getElementById('param-myself').value = params.myself || '';
  const callback = (e) => {
    e.preventDefault();
    const roomid = document.getElementById('param-roomid').value;
    const myself = document.getElementById('param-myself').value;
    if (roomid && myself) {
      updateRoomid(roomid);
      updateMyself(myself);
      document.getElementById('init').style.display = 'none';
      resolve();
    }
  };
  document.getElementById('init').onsubmit = callback;
  document.getElementById('init').style.display = 'block';
});

const main = async () => {
  if (!params.roomid || !params.myself) {
    await initParams();
  }
  createMyPeer();
  createRoomPeer();
  connectRoomPeer();
  checkObsoletedImage();
  heartbeat();
};

window.onload = main;
document.title = 'Remote Faces (r66)';
