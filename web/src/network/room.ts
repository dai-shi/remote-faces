import type { CreateRoom } from "./common";
import { createRoom as peerjsCreateRoom } from "./peerjsRoom";

export type { NetworkStatus, PeerInfo } from "./common";
export { ROOM_ID_PREFIX_LEN } from "./common";

export const createRoom: CreateRoom = (...args) => {
  return peerjsCreateRoom(...args);
};
