# Contributing

The are two parts of the tool in this repository.
- [web app](./web) The main part of the tool. React based.
- [electron app](./electron) A wrapper part of the tool. Electron based.

## Coding contribution

### Running web app locally

Fork the repository

```bash
git clone git@github.com:<your account>/remote-faces.git
cd remote-faces/web
yarn install
yarn start
```

In order to try the app, you are likely to open multiple tabs
to simulate many users. Feel free to do so.

Chrome is recommended, but it requires a configuration.
Please check this out: https://github.com/dai-shi/remote-faces/issues/9

#### Making a PR

If you have an idea feel free to open a new PR.
It is not necessary but recommended to file a relevant issue in advance,
so that we can discuss about it.

### Running in CodeSandbox

https://codesandbox.io/s/github/dai-shi/remote-faces/tree/main/web

(You could even fork and commit in CodeSandbox.)

### Running electron app locally

Fork the repository

```bash
git clone git@github.com:<your account>/remote-faces.git
cd remote-faces/electron
yarn install
yarn start
```

Electron app is just a tiny wrapper to run the web app.
We should only add features that are only possible natively.

Check this out for more information: https://github.com/dai-shi/remote-faces/issues/10

## Non-coding contribution

Coding is not only a contribution in general OSS and in this project.
Feel free to open a new issue for discussion.
