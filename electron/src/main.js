const {
  app,
  BrowserWindow,
  Menu,
  dialog,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

autoUpdater.checkForUpdatesAndNotify();
const store = new Store();

let win;

const getVersionFromUrl = () => {
  if (!win) return '';
  const url = win.webContents.getURL();
  const match = /([a-z]+\/[-0-9]+)/.exec(url);
  if (match) {
    return match[1];
  }
  return '';
};

let openUrl;
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (url.startsWith('remote-faces://remote-faces.js.org/')) {
    openUrl = `https${url.slice(12)}`;
  } else if (url.startsWith('remote-faces://dai-shi.github.io/remote-faces/')) {
    openUrl = `https${url.slice(12)}`;
  } else if (url.startsWith('remote-faces://localhost:')) {
    openUrl = `http${url.slice(12)}`;
  }
  if (win && openUrl) {
    win.loadURL(openUrl);
  }
});
app.setAsDefaultProtocolClient('remote-faces');

const loadURL = () => {
  if (!win) return;
  win.loadURL(openUrl || store.get('url', 'https://remote-faces.js.org/tools/select.html'));
  // win.loadFile('public/index.html');
};

const createWindow = () => {
  win = new BrowserWindow({
    x: store.get('x', 0),
    y: store.get('y', 0),
    width: store.get('width', 400),
    height: store.get('height', 300),
    alwaysOnTop: store.get('alwaysOnTop', false),
    frame: false,
  });
  // win.webContents.openDevTools();
  loadURL();
  win.webContents.reloadIgnoringCache();
  win.webContents.on('did-fail-load', () => {
    setTimeout(loadURL, 3000);
  });
  win.webContents.on('did-finish-load', () => {
    const version = getVersionFromUrl();
    if (version && process.platform === 'darwin') {
      app.setAboutPanelOptions({
        version,
      });
    }
  });
  win.on('close', () => {
    const pos = win.getPosition();
    const size = win.getSize();
    const url = win.webContents.getURL();
    store.set({
      x: pos[0],
      y: pos[1],
      width: size[0],
      height: size[1],
      url,
    });
  });
  win.on('closed', () => {
    win = null;
  });
};

const setupAppMenu = () => {
  const tool = {
    label: 'Tool',
    submenu: [{
      label: 'Clear Config',
      click: () => {
        if (win) win.close();
        store.clear();
        createWindow();
      },
    }, {
      label: 'Minimize Window Width',
      click: () => {
        if (!win) return;
        win.setSize(36, win.getSize()[1]);
      },
    }, {
      label: 'Toggle Always On Top',
      click: () => {
        if (win) win.close();
        const oldValue = store.get('alwaysOnTop', false);
        store.set('alwaysOnTop', !oldValue);
        createWindow();
      },
    }, {
      label: 'Show Version',
      click: () => {
        if (!win) return;
        const version = getVersionFromUrl();
        dialog.showMessageBox({
          type: 'info',
          message: version,
        });
      },
    }, {
      label: 'Select Versions',
      click: () => {
        if (!win) return;
        const url = win.webContents.getURL();
        const i = url.indexOf('#');
        win.loadURL('https://remote-faces.js.org/tools/select.html' + (i >= 0 ? url.slice(i) : ''));
      },
    }],
  };
  const template = [{
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  }, tool, {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  }, {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
    ],
  }, {
    role: 'help',
    submenu: [],
  }];
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' },
        ],
      },
    );
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ];
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.on('ready', () => {
  setupAppMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

process.on('uncaughtException', (err) => {
  console.log(err);
});
