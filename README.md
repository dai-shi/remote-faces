# remote-faces

This is a small app to share webcam still images periodically.

## distribute memo

```
PATH=/Applications/EasyWine.app/Contents/Resources/wine/bin/:$PATH npx electron-packager ./ --platform=darwin,win32 --asar
npx electron-installer-dmg ./Remote\ Faces-darwin-x64/Remote\ Faces.app remote-faces --icon=./icons/icon.icns
zip -r remote-faces.zip ./Remote\ Faces-win32-x64
```
