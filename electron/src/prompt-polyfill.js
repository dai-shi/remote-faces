/* eslint-env browser */

// https://github.com/konsumer/electron-prompt
// https://github.com/electron/electron-quick-start/compare/master...konsumer:master

const { ipcRenderer } = require('electron');

window.prompt = (title, val) => ipcRenderer.sendSync('prompt', { title, val });

window.promptRespond = (val) => {
  ipcRenderer.send('prompt-response', val);
};
