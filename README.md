# remote-faces

This is a small app to share webcam still images periodically.

## distribute memo

```
npx electron-packager ./ --platform=darwin,win32 --asar
npx electron-installer-dmg ./Remote\ Faces-darwin-x64/Remote\ Faces.app remote-faces --icon=./icons/icon.icns
npx https://gist.github.com/dai-shi/15d8edac8075fc70e36f10fa531540a6 '{"appDirectory":"./Remote Faces-win32-x64","exe":"Remote Faces.exe","setupExe":"RemoteFacesSetup.exe","iconUrl":"https://raw.githubusercontent.com/dai-shi/remote-faces/master/icons/icon.ico"}'
```
