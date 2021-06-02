import Peer from "peerjs";

import { sleep } from "../utils/sleep";
import {
  rand4,
  importCryptoKey,
  encryptString,
  decryptString,
} from "../utils/crypto";
import { getPeerJsConfigFromUrl } from "../utils/url";
import { isObject, hasObjectProp } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import {
  isValidPeerId,
  generatePeerId,
  getPeerIndexFromPeerId,
  getPeerIndexFromConn,
  createConnectionMap,
} from "./peerjsUtils";
import { setupTrackStopOnLongMute } from "./trackUtils";

const MIN_SEED_PEER_INDEX = 10; // config
const MAX_SEED_PEER_INDEX = 14; // config
const guessSeed = (id: string) => {
  const peerIndex = getPeerIndexFromPeerId(id);
  return MIN_SEED_PEER_INDEX <= peerIndex && peerIndex <= MAX_SEED_PEER_INDEX;
};

export const createRoom: CreateRoom = async (
  roomId,
  userId,
  updateNetworkStatus,
  notifyNewPeer,
  receiveData,
  receiveTrack
) => {
  let disposed = false;
  const connMap = createConnectionMap();
  if (process.env.NODE_ENV !== "production") {
    (window as any).myConnMap = connMap;
  }
  let mediaTypes: string[] = [];

  const cryptoKey = await importCryptoKey(roomId.slice(ROOM_ID_PREFIX_LEN));

  const initMyPeer = (index = MIN_SEED_PEER_INDEX): Promise<Peer> =>
    new Promise((resolve, reject) => {
      if (disposed) {
        reject(new Error("already disposed"));
        return;
      }
      connMap.clearAll();
      const isSeed =
        MIN_SEED_PEER_INDEX <= index && index <= MAX_SEED_PEER_INDEX;
      const peerIndex = isSeed ? index : rand4();
      updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex });
      const id = generatePeerId(roomId, peerIndex);
      const peer = new Peer(id, getPeerJsConfigFromUrl());
      peer.on("open", () => {
        resolve(peer);
        if (process.env.NODE_ENV !== "production") {
          (window as any).myPeer = peer;
        }
        updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
        setTimeout(() => {
          for (let i = MIN_SEED_PEER_INDEX; i <= MAX_SEED_PEER_INDEX; i += 1) {
            const seedId = generatePeerId(roomId, i);
            connectPeer(seedId);
          }
        }, 10);
      });
      peer.on("error", (err) => {
        if (err.type === "unavailable-id") {
          peer.destroy();
          initMyPeer(index + 1).then(resolve, reject);
        } else if (err.type === "peer-unavailable") {
          // ignore
        } else if (err.type === "disconnected") {
          console.log("initMyPeer disconnected error", peerIndex, err);
        } else if (err.type === "network") {
          console.log("initMyPeer network error", peerIndex, err);
        } else if (err.type === "server-error") {
          console.log("initMyPeer server error", peerIndex, err);
          updateNetworkStatus({ type: "SERVER_ERROR" });
        } else {
          console.error("initMyPeer unknown error", peerIndex, err.type, err);
          updateNetworkStatus({ type: "UNKNOWN_ERROR", err });
        }
      });
      peer.on("connection", (conn) => {
        updateNetworkStatus({
          type: "NEW_CONNECTION",
          peerIndex: getPeerIndexFromConn(conn),
        });
        initConnection(conn);
      });
      peer.on("disconnected", () => {
        console.log("initMyPeer disconnected", peerIndex);
        setTimeout(() => {
          if (!peer.destroyed) {
            updateNetworkStatus({ type: "RECONNECTING", peerIndex });
            peer.reconnect();
            setTimeout(async () => {
              if (peer.disconnected) {
                console.log("reconnect failed, re-initializing", peerIndex);
                peer.destroy();
                myPeer = await initMyPeer();
              }
            }, 60 * 1000);
          }
        }, 5 * 1000);
      });
    });
  let myPeer = await initMyPeer();

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIndexList = connMap
      .getConnectedPeerIds()
      .map(getPeerIndexFromPeerId);
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
    console.log(
      "myPeer index:",
      myPeer.id && getPeerIndexFromPeerId(myPeer.id),
      ", connnecting:",
      connMap.getNotConnectedPeerIds().map(getPeerIndexFromPeerId)
    );
  };

  const connectPeer = (id: string) => {
    if (disposed) return;
    if (myPeer.id === id || myPeer.disconnected) return;
    if (connMap.isConnectedPeerId(id)) return;
    if (connMap.hasFreshConn(id)) return;
    console.log("connectPeer", id);
    const conn = myPeer.connect(id);
    initConnection(conn);
  };

  const broadcastData = (data: unknown) => {
    if (disposed) return;
    const peers = connMap.getConnectedPeerIds();
    connMap.forEachConnectedConns((conn) => {
      sendPayload(conn, { userId, data, peers, mediaTypes });
    });
  };

  const sendData = (data: unknown, peerIndex: number) => {
    if (disposed) return;
    const conn = connMap.getConn(generatePeerId(roomId, peerIndex));
    if (!conn) return;
    const peers = connMap.getConnectedPeerIds();
    sendPayload(conn, { userId, data, peers, mediaTypes });
  };

  const sendSDP = (
    conn: Peer.DataConnection,
    sdp: { offer: unknown } | { answer: unknown }
  ) => {
    const msid2mediaType = getMsid2MediaType();
    sendPayload(conn, { SDP: { ...sdp, msid2mediaType } });
  };

  const handlePayloadSDP = async (conn: Peer.DataConnection, sdp: unknown) => {
    if (!isObject(sdp)) return;
    connMap.registerRemoteMediaType(conn, sdp);
    if (hasObjectProp(sdp, "offer")) {
      try {
        await conn.peerConnection.setRemoteDescription(sdp.offer);
        syncAllTracks(conn);
        const answer = await conn.peerConnection.createAnswer();
        await conn.peerConnection.setLocalDescription(answer);
        sendSDP(conn, { answer });
      } catch (e) {
        console.info("handleSDP offer failed", e);
      }
    } else if (hasObjectProp(sdp, "answer")) {
      try {
        await conn.peerConnection.setRemoteDescription(sdp.answer);
      } catch (e) {
        console.info("handleSDP answer failed", e);
        await sleep(Math.random() * 30 * 1000);
        removeAllTracks(conn);
        syncAllTracks(conn);
      }
    } else {
      console.warn("unknown SDP", sdp);
    }
  };

  const handlePayloadUserId = (
    conn: Peer.DataConnection,
    payloadUserId: unknown
  ) => {
    if (typeof payloadUserId === "string") {
      connMap.setUserId(conn, payloadUserId);
    }
  };

  const handlePayloadMediaTypes = async (
    conn: Peer.DataConnection,
    payloadMediaTypes: unknown
  ) => {
    if (
      Array.isArray(payloadMediaTypes) &&
      payloadMediaTypes.every((x) => typeof x === "string")
    ) {
      connMap.setAcceptingMediaTypes(conn, payloadMediaTypes as string[]);
      await sleep(5000);
      syncAllTracks(conn);
    }
  };

  const handlePayloadPeers = (peers: unknown) => {
    if (Array.isArray(peers)) {
      peers.forEach((peer) => {
        if (isValidPeerId(roomId, peer)) {
          connectPeer(peer);
        }
      });
    }
  };

  const handlePayloadData = (conn: Peer.DataConnection, data: unknown) => {
    const connUserId = connMap.getUserId(conn);
    if (connUserId) {
      const info: PeerInfo = {
        userId: connUserId,
        peerIndex: getPeerIndexFromConn(conn),
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      try {
        receiveData(data, info);
      } catch (e) {
        console.warn("receiveData", e);
      }
    }
  };

  const handlePayload = async (
    conn: Peer.DataConnection,
    encrypted: ArrayBuffer
  ) => {
    if (disposed) return;
    try {
      const payload = JSON.parse(await decryptString(encrypted, cryptoKey));
      // console.log("decrypted payload", conn.peer, payload);
      if (!isObject(payload)) return;

      handlePayloadSDP(conn, (payload as { SDP?: unknown }).SDP);
      handlePayloadUserId(conn, (payload as { userId?: unknown }).userId);
      handlePayloadMediaTypes(
        conn,
        (payload as { mediaTypes?: unknown }).mediaTypes
      );
      handlePayloadPeers((payload as { peers?: unknown }).peers);
      handlePayloadData(conn, (payload as { data?: unknown }).data);
    } catch (e) {
      console.info("Error in handlePayload", e, encrypted);
    }
  };

  const sendPayload = async (conn: Peer.DataConnection, payload: unknown) => {
    try {
      const encrypted = await encryptString(JSON.stringify(payload), cryptoKey);
      conn.send(encrypted);
    } catch (e) {
      console.error("sendPayload", e);
    }
  };

  const initConnection = (conn: Peer.DataConnection) => {
    if (connMap.isConnectedPeerId(conn.peer)) {
      console.info("dataConnection already in map, overriding", conn.peer);
    }
    connMap.addConn(conn);
    conn.on("open", () => {
      connMap.markConnected(conn);
      const peerIndex = getPeerIndexFromConn(conn);
      console.log("dataConnection open", peerIndex);
      showConnectedStatus();
      notifyNewPeer(peerIndex);
    });
    conn.on("data", (buf: ArrayBuffer) => handlePayload(conn, buf));
    conn.peerConnection.addEventListener("icegatheringstatechange", () => {
      const pc = conn.peerConnection;
      if (pc.iceGatheringState === "complete") {
        pc.onicecandidate = () => undefined;
      }
    });
    let negotiationScheduled = false;
    conn.peerConnection.addEventListener("negotiationneeded", async () => {
      if (negotiationScheduled) return;
      negotiationScheduled = true;
      await sleep(5000);
      negotiationScheduled = false;
      if (!connMap.isConnectedConn(conn)) return;
      if (!conn.peerConnection) return;
      if (conn.peerConnection.signalingState === "closed") return;
      const offer = await conn.peerConnection.createOffer();
      await conn.peerConnection.setLocalDescription(offer);
      sendSDP(conn, { offer });
    });
    conn.peerConnection.addEventListener("track", (event: RTCTrackEvent) => {
      if (!connMap.isConnectedConn(conn)) {
        console.warn("received track from non-connected peer, ignoring");
        return;
      }
      const { mid } = event.transceiver;
      const mType = mid && connMap.getRemoteMediaType(conn, mid);
      if (!mType) {
        console.warn("failed to find media type from mid");
        return;
      }
      const connUserId = connMap.getUserId(conn);
      if (connUserId) {
        const info: PeerInfo = {
          userId: connUserId,
          peerIndex: getPeerIndexFromPeerId(conn.peer),
          mediaTypes: connMap.getAcceptingMediaTypes(conn),
        };
        receiveTrack(
          mType,
          setupTrackStopOnLongMute(event.track, conn.peerConnection),
          info
        );
      }
    });
    conn.on("close", () => {
      if (!connMap.delConn(conn)) return;
      const peerIndex = getPeerIndexFromConn(conn);
      updateNetworkStatus({ type: "CONNECTION_CLOSED", peerIndex });
      showConnectedStatus();
      if (connMap.getConnectedPeerIds().length === 0) {
        reInitMyPeer(true);
      } else if (
        guessSeed(conn.peer) &&
        !myPeer.disconnected &&
        !guessSeed(myPeer.id)
      ) {
        const waitSec = 5 * 60 + Math.floor(Math.random() * 5 * 60);
        console.log(
          `Disconnected seed peer: ${peerIndex}, reinit in ${waitSec}sec...`
        );
        setTimeout(reInitMyPeer, waitSec * 1000);
      }
    });
  };

  const reInitMyPeer = async (force?: boolean) => {
    if (myPeer.disconnected) return; // should already be handled
    if (!force) {
      if (guessSeed(myPeer.id)) return;
      let existsAllSeeds = true;
      for (let i = MIN_SEED_PEER_INDEX; i <= MAX_SEED_PEER_INDEX; i += 1) {
        const id = generatePeerId(roomId, i);
        if (!connMap.isConnectedPeerId(id)) {
          existsAllSeeds = false;
          break;
        }
      }
      if (existsAllSeeds) {
        showConnectedStatus();
        return;
      }
    }
    myPeer.destroy();
    myPeer = await initMyPeer();
  };

  const acceptMediaTypes = (mTypes: string[]) => {
    if (disposed) return;
    if (mTypes.length !== mediaTypes.length) {
      connMap.forEachConnectedConns((conn) => {
        const connUserId = connMap.getUserId(conn);
        if (connUserId) {
          const info: PeerInfo = {
            userId: connUserId,
            peerIndex: getPeerIndexFromPeerId(conn.peer),
            mediaTypes: connMap.getAcceptingMediaTypes(conn),
          };
          const transceivers = conn.peerConnection.getTransceivers();
          conn.peerConnection.getReceivers().forEach((receiver) => {
            const transceiver = transceivers.find(
              (t) => t.receiver === receiver
            );
            const mid = transceiver?.mid;
            const mType = mid && connMap.getRemoteMediaType(conn, mid);
            if (!mType) {
              console.warn("failed to find media type from mid");
              return;
            }
            if (
              receiver.track.readyState === "live" &&
              !mediaTypes.includes(mType) &&
              mTypes.includes(mType)
            ) {
              receiveTrack(
                mType,
                setupTrackStopOnLongMute(receiver.track, conn.peerConnection),
                info
              );
            }
          });
        }
      });
    }
    mediaTypes = mTypes;
    broadcastData(null);
  };

  const mediaTypeMap = new Map<
    string,
    {
      stream: MediaStream;
      track: MediaStreamTrack;
    }
  >();

  const getMsid2MediaType = () => {
    const msid2mediaType: Record<string, string> = {};
    mediaTypeMap.forEach(({ stream }, mType) => {
      msid2mediaType[stream.id] = mType;
    });
    return msid2mediaType;
  };

  const addTrack = (mediaType: string, track: MediaStreamTrack) => {
    if (disposed) return;
    if (mediaTypeMap.has(mediaType)) {
      throw new Error(`track is already added for ${mediaType}`);
    }
    const stream = new MediaStream([track]);
    mediaTypeMap.set(mediaType, { stream, track });
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        conn.peerConnection.addTrack(track, stream);
      } catch (e) {
        if (e.name === "InvalidAccessError") {
          // ignore
        } else {
          throw e;
        }
      }
    });
  };

  const removeTrack = (mediaType: string) => {
    if (disposed) return;
    const item = mediaTypeMap.get(mediaType);
    if (!item) {
      console.log("track is already removed for", mediaType);
      return;
    }
    const { track } = item;
    mediaTypeMap.delete(mediaType);
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      const senders = conn.peerConnection?.getSenders() ?? [];
      const sender = senders.find((s) => s.track === track);
      if (sender && conn.peerConnection.signalingState !== "closed") {
        conn.peerConnection.removeTrack(sender);
      }
    });
  };

  const syncAllTracks = (conn: Peer.DataConnection) => {
    const senders = conn.peerConnection?.getSenders() ?? [];
    const acceptingMediaTypes = connMap.getAcceptingMediaTypes(conn);
    acceptingMediaTypes.forEach((mType) => {
      const item = mediaTypeMap.get(mType);
      if (!item) return;
      const { stream, track } = item;
      if (senders.every((sender) => sender.track !== track)) {
        conn.peerConnection.addTrack(track, stream);
      }
    });
    senders.forEach((sender) => {
      if (!sender.track) return;
      const isEffective = acceptingMediaTypes.some(
        (mType) => mediaTypeMap.get(mType)?.track === sender.track
      );
      if (!isEffective && conn.peerConnection.signalingState !== "closed") {
        conn.peerConnection.removeTrack(sender);
      }
    });
    if (senders.some((sender) => sender.track && !sender.transport)) {
      conn.peerConnection.dispatchEvent(new Event("negotiationneeded"));
    }
  };

  const removeAllTracks = (conn: Peer.DataConnection) => {
    const senders = conn.peerConnection?.getSenders() ?? [];
    senders.forEach((sender) => {
      if (sender.track && conn.peerConnection.signalingState !== "closed") {
        conn.peerConnection.removeTrack(sender);
      }
    });
  };

  const dispose = () => {
    disposed = true;
    myPeer.destroy();
  };

  return {
    broadcastData,
    sendData,
    acceptMediaTypes,
    addTrack,
    removeTrack,
    dispose,
  };
};
