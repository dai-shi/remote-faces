// utils ---------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hash = (x) => x && CryptoJS.MD5(x).toString().slice(0, 32);
const rand4 = () => 1000 + Math.floor(Math.random() * 9000);
const SEED_PEERS = 5;
const guessSeed = (id) => Number(id.split('_')[1]) < SEED_PEERS;

const showError = async (text, color, waitSec) => {
  const ele = document.getElementById('error');
  ele.textContent = text + ' Will reload in ' + waitSec + 's.';
  ele.style.backgroundColor = color;
  ele.style.display = 'block';
  await sleep(waitSec * 1000);
  window.location.reload();
};

const showStatus = (text) => {
  const ele = document.getElementById('status');
  ele.textContent = text;
};
const showConnectedStatus = (text) => {
  showStatus('Connected to peers: '
    + getLivePeers().map((t) => t.split('_')[1]).join(', ')
    + (text ? ' (' + text + ')' : ''));
};

const debug = (...args) => {
  console.log(new Date(), ...args);
};

const isConnectedConn = (conn, includesConnecting = false) => {
  if (!conn) return false;
  const peerConn = conn.peerConnection;
  if (!peerConn) return false;
  const connState = peerConn.connectionState;
  if (connState === 'connected') return true;
  if (includesConnecting) {
    if (connState === 'connecting' || connState === 'new') {
      return true;
    }
  }
  // for safari
  if (!connState && peerConn.signalingState === 'stable') return true;
  return false;
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

const updateMesg = (mesg) => {
  params.mesg = mesg;
  updateParams();
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
  const newEle = document.getElementById('templ').cloneNode(true);
  newEle.id = id;
  document.getElementById('app').appendChild(newEle);
  return newEle;
};

const updateImage = (id, name, img, mesg) => {
  const ele = getImageEle(id);
  ele.querySelector('img').src = img;
  ele.querySelector('.name').textContent = name;
  if (id !== 'myself') {
    ele.querySelector('.mesg').textContent = mesg;
  }
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

let myPeer = null;
let lastPhotoUrl = null;

const sendPhoto = async () => {
  try {
    lastPhotoUrl = await takePhoto();
    sendDataToAllPeers();
    document.getElementById('app').style.display = 'block';
    updateImage('myself', params.myself, lastPhotoUrl);
    await sleep(2 * 60 * 1000);
    lastPhotoUrl = null;
    sendPhoto();
  } catch (e) {
    console.error('sendPhoto', e);
    showError('Unable to capture the image.', 'pink', 20);
  }
};

const initForm = () => {
  const form = document.querySelector('#myself .mesg form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendDataToAllPeers();
  });
  const input = form.querySelector('input');
  input.value = params.mesg || '';
  input.addEventListener('change', (e) => {
    e.preventDefault();
    updateMesg(e.target.value);
  });
};

const sendDataToAllPeers = () => {
  if (myPeer) {
    Object.keys(myPeer.connections).forEach((key) => {
      myPeer.connections[key].forEach((conn) => {
        if (conn.open) sendData(conn);
      });
    });
  }
};

const getLivePeers = () => {
  const peers = Object.keys(myPeer.connections);
  const livePeers = peers.filter(
    (peer) => myPeer.connections[peer].some(isConnectedConn),
  );
  return livePeers;
};

const sendData = (conn) => {
  try {
    if (!lastPhotoUrl) return;
    const data = {
      myself: params.myself,
      img: lastPhotoUrl,
      mesg: document.querySelector('#myself .mesg input').value,
      peers: getLivePeers(),
    };
    conn.send(data);
  } catch (e) {
    debug('sendData', e);
  }
};

const receiveData = (data) => {
  try {
    if (data.myself && data.img) {
      updateImage(hash(data.myself), data.myself, data.img, data.mesg);
    }
    (data.peers || []).forEach(connectPeer);
  } catch (e) {
    debug('receiveData', e);
  }
};

const heartbeat = async () => {
  await sleep(5 * 60 * 1000);
  if (myPeer && myPeer.open) myPeer.socket.send({ type: 'HEARTBEAT' });
  heartbeat();
};

// startup ---------------------------

const connectPeer = (id) => {
  if (!myPeer) return;
  if (myPeer.id === id) return;
  const conns = myPeer.connections[id];
  const hasEffectiveConn = conns
    && conns.some((conn) => isConnectedConn(conn, true));
  if (hasEffectiveConn) return;
  debug('connectPeer', id, conns && conns.map((c) => c.peerConnection && c.peerConnection.connectionState));
  const conn = myPeer.connect(id, { serialization: 'json' });
  initConnection(conn);
};

const initConnection = (conn) => {
  conn.on('open', () => {
    showConnectedStatus();
    if (myPeer) sendData(conn);
  });
  conn.on('data', receiveData);
  conn.on('close', async () => {
    debug('dataConnection closed', conn);
    showConnectedStatus('closed: ' + conn.peer.split('_')[1]);
    if (guessSeed(conn.peer)) reInitMyPeer(conn.peer);
  });
  conn.on('error', async (err) => {
    debug('dataConnection error', conn, err.type, err);
    showConnectedStatus('error: ' + conn.peer.split('_')[1]);
    if (guessSeed(conn.peer)) reInitMyPeer(conn.peer);
  });
};

const createMyPeer = (index) => {
  showStatus('Initializing peer...' + index);
  const isSeed = index < SEED_PEERS;
  const id = hash(params.roomid) + '_' + (isSeed ? index : rand4());
  debug('createMyPeer', index, id);
  const peer = new Peer(id);
  return new Promise((resolve) => {
    peer.on('open', () => {
      resolve(peer);
    });
    peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        peer.destroy();
        createMyPeer(index + 1).then(resolve);
      } else if (err.type === 'peer-unavailable') {
        // ignore
      } else if (err.type === 'network') {
        debug('createMyPeer network error', err);
        showError('The network is down.', 'orange', 10);
      } else {
        console.error('createMyPeer', err.type, err);
        showError('Unknown error occured.', 'red', 60);
      }
    });
  });
};

