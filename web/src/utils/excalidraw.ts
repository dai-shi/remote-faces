import { ROOM_ID_PREFIX_LEN } from "../network/peerUtils";
import { importCryptoKey } from "./crypto";

export const generateExcalidrawURL = async (roomId: string) => {
  const id = roomId.slice(0, 20);
  const imported = await importCryptoKey(roomId.slice(ROOM_ID_PREFIX_LEN), [
    "encrypt",
    "decrypt",
  ]);
  const key = (await window.crypto.subtle.exportKey("jwk", imported)).k;
  console.log(key);
  return `https://excalidraw.com/#room=${id},${key}`;
};
