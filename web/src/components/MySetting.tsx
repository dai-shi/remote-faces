import { memo, useState } from "react";

import "./MySetting.css";
import { setConfigAvatar } from "../states/singleRoom";
import { preferenceState } from "../states/preference";

const LOW_RESOLUTION = 36;

export const MySetting = memo<{
  statusMesg: string;
  suspended: boolean;
  toggleSuspended: () => void;
  setStatusMesg: (message: string) => void;
}>(({ statusMesg, suspended, toggleSuspended, setStatusMesg }) => {
  const [message, setMessage] = useState(statusMesg);
  const [camera, setCamera] = useState(!suspended);
  const [lowResPhoto, setLowResPhoto] = useState(
    preferenceState.photoSize === LOW_RESOLUTION
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
          defaultValue={message || ""}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </label>
      <hr />
      <button
        type="button"
        onClick={() => {
          if (message !== null) {
            setStatusMesg(message);
          }
          if (suspended === camera) {
            toggleSuspended();
          }
          preferenceState.photoSize = lowResPhoto ? LOW_RESOLUTION : undefined;
          if (suspended && avatar) {
            setConfigAvatar(avatar);
          }
        }}
      >
        update
      </button>
    </div>
  );
});
