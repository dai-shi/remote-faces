import type { CreateRoom } from "./common";
import { createRoom as peerjsCreateRoom } from "./peerjsRoom";
import { createRoom as ipfsCreateRoom } from "./ipfsRoom";

export type { NetworkStatus, PeerInfo } from "./common";
export { ROOM_ID_PREFIX_LEN } from "./common";

export const createRoom: CreateRoom = (...args) => {
  const hash = window.location.hash.slice(1);
  const searchParams = new URLSearchParams(hash);
  const server = searchParams.get("server");
  if (server === "ipfs") {
    return ipfsCreateRoom(...args);
  }
  return peerjsCreateRoom(...args);
};
