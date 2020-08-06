import { hasPeerJsConfigInUrl, hasPubsubConfigInUrl } from "../utils/url";
import type { CreateRoom } from "./common";

export type { NetworkStatus, PeerInfo } from "./common";
export { ROOM_ID_PREFIX_LEN } from "./common";

export const createRoom: CreateRoom = async (...args) => {
  let createRoomImpl: CreateRoom;
  if (hasPeerJsConfigInUrl()) {
    createRoomImpl = (await import("./peerjsRoom")).createRoom;
  } else if (hasPubsubConfigInUrl()) {
    createRoomImpl = (await import("./pubsubRoom")).createRoom;
  } else {
    createRoomImpl = (await import("./ipfsRoom")).createRoom;
  }
  return createRoomImpl(...args);
};
