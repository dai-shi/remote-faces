import { memo, useState } from "react";

import "./MySetting.css";
import { globalState } from "../states/global";

const LOW_RESOLUTION = 24;

export const MySetting = memo(() => {
  const [message, setMessage] = useState(globalState.statusMesg);
  const [camera, setCamera] = useState(globalState.config.takePhoto);
  const [lowResPhoto, setLowResPhoto] = useState(
    globalState.preference.photoSize === LOW_RESOLUTION
  );
  const [avatar, setAvatar] = useState("");
  const onChangeAvatar = (files: FileList | null) => {
    const file = files && files[0];
    if (!file) {
      return;
    }
    if (file.size > 16 * 1024) {
      window.alert(`Too large: ${file.size}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="MySetting-container">
      <h3>Setting</h3>
      <label>
        Camera :{" "}
        <button
          type="button"
          onClick={() => {
            setCamera(!camera);
          }}
        >
          {camera ? "on" : "off"}
        </button>
      </label>
      {camera && (
        <>
          {" "}
          <label>
            Low resolution:{" "}
            <input
              type="checkbox"
              checked={lowResPhoto}
              onChange={() => setLowResPhoto((x) => !x)}
            />
          </label>
          <hr />
        </>
      )}
      <hr />
      {!camera && (
        <>
          <label>
            Avatar:{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeAvatar(e.target.files)}
            />
          </label>
          <hr />
        </>
      )}
      <label>
        Message:{" "}
        <input
          type="text"
          defaultValue={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </label>
      <hr />
      <button
        type="button"
        onClick={() => {
          if (message) {
            globalState.statusMesg = message;
          }
          if (avatar) {
            globalState.config.avatar = avatar;
          }
          globalState.config.takePhoto = camera;
          globalState.preference.photoSize = lowResPhoto
            ? LOW_RESOLUTION
            : undefined;
        }}
      >
        update
      </button>
    </div>
  );
});
