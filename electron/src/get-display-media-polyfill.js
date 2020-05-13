/* eslint-env browser */
/* eslint no-async-promise-executor: off, no-use-before-define: off */

// https://github.com/electron/electron/issues/16513#issuecomment-602070250

const { desktopCapturer } = require('electron');

window.navigator.mediaDevices.getDisplayMedia = () => new Promise(async (resolve, reject) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
    });
    console.log(sources);
    const selectionElem = document.createElement('div');
    selectionElem.innerHTML = createSelectionHTML(sources);
    selectionElem.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          const id = button.getAttribute('data-id');
          const source = sources.find((s) => s.id === id);
          if (source) {
            const stream = await window.navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                },
              },
            });
            resolve(stream);
          } else {
            resolve(null);
          }
          selectionElem.remove();
        } catch (err) {
          console.error('Error selecting desktop capture source:', err);
          reject(err);
        }
      });
    });
    document.body.appendChild(selectionElem);
  } catch (err) {
    console.error('Error displaying desktop capture sources:', err);
    reject(err);
  }
});

const createSelectionHTML = (sources) => `
  <div style="position: fixed; top: 5px; left: 5px; bottom: 5px; right: 5px; overflow: scroll; background-color: lightyellow; border: 3px black solid">
    <button>Close</button>
    <ul>
      ${sources.map(({ id, name, thumbnail }) => `
        <li>
          <button data-id="${id}" title="${name}">
            <img src="${thumbnail.toDataURL()}" />
            <span>${name}</span>
          </button>
        </li>
      `).join('')}
    </ul>
  </div>
`;
