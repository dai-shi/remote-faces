import { hasIpfsConfigInUrl, hasPubsubConfigInUrl } from "../utils/url";
import type { CreateRoom } from "./common";

export type { NetworkStatus, PeerInfo } from "./common";
export { ROOM_ID_PREFIX_LEN } from "./common";

export const createRoom: CreateRoom = async (...args) => {
  let createRoomImpl: CreateRoom;
  if (hasIpfsConfigInUrl()) {
    createRoomImpl = (await import("./ipfsRoom")).createRoom;
  } else if (hasPubsubConfigInUrl()) {
    createRoomImpl = (await import("./pubsubRoom")).createRoom;
  } else {
    createRoomImpl = (await import("./peerjsRoom")).createRoom;
  }
  return createRoomImpl(...args);
};
