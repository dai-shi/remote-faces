// @ts-ignore
import Ipfs from "ipfs";

import { sleep } from "../utils/sleep";
import { secureRandomId, encrypt, decrypt } from "../utils/crypto";
import { isObject } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./ipfsUtils";
import { setupTrackStopOnLongMute } from "./trackUtils";

type PubsubHandler = (msg: {
  from: string;
  seqno: ArrayBuffer;
  data: ArrayBuffer;
  topicIDs: string[];
}) => void;

type IpfsOptions = {
  timeout: Number;
  signal: AbortSignal;
};

type IpfsType = {
  stop: (options?: IpfsOptions) => Promise<void>;
  pubsub: {
    subscribe: (
      topic: string,
      handler: PubsubHandler,
      options?: IpfsOptions
    ) => Promise<void>;
    unsubscribe: (
      topic: string,
      handler: PubsubHandler,
      options?: IpfsOptions
    ) => Promise<void>;
    publish: (topic: string, data: ArrayBuffer | string) => Promise<void>;
    peers: (topic: string) => string[];
  };
  id: () => Promise<{ id: string }>;
};

export const createRoom: CreateRoom = (
  roomId,
  userId,
  updateNetworkStatus,
  notifyNewPeer,
  receiveData,
  receiveTrack
) => {
  let disposed = false;
  let ipfs: IpfsType | null = null;
  let myPeerId: string | null = null;
  const connMap = createConnectionMap();
  let mediaTypes: string[] = [];
  let localStream: MediaStream | null = null;

  const trackMediaTypeMap = new WeakMap<MediaStreamTrack, string>();

  const addTrack = (mediaType: string, track: MediaStreamTrack) => {
    if (!localStream) return;
    trackMediaTypeMap.set(track, mediaType);
    localStream.addTrack(track);
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        if (!localStream) return;
        conn.peerConnection.addTrack(track, localStream);
      } catch (e) {
        if (e.name === "InvalidAccessError") {
          // ignore
        } else {
          throw e;
        }
      }
    });
  };

  const removeTrack = (mediaType: string, track: MediaStreamTrack) => {
    if (localStream) {
      localStream.removeTrack(track);
    }
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      const senders = conn.peerConnection.getSenders();
      const sender = senders.find((s) => s.track === track);
      if (sender) {
        conn.peerConnection.removeTrack(sender);
      }
    });
  };

  const syncAllTracks = (conn: Connection) => {
    const senders = conn.peerConnection.getSenders();
    const mTypes = connMap.getMediaTypes(conn);
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        const mType = trackMediaTypeMap.get(track);
        if (
          localStream &&
          mType &&
          mTypes.includes(mType) &&
          senders.every((sender) => sender.track !== track)
        ) {
          conn.peerConnection.addTrack(track, localStream);
        }
      });
    }
    senders.forEach((sender) => {
      if (sender.track) {
        const mType = trackMediaTypeMap.get(sender.track);
        if (!mType || !mTypes.includes(mType)) {
          conn.peerConnection.removeTrack(sender);
        }
      }
    });
    if (senders.some((sender) => sender.track && !sender.transport)) {
      conn.peerConnection.dispatchEvent(new Event("negotiationneeded"));
    }
  };

  const removeAllTracks = (conn: Connection) => {
    const senders = conn.peerConnection.getSenders();
    senders.forEach((sender) => {
      if (sender.track) {
        conn.peerConnection.removeTrack(sender);
      }
    });
  };

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIndexList = connMap.getPeerIndexList();
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
  };

  const sendPayload = async (topic: string, payload: unknown) => {
    if (!ipfs) return;
    try {
      const encrypted = await encrypt(
        JSON.stringify(payload),
        roomId.slice(ROOM_ID_PREFIX_LEN)
      );
      ipfs.pubsub.publish(topic, encrypted);
    } catch (e) {
      console.error("sendPayload", e);
    }
  };

  const broadcastData = async (data: unknown) => {
    if (disposed) return;
    const payload = { userId, data, mediaTypes };
    sendPayload(roomTopic, payload);
  };

  const sendData = async (data: unknown, peerIndex: number) => {
    if (disposed) return;
    const conn = connMap.findConn(peerIndex);
    if (!conn) return;
    const connUserId = connMap.getUserId(conn);
    if (!connUserId) return;
    const payload = { userId, data, mediaTypes };
    sendPayload(connUserId, payload);
  };

  const acceptMediaTypes = (mTypes: string[]) => {
    mediaTypes = mTypes;
    if (mediaTypes.length) {
      if (!localStream) {
        localStream = new MediaStream();
        connMap.forEachConns((conn) => {
          const connUserId = connMap.getUserId(conn);
          if (!connUserId) return;
          const info: PeerInfo = {
            userId: connUserId,
            peerIndex: conn.peerIndex,
            mediaTypes: connMap.getMediaTypes(conn),
          };
          conn.peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track.readyState !== "live") return;
            receiveTrack(
              setupTrackStopOnLongMute(receiver.track, conn.peerConnection),
              info
            );
          });
        });
      }
    } else {
      localStream = null;
    }
    broadcastData(null);
  };

  const sendSDP = (conn: Connection, sdp: unknown) => {
    const connUserId = connMap.getUserId(conn);
    if (!connUserId) return;
    sendPayload(connUserId, { SDP: sdp });
  };

  const handlePayloadSDP = async (conn: Connection, sdp: unknown) => {
    if (!isObject(sdp)) return;
    if (isObject((sdp as { offer: unknown }).offer)) {
      const { offer } = sdp as { offer: object };
      try {
        await conn.peerConnection.setRemoteDescription(offer as any);
        syncAllTracks(conn);
        const answer = await conn.peerConnection.createAnswer();
        await conn.peerConnection.setLocalDescription(answer);
        sendSDP(conn, { answer });
      } catch (e) {
        console.info("handleSDP offer failed", e);
      }
    } else if (isObject((sdp as { answer: unknown }).answer)) {
      const { answer } = sdp as { answer: object };
      try {
        await conn.peerConnection.setRemoteDescription(answer as any);
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

  const handlePayloadUserId = (conn: Connection, payloadUserId: unknown) => {
    if (typeof payloadUserId === "string") {
      connMap.setUserId(conn, payloadUserId as string);
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
      connMap.setMediaTypes(conn, payloadMediaTypes as string[]);
      await sleep(5000);
      syncAllTracks(conn);
    }
  };

  const handlePayloadData = (conn: Connection, data: unknown) => {
    const connUserId = connMap.getUserId(conn);
    if (connUserId) {
      const info: PeerInfo = {
        userId: connUserId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getMediaTypes(conn),
      };
      try {
        receiveData(data, info);
      } catch (e) {
        console.warn("receiveData", e);
      }
    }
  };

  const handlePayload = async (conn: Connection, encrypted: ArrayBuffer) => {
    if (disposed) return;
    try {
      const payload = JSON.parse(
        await decrypt(encrypted, roomId.slice(ROOM_ID_PREFIX_LEN))
      );
      console.log("decrypted payload", conn.peer, payload);
      if (!isObject(payload)) return;

      handlePayloadSDP(conn, (payload as { SDP?: unknown }).SDP);
      handlePayloadUserId(conn, (payload as { userId?: unknown }).userId);
      handlePayloadMediaTypes(
        conn,
        (payload as { mediaTypes?: unknown }).mediaTypes
      );
      handlePayloadData(conn, (payload as { data?: unknown }).data);
    } catch (e) {
      console.info("Error in handlePayload", e, encrypted);
    }
  };

  const initConnection = (peerId: string) => {
    const conn = connMap.addConn(peerId);
    notifyNewPeer(conn.peerIndex);
    conn.peerConnection.addEventListener("icegatheringstatechange", () => {
      const pc = conn.peerConnection;
      if (pc.iceGatheringState === "complete") {
        pc.onicecandidate = () => undefined;
      }
    });
    const scheduledNegotiation = new WeakMap<Connection, boolean>();
    conn.peerConnection.addEventListener("negotiationneeded", async () => {
      if (scheduledNegotiation.has(conn)) return;
      scheduledNegotiation.set(conn, true);
      await sleep(2000);
      scheduledNegotiation.delete(conn);
      const offer = await conn.peerConnection.createOffer();
      await conn.peerConnection.setLocalDescription(offer);
      sendSDP(conn, { offer });
    });
    conn.peerConnection.addEventListener("track", (event: RTCTrackEvent) => {
      const connUserId = connMap.getUserId(conn);
      if (connUserId) {
        const info: PeerInfo = {
          userId: connUserId,
          peerIndex: conn.peerIndex,
          mediaTypes: connMap.getMediaTypes(conn),
        };
        receiveTrack(
          setupTrackStopOnLongMute(event.track, conn.peerConnection),
          info
        );
      }
    });
    return conn;
  };

  const gcConnection = () => {
    if (!ipfs) return;
    const peers = ipfs.pubsub.peers(roomTopic);
    connMap.forEachConns((conn) => {
      if (!peers.includes(conn.peer)) {
        connMap.delConn(conn);
        updateNetworkStatus({
          type: "CONNECTION_CLOSED",
          peerIndex: conn.peerIndex,
        });
      }
    });
  };

  const pubsubHandler: PubsubHandler = (msg) => {
    if (msg.from === myPeerId) return;
    let conn = connMap.getConn(msg.from);
    if (!conn) {
      conn = initConnection(msg.from);
      updateNetworkStatus({
        type: "NEW_CONNECTION",
        peerIndex: conn.peerIndex,
      });
    }
    handlePayload(conn, msg.data);
    gcConnection();
    showConnectedStatus();
  };

  const initIpfs = async () => {
    updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex: 0 });
    const instance: IpfsType = await Ipfs.create({
      repo: secureRandomId(),
      config: {
        Addresses: {
          Swarm: [
            "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
          ],
        },
      },
    });
    myPeerId = (await instance.id()).id;
    await instance.pubsub.subscribe(roomTopic, pubsubHandler);
    await instance.pubsub.subscribe(userId, pubsubHandler);
    ipfs = instance;
    if (process.env.NODE_ENV !== "production") {
      (window as any).myIpfs = ipfs;
    }
    const initPeers = async () => {
      updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
      const peers = instance.pubsub.peers(roomTopic);
      if (peers.length) {
        peers.forEach(initConnection);
      } else {
        await sleep(5000);
        initPeers();
      }
    };
    initPeers();
  };
  initIpfs();

  const dispose = async () => {
    disposed = true;
    if (ipfs) {
      await ipfs.pubsub.unsubscribe(roomTopic, pubsubHandler);
      await ipfs.pubsub.unsubscribe(userId, pubsubHandler);
      await ipfs.stop();
    }
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
