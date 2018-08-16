// utils ---------------------

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = x => x && CryptoJS.MD5(x).toString().slice(0, 16);

// params --------------------

const params = Qs.parse(window.location.hash.slice(1));
const updateParams = () => {
  window.location.hash = '#' + Qs.stringify(params);
};

const getRoomid = () => {
  while (!params.roomid) {
    params.roomid = prompt('Enter Room ID');
    if (params.roomid) updateParams();
  }
  return hash(params.roomid);
};

const getMyself = () => {
  while (!params.myself) {
    params.myself = prompt('Enter your name');
    if (params.myself) updateParams();
  }
  return hash(params.myself);
};

const getMembers = () => {
  while (!Array.isArray(params.members)) {
    const result = prompt('Enter friend names (comma separated)');
    if (result) {
      params.members = result.split(',');
      updateParams();
    }
  }
  return params.members.map(hash);
};

// ---------------------------

const takePhoto = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const track = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  await sleep(2000);
  const bitmap = await imageCapture.grabFrame();
  track.stop();
  canvas.width = 64;
  canvas.height = 64;
  const ratio = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const width = Math.min(bitmap.width, canvas.width / ratio);
  const height = Math.min(bitmap.height, canvas.height / ratio);
  const x = (bitmap.width - width) / 2;
  const y = (bitmap.height - height) / 2;
  ctx.drawImage(bitmap, x, y, width, height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
};

const loop = async (connMap) => {
  try {
    const dataUrl = await takePhoto();
    const json = {
      myself: params.myself,
      members: params.members,
      img: dataUrl,
    };
    const data = JSON.stringify(json);
    Object.keys(connMap).forEach((key) => {
      const conn = connMap[key];
      if (conn.open) {
        conn.send(data);
      }
    });
    const ele = document.getElementById('base');
    ele.querySelector('img').src = dataUrl;
    ele.querySelector('.name').innerHTML = params.myself;
    ele.dataset.modified = Date.now();
    ele.style.opacity = 1.0;
    await sleep(2 * 60 * 1000);
    loop(connMap);
  } catch (e) {
    console.error('loop', e);
    alert('Unable to capture webcam, force reloading.');
    window.location.reload();
  }
};

const getImageEle = (id) => {
  const ele = document.getElementById(id);
  if (ele) return ele;
  const newEle = document.getElementById('base').cloneNode(true);
  newEle.id = id;
  document.getElementById('app').appendChild(newEle);
  return newEle;
};

const receiver = (conn, connectMembers) => async (data) => {
  try {
    const json = JSON.parse(data);
    const ele = getImageEle(conn.peer);
    ele.querySelector('img').src = json.img;
    ele.querySelector('.name').innerHTML = json.myself;
    ele.dataset.modified = Date.now();
    ele.style.opacity = 1.0;
    if (Array.isArray(params.members) && Array.isArray(json.members)) {
      let memberUpdated = false;
      json.members.forEach((member) => {
        if (!params.members.includes(member)) {
          params.members.push(member);
          memberUpdated = true;
        }
      });
      if (memberUpdated) {
        updateParams();
        connectMembers();
      }
    }
  } catch (e) {
    console.log('receiver', e);
  }
};

const check = async () => {
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
  check();
};

const heartbeat = async (peer) => {
  await sleep(5 * 60 * 1000);
  peer.socket.send({ type: 'HEARTBEAT' });
  heartbeat(peer);
};

const main = async () => {
  const roomid = getRoomid();
  const myself = getMyself();
  const peer = new Peer(roomid + '_' + myself, {
    host: 'peerjs.axlight.com',
    port: window.location.protocol === 'https:' ? 443 : 80,
    secure: window.location.protocol === 'https:',
  });
  peer.on('error', async (err) => {
    if (err.type === 'peer-unavailable') return;
    if (err.type === 'network') {
      alert('Network is closed, force reloading');
      window.location.reload();
    }
    console.error('main', err.type, err, peer);
    peer.destroy();
    alert('Fatal Error: check console and contact admin, then reload to start over.');
  });
  const connMap = {};
  const connectMembers = () => {
    const members = getMembers();
    members.forEach((member) => {
      if (member === myself) return;
      const id = roomid + '_' + member;
      if (connMap[id]) return;
      const conn = peer.connect(id);
      connMap[id] = conn;
      conn.on('data', receiver(conn, connectMembers));
    });
  };
  connectMembers();
  peer.on('connection', (conn) => {
    connMap[conn.peer] = conn;
    conn.on('data', receiver(conn, connectMembers));
  });
  await sleep(1000);
  loop(connMap);
  check();
  heartbeat(peer);
};

window.onload = main;
