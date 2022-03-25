import { create as createUntyped } from "ipfs";
import type { create as createFn } from "ipfs-core/types/src/components/index";
import type { Message } from "ipfs-core-types/types/src/pubsub/index";
import IpfsPubSubRoom from "ipfs-pubsub-room";

import { sleep } from "../utils/sleep";
import {
  secureRandomId,
  importCryptoKey,
  encryptStringToChunks,
  decryptStringFromChunks,
} from "../utils/crypto";
import { getWebrtcStarFromUrl } from "../utils/url";
import { isObject, hasStringProp, hasObjectProp } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./ipfsUtils";
import { setupTrackStopOnLongMute } from "./trackUtils";

const create = createUntyped as typeof createFn;

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
  let mediaTypes: readonly string[] = [];

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);
  const cryptoKey = await importCryptoKey(roomId.slice(ROOM_ID_PREFIX_LEN));

  updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex: 0 });
  const myIpfs = await create({
    repo: secureRandomId(),
    config: {
      Addresses: {
        Swarm: [
          getWebrtcStarFromUrl() ||
            "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        ],
      },
      Bootstrap: [], // not sure why this helps
    },
  });
  const myPeerId = (await myIpfs.id()).id;
  const myIpfsPubSubRoom = new IpfsPubSubRoom(myIpfs, roomTopic);
  myIpfsPubSubRoom.on("message", (msg) => pubsubHandler(msg));
  myIpfsPubSubRoom.on("peer joined", () => {
    broadcastData(null); // XXX this is not efficient, we don't need to broadcast
  });
  myIpfsPubSubRoom.on("peer left", (peerId: string) => {
    const conn = connMap.getConn(peerId);
    if (conn) {
      connMap.delConn(conn);
      updateNetworkStatus({
        type: "CONNECTION_CLOSED",
        peerIndex: conn.peerIndex,
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    (window as any).myIpfs = myIpfs;
  }

  const parsePayload = async (encrypted: ArrayBuffer): Promise<unknown> => {
    try {
      const str = await decryptStringFromChunks(encrypted, cryptoKey);
      if (str === null) return undefined;
      const payload = JSON.parse(str);
      console.log("decrypted payload", payload);
      return payload;
    } catch (e) {
      console.info("Error in parsePayload", e, encrypted);
      return undefined;
    }
  };

  const sendPayload = async (topic: string, payload: unknown) => {
    try {
      console.log("payload to encrypt", topic, payload);
      for await (const encrypted of encryptStringToChunks(
        JSON.stringify(payload),
        cryptoKey
      )) {
        myIpfsPubSubRoom.broadcast(encrypted);
      }
    } catch (e) {
      console.error("sendPayload", e);
    }
  };

  const sendPayloadDirectly = async (conn: Connection, payload: unknown) => {
    try {
      for await (const encrypted of encryptStringToChunks(
        JSON.stringify(payload),
        cryptoKey
      )) {
        myIpfsPubSubRoom.sendTo(conn.peer, encrypted);
      }
    } catch (e) {
      console.error("sendPayloadDirectly", e);
    }
  };

  const broadcastData = async (data: unknown) => {
    if (disposed) return;
    const payload = { userId, data, mediaTypes };
    await sendPayload(roomTopic, payload);
  };

  const sendData = async (data: unknown, peerIndex: number) => {
    if (disposed) return;
    const conn = connMap.findConn(peerIndex);
    if (!conn) return;
    const payload = { userId, data, mediaTypes };
    await sendPayloadDirectly(conn, payload);
  };
  if (process.env.NODE_ENV !== "production") {
    (window as any).sendData = sendData;
  }

  const acceptMediaTypes = (mTypes: readonly string[]) => {
    if (disposed) return;
    if (mTypes.length !== mediaTypes.length) {
      connMap.forEachConns((conn) => {
        const info: PeerInfo = {
          userId: conn.userId,
          peerIndex: conn.peerIndex,
          mediaTypes: connMap.getAcceptingMediaTypes(conn),
        };
        const transceivers = conn.recvPc.getTransceivers();
        conn.recvPc.getReceivers().forEach((receiver) => {
          const transceiver = transceivers.find((t) => t.receiver === receiver);
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
              setupTrackStopOnLongMute(receiver.track, conn.recvPc),
              info
            );
          }
        });
      });
    }
    mediaTypes = mTypes;
    broadcastData(null);
  };

  const sendSDP = async (
    conn: Connection,
    sdp:
      | {
          negotiationId: string;
          offer: RTCSessionDescriptionInit;
        }
      | {
          negotiationId: string;
          answer: RTCSessionDescriptionInit;
        }
  ) => {
    const msid2mediaType = getMsid2MediaType();
    await sendPayloadDirectly(conn, { SDP: { ...sdp, msid2mediaType } });
  };

  const handlePayloadSDP = async (conn: Connection, sdp: unknown) => {
    if (!isObject(sdp)) return;
    if (!hasStringProp(sdp, "negotiationId")) {
      console.warn("negotiationId not found in SDP");
      return;
    }
    const { negotiationId } = sdp;
    connMap.registerRemoteMediaType(conn, sdp);
    if (hasObjectProp(sdp, "offer")) {
      try {
        await conn.recvPc.setRemoteDescription(
          sdp.offer as unknown as RTCSessionDescriptionInit // FIXME
        );
        const answer = await conn.recvPc.createAnswer();
        await conn.recvPc.setLocalDescription(answer);
        sendSDP(conn, { negotiationId, answer });
      } catch (e) {
        console.info("handleSDP offer failed", e);
      }
    } else if (hasObjectProp(sdp, "answer")) {
      if (negotiationIdMap.get(conn) === negotiationId) {
        negotiationIdMap.delete(conn);
      }
      try {
        await conn.sendPc.setRemoteDescription(
          sdp.answer as unknown as RTCSessionDescriptionInit // FIXME
        );
      } catch (e) {
        console.info("handleSDP answer failed", e);
      }
    } else {
      console.warn("unknown SDP", sdp);
    }
  };

  const negotiationIdMap = new WeakMap<Connection, string>();
  const startNegotiation = (conn: Connection) => {
    const running = negotiationIdMap.has(conn);
    negotiationIdMap.set(conn, secureRandomId());
    if (running) return;
    const negotiate = async () => {
      const negotiationId = negotiationIdMap.get(conn);
      if (!negotiationId) return;
      if (conn.sendPc.signalingState === "closed") {
        negotiationIdMap.delete(conn);
        return;
      }
      const offer = await conn.sendPc.createOffer();
      await conn.sendPc.setLocalDescription(offer);
      await sendSDP(conn, { negotiationId, offer });
      await sleep(5000);
      negotiate();
    };
    negotiate();
  };

  const sendIce = (
    conn: Connection,
    ice: {
      direction: "send" | "recv";
      candidate: RTCIceCandidate;
    }
  ) => {
    sendPayloadDirectly(conn, { ICE: ice });
  };

  const handlePayloadIce = (conn: Connection, ice: unknown) => {
    if (!isObject(ice)) return;
    if (!hasStringProp(ice, "direction")) {
      console.warn("direction not found in ICE");
      return;
    }
    if (!hasObjectProp(ice, "candidate")) {
      console.warn("candidate not found in ICE");
      return;
    }
    try {
      if (ice.direction === "send") {
        conn.recvPc.addIceCandidate(ice.candidate);
      } else if (ice.direction === "recv") {
        conn.sendPc.addIceCandidate(ice.candidate);
      }
    } catch (e) {
      console.info("handleCandidate failed", e);
    }
  };

  const handlePayloadMediaTypes = async (
    conn: Connection,
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

  const handlePayloadData = (conn: Connection, data: unknown) => {
    const info: PeerInfo = {
      userId: conn.userId,
      peerIndex: conn.peerIndex,
      mediaTypes: connMap.getAcceptingMediaTypes(conn),
    };
    try {
      receiveData(data, info);
    } catch (e) {
      console.warn("receiveData", e);
    }
  };

  const handlePayload = async (conn: Connection, payload: unknown) => {
    try {
      if (!isObject(payload)) return;

      handlePayloadSDP(conn, (payload as { SDP?: unknown }).SDP);
      handlePayloadIce(conn, (payload as { ICE?: unknown }).ICE);
      handlePayloadMediaTypes(
        conn,
        (payload as { mediaTypes?: unknown }).mediaTypes
      );
      handlePayloadData(conn, (payload as { data?: unknown }).data);
    } catch (e) {
      console.info("Error in handlePayload", e, payload);
    }
  };

  const initConnection = (peerId: string, payloadUserId: string) => {
    const conn = connMap.addConn(peerId, payloadUserId);
    conn.sendPc.addEventListener("icecandidate", ({ candidate }) => {
      if (candidate) {
        sendIce(conn, { direction: "send", candidate });
      }
    });
    conn.recvPc.addEventListener("icecandidate", ({ candidate }) => {
      if (candidate) {
        sendIce(conn, { direction: "recv", candidate });
      }
    });
    conn.recvPc.addEventListener("track", (event: RTCTrackEvent) => {
      const { mid } = event.transceiver;
      const mType = mid && connMap.getRemoteMediaType(conn, mid);
      if (!mType) {
        console.warn("failed to find media type from mid");
        return;
      }
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      receiveTrack(
        mType,
        setupTrackStopOnLongMute(event.track, conn.recvPc),
        info
      );
    });
    notifyNewPeer(conn.peerIndex);
    updateNetworkStatus({
      type: "NEW_CONNECTION",
      peerIndex: conn.peerIndex,
    });
    return conn;
  };

  const getUserIdFromPayload = (payload: unknown) => {
    if (!isObject(payload)) return null;
    const payloadUserId = (payload as { userId: unknown }).userId;
    if (typeof payloadUserId !== "string") return null;
    return payloadUserId;
  };

  const pubsubHandler = async (msg: Message) => {
    if (disposed) return;
    if (msg.from === myPeerId) return;
    const payload = await parsePayload(msg.data);
    if (payload === undefined) return;
    const payloadUserId = getUserIdFromPayload(payload);
    let conn = connMap.getConn(msg.from);
    if (!conn) {
      if (payloadUserId) {
        conn = initConnection(msg.from, payloadUserId);
      } else {
        console.warn("cannot initialize conn without user id");
      }
    }
    if (conn) {
      await handlePayload(conn, payload);
    }
    const peerIndexList = connMap.getPeerIndexList();
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
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
        conn.sendPc.addTrack(track, stream);
        startNegotiation(conn);
      } catch (e) {
        if ((e as any).name === "InvalidAccessError") {
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
      const senders = conn.sendPc.getSenders();
      const sender = senders.find((s) => s.track === track);
      if (sender && conn.sendPc.signalingState !== "closed") {
        conn.sendPc.removeTrack(sender);
        startNegotiation(conn);
      }
    });
  };

  const syncAllTracks = (conn: Connection) => {
    const senders = conn.sendPc.getSenders();
    const acceptingMediaTypes = connMap.getAcceptingMediaTypes(conn);
    acceptingMediaTypes.forEach((mType) => {
      const item = mediaTypeMap.get(mType);
      if (!item) return;
      const { stream, track } = item;
      if (senders.every((sender) => sender.track !== track)) {
        conn.sendPc.addTrack(track, stream);
        startNegotiation(conn);
      }
    });
    senders.forEach((sender) => {
      if (!sender.track) return;
      const isEffective = acceptingMediaTypes.some(
        (mType) => mediaTypeMap.get(mType)?.track === sender.track
      );
      if (!isEffective && conn.sendPc.signalingState !== "closed") {
        conn.sendPc.removeTrack(sender);
        startNegotiation(conn);
      }
    });
  };

  const dispose = async () => {
    disposed = true;
    await myIpfsPubSubRoom.leave();
    await myIpfs.stop();
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
