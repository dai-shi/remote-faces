import { hasPeerJsConfigInUrl } from "../utils/url";
import type { CreateRoom } from "./common";
import { createRoom as peerjsCreateRoom } from "./peerjsRoom";
import { createRoom as ipfsCreateRoom } from "./ipfsRoom";

export type { NetworkStatus, PeerInfo } from "./common";
export { ROOM_ID_PREFIX_LEN } from "./common";

export const createRoom: CreateRoom = (...args) => {
  if (hasPeerJsConfigInUrl()) {
    return peerjsCreateRoom(...args);
  }
  return ipfsCreateRoom(...args);
};