const reInitMyPeer = async (disconnectedId) => {
  if (!myPeer) return;
  if (guessSeed(myPeer.id)) return;
  const waitSec = 30 + Math.floor(Math.random() * 60);
  showStatus('Disconnected seed peer: ' + disconnectedId.split('_')[1] + ', reinit in ' + waitSec + 'sec...');
  await sleep(waitSec * 1000);
  if (!myPeer) return;
  if (guessSeed(myPeer.id)) return;
  let checkSeeds = true;
  for (let i = 0; i < SEED_PEERS; i += 1) {
    const id = hash(params.roomid) + '_' + i;
    const conns = myPeer.connections[id] || [];
    if (!conns.some((conn) => isConnectedConn(conn, true))) {
      checkSeeds = false;
    }
  }
  if (checkSeeds) {
    showConnectedStatus();
    return;
  }
  myPeer.destroy();
  myPeer = null;
  initMyPeer();
};

const initMyPeer = async () => {
  if (myPeer) return;
  myPeer = await createMyPeer(0);
  myPeer.on('connection', (conn) => {
    debug('new connection received', conn);
    initConnection(conn);
  });
  showStatus('Connecting to seed peers...');
  for (let i = 0; i < SEED_PEERS; i += 1) {
    const id = hash(params.roomid) + '_' + i;
    connectPeer(id);
  }
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
    fetch('https://api.github.com/repos/dai-shi/remote-faces/git/trees/gh-pages')
      .then((res) => res.json())
      .then((json) => json.tree.find(x => x.path === 'd').url)
      .then((url) => fetch(url))
      .then((res) => res.json())
      .then((json) => {
        const url = 'https://remote-faces.js.org/d/' + json.tree.pop().path + '/';
        setTimeout(() => {
          window.location.href = url;
        }, 2000);
      });
    return;
    // await initParams();
  }
  document.getElementById('landing').style.display = 'none';
  initMyPeer();
  sendPhoto();
  checkObsoletedImage();
  heartbeat();
  initForm();
};

window.onload = main;
// document.title = 'Remote Faces (r86)';
