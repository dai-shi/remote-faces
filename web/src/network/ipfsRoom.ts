import Ipfs, { IpfsType, PubsubHandler } from "ipfs";

import { sleep } from "../utils/sleep";
import { secureRandomId, encrypt, decrypt } from "../utils/crypto";
import { isObject } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./ipfsUtils";
import { setupTrackStopOnLongMute } from "./trackUtils";

export const createRoom: CreateRoom = (
  roomId,
  userId,
  updateNetworkStatus,
  notifyNewPeer,
  receiveData,
  receiveTrack
) => {
  let disposed = false;
  let myIpfs: IpfsType | null = null;
  let myPeerId: string | null = null;
  const connMap = createConnectionMap();
  if (process.env.NODE_ENV !== "production") {
    (window as any).myConnMap = connMap;
  }
  let mediaTypes: string[] = [];
  let localStream: MediaStream | null = null;

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIndexList = connMap.getPeerIndexList();
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
  };

  const parsePayload = async (encrypted: ArrayBuffer): Promise<unknown> => {
    try {
      const payload = JSON.parse(
        await decrypt(encrypted, roomId.slice(ROOM_ID_PREFIX_LEN))
      );
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
      const encrypted = await encrypt(
        JSON.stringify(payload),
        roomId.slice(ROOM_ID_PREFIX_LEN)
      );
      console.log("sending encrypted", encrypted.byteLength);
      if (encrypted.byteLength > 262144) {
        console.warn("encrypted message too large, aborting");
        return;
      }
      if (!myIpfs) return;
      await myIpfs.pubsub.publish(topic, encrypted);
    } catch (e) {
      console.error("sendPayload", e);
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
    await sendPayload(roomTopic, { ...payload, to: conn.peer });
    // TODO direct connection
    // await sendPayload(`${roomTopic} ${conn.peer}`, payload);
  };

  const acceptMediaTypes = (mTypes: string[]) => {
    mediaTypes = mTypes;
    if (mediaTypes.length) {
      if (!localStream) {
        localStream = new MediaStream();
        connMap.forEachConns((conn) => {
          const info: PeerInfo = {
            userId: conn.userId,
            peerIndex: conn.peerIndex,
            mediaTypes: connMap.getMediaTypes(conn),
          };
          conn.recvPc.getReceivers().forEach((receiver) => {
            if (receiver.track.readyState !== "live") return;
            receiveTrack(
              setupTrackStopOnLongMute(receiver.track, conn.recvPc),
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
    sendPayload(roomTopic, { SDP: sdp, to: conn.peer });
    // TODO direct connection
    // sendPayload(`${roomTopic} ${conn.peer}`, { SDP: sdp });
  };

  const handlePayloadSDP = async (conn: Connection, sdp: unknown) => {
    if (!isObject(sdp)) return;
    if (isObject((sdp as { offer: unknown }).offer)) {
      const { offer } = sdp as { offer: object };
      try {
        await conn.recvPc.setRemoteDescription(offer as any);
        const answer = await conn.recvPc.createAnswer();
        await conn.recvPc.setLocalDescription(answer);
        sendSDP(conn, { answer });
      } catch (e) {
        console.info("handleSDP offer failed", e);
      }
    } else if (isObject((sdp as { answer: unknown }).answer)) {
      const { answer } = sdp as { answer: object };
      try {
        await conn.sendPc.setRemoteDescription(answer as any);
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

  const sendIceCandidate = (conn: Connection, iceCandidate: unknown) => {
    sendPayload(roomTopic, { iceCandidate, to: conn.peer });
    // TODO direct connection
    // sendPayload(`${roomTopic} ${conn.peer}`, { iceCandidate });
  };

  const handlePayloadIceCandidate = (
    conn: Connection,
    iceCandidate: unknown
  ) => {
    if (!isObject(iceCandidate)) return;
    try {
      conn.recvPc.addIceCandidate(iceCandidate as any);
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
      connMap.setMediaTypes(conn, payloadMediaTypes as string[]);
      await sleep(5000);
      syncAllTracks(conn);
    }
  };

  const handlePayloadData = (conn: Connection, data: unknown) => {
    const info: PeerInfo = {
      userId: conn.userId,
      peerIndex: conn.peerIndex,
      mediaTypes: connMap.getMediaTypes(conn),
    };
    try {
      receiveData(data, info);
    } catch (e) {
      console.warn("receiveData", e);
    }
  };

  const handlePayload = async (conn: Connection, payload: unknown) => {
    if (disposed) return;
    try {
      if (!isObject(payload)) return;

      handlePayloadSDP(conn, (payload as { SDP?: unknown }).SDP);
      handlePayloadIceCandidate(
        conn,
        (payload as { iceCandidate?: unknown }).iceCandidate
      );
      handlePayloadMediaTypes(
        conn,
        (payload as { mediaTypes?: unknown }).mediaTypes
      );
      handlePayloadData(conn, (payload as { data?: unknown }).data);
    } catch (e) {
      console.info("Error in handlePayload", e, payload);
    }
  };

  const scheduledNegotiation = new WeakMap<Connection, boolean>();
  const initConnection = (peerId: string, payloadUserId: string) => {
    const conn = connMap.addConn(peerId, payloadUserId);
    conn.sendPc.addEventListener("icecandidate", (evt) => {
      if (evt.candidate) {
        sendIceCandidate(conn, evt.candidate);
      }
    });
    conn.sendPc.addEventListener("negotiationneeded", async () => {
      if (scheduledNegotiation.has(conn)) return;
      scheduledNegotiation.set(conn, true);
      await sleep(2000);
      scheduledNegotiation.delete(conn);
      const offer = await conn.sendPc.createOffer();
      await conn.sendPc.setLocalDescription(offer);
      sendSDP(conn, { offer });
    });
    conn.recvPc.addEventListener("track", (event: RTCTrackEvent) => {
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getMediaTypes(conn),
      };
      receiveTrack(setupTrackStopOnLongMute(event.track, conn.recvPc), info);
    });
    notifyNewPeer(conn.peerIndex);
    updateNetworkStatus({
      type: "NEW_CONNECTION",
      peerIndex: conn.peerIndex,
    });
    return conn;
  };

  // TODO direct connection
  const getToFromPayload = (payload: unknown) => {
    if (!Object(payload)) return null;
    const payloadTo = (payload as { to: unknown }).to;
    if (typeof payloadTo !== "string") return null;
    return payloadTo;
  };

  const getUserIdFromPayload = (payload: unknown) => {
    if (!Object(payload)) return null;
    const payloadUserId = (payload as { userId: unknown }).userId;
    if (typeof payloadUserId !== "string") return null;
    return payloadUserId;
  };

  const pubsubHandler: PubsubHandler = async (msg) => {
    if (msg.from === myPeerId) return;
    const payload = await parsePayload(msg.data);
    // TODO direct connection
    const payloadTo = getToFromPayload(payload);
    if (payloadTo && payloadTo !== myPeerId) return;
    const payloadUserId = getUserIdFromPayload(payload);
    let conn = connMap.getConn(msg.from);
    if (!conn && payloadUserId) {
      conn = initConnection(msg.from, payloadUserId);
    }
    if (conn) {
      await handlePayload(conn, payload);
    }
    showConnectedStatus();
  };

  const checkPeers = async () => {
    if (disposed) return;
    const peers = myIpfs ? myIpfs.pubsub.peers(roomTopic) : [];
    const prevConnMapSize = connMap.size();
    connMap.forEachConns((conn) => {
      if (!peers.includes(conn.peer)) {
        connMap.delConn(conn);
        updateNetworkStatus({
          type: "CONNECTION_CLOSED",
          peerIndex: conn.peerIndex,
        });
      }
    });
    const prevIpfs = myIpfs;
    if (prevIpfs && prevConnMapSize > 0 && connMap.size() === 0) {
      myIpfs = null;
      myPeerId = null;
      await closeIpfs(prevIpfs);
      await sleep(20 * 1000);
      await initIpfs();
      return;
    }
    if (!peers.length) {
      updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
      await sleep(1000);
      checkPeers();
      return;
    }
    if (!connMap.size()) {
      await broadcastData(null);
    }
    await sleep(5 * 1000);
    checkPeers();
  };

  const initIpfs = async () => {
    updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex: 0 });
    const ipfs: IpfsType = await Ipfs.create({
      repo: secureRandomId(),
      config: {
        Addresses: {
          Swarm: [
            "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
          ],
        },
      },
    });
    myPeerId = (await ipfs.id()).id;
    await ipfs.pubsub.subscribe(roomTopic, pubsubHandler);
    // TODO direct connection
    // await ipfs.pubsub.subscribe(`${roomTopic} ${myPeerId}`, pubsubHandler);
    myIpfs = ipfs;
    if (process.env.NODE_ENV !== "production") {
      (window as any).myIpfs = myIpfs;
    }
    checkPeers();
  };
  initIpfs();

  const closeIpfs = async (ipfs: IpfsType) => {
    await ipfs.pubsub.unsubscribe(roomTopic, pubsubHandler);
    // TODO direct connection
    // await ipfs.pubsub.unsubscribe(`${roomTopic} ${myPeerId}`, pubsubHandler);
    await ipfs.stop();
  };

  const trackMediaTypeMap = new WeakMap<MediaStreamTrack, string>();

  const addTrack = (mediaType: string, track: MediaStreamTrack) => {
    if (!localStream) return;
    trackMediaTypeMap.set(track, mediaType);
    localStream.addTrack(track);
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        if (!localStream) return;
        conn.sendPc.addTrack(track, localStream);
        conn.sendPc.dispatchEvent(new Event("negotiationneeded"));
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
      const senders = conn.sendPc.getSenders();
      const sender = senders.find((s) => s.track === track);
      if (sender) {
        conn.sendPc.removeTrack(sender);
        conn.sendPc.dispatchEvent(new Event("negotiationneeded"));
      }
    });
  };

  const syncAllTracks = (conn: Connection) => {
    const senders = conn.sendPc.getSenders();
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
          conn.sendPc.addTrack(track, localStream);
        }
      });
    }
    senders.forEach((sender) => {
      if (sender.track) {
        const mType = trackMediaTypeMap.get(sender.track);
        if (!mType || !mTypes.includes(mType)) {
          conn.sendPc.removeTrack(sender);
        }
      }
    });
    if (senders.some((sender) => sender.track && !sender.transport)) {
      conn.sendPc.dispatchEvent(new Event("negotiationneeded"));
    }
  };

  const removeAllTracks = (conn: Connection) => {
    const senders = conn.sendPc.getSenders();
    senders.forEach((sender) => {
      if (sender.track) {
        conn.sendPc.removeTrack(sender);
      }
    });
    conn.sendPc.dispatchEvent(new Event("negotiationneeded"));
  };

  const dispose = async () => {
    disposed = true;
    if (myIpfs) {
      closeIpfs(myIpfs);
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
