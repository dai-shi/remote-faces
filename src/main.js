const { app, BrowserWindow } = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 400,
    height: 300,
    alwaysOnTop: true,
  });
  // win.loadURL('https://dai-shi.github.io/remote-faces/');
  win.loadFile('index.html'); win.webContents.openDevTools();
  win.on('close', () => {
    console.log('position', win.getPosition());
    console.log('size', win.getSize());
    console.log('url', win.webContents.getURL());
  });
  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

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
