# remote-faces

This is a small app to share webcam still images periodically.

## distribute memo

```
npx electron-packager ./ --platform=darwin,win32 --asar
npx electron-installer-dmg ./Remote\ Faces-darwin-x64/Remote\ Faces.app remote-faces --icon=./icons/icon.icns
npm install --no-save electron-winstaller
node -e "require('electron-winstaller').createWindowsInstaller({ appDirectory: './Remote Faces-win32-x64', exe: 'Remote Faces.exe', iconUrl: 'https://github.com/dai-shi/remote-faces/raw/master/icons/icon.ico' });"
```
