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

  const trackMediaTypeMap = new WeakMap<MediaStreamTrack, string>();

  const addTrack = (mediaType: string, track: MediaStreamTrack) => {
    if (!localStream) return;
    trackMediaTypeMap.set(track, mediaType);
    localStream.addTrack(track);
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        if (!localStream) return;
        conn.sendPc.addTrack(track, localStream);
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
  };

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);

  const showConnectedStatus = () => {
    if (disposed) return;
    const peerIndexList = connMap.getPeerIndexList();
    updateNetworkStatus({ type: "CONNECTED_PEERS", peerIndexList });
  };

  const sendPayload = async (topic: string, payload: unknown) => {
    if (!myIpfs) return;
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
    sendPayload(`${roomTopic} ${conn.peer}`, payload);
  };

  const acceptMediaTypes = (mTypes: string[]) => {
    mediaTypes = mTypes;
    if (mediaTypes.length) {
      if (!localStream) {
        localStream = new MediaStream();
        connMap.forEachConns((conn) => {
          const connUserId = connMap.getUserId(conn);
          if (!connUserId) {
            console.error("conn userId not set", conn);
            return;
          }
          const info: PeerInfo = {
            userId: connUserId,
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
    sendPayload(`${roomTopic} ${conn.peer}`, { SDP: sdp });
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
    sendPayload(`${roomTopic} ${conn.peer}`, { iceCandidate });
  };

  const handlePayloadIceCandidate = async (
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

  const handlePayloadUserId = (conn: Connection, payloadUserId: unknown) => {
    if (typeof payloadUserId === "string") {
      connMap.setUserId(conn, payloadUserId);
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
      handlePayloadIceCandidate(
        conn,
        (payload as { iceCandidate?: unknown }).iceCandidate
      );
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

  const scheduledNegotiation = new WeakMap<Connection, boolean>();
  const initConnection = (peerId: string) => {
    const conn = connMap.addConn(peerId);
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
      const connUserId = connMap.getUserId(conn);
      if (connUserId) {
        const info: PeerInfo = {
          userId: connUserId,
          peerIndex: conn.peerIndex,
          mediaTypes: connMap.getMediaTypes(conn),
        };
        receiveTrack(setupTrackStopOnLongMute(event.track, conn.recvPc), info);
      } else {
        console.error("conn userId not set", conn);
      }
    });
    return conn;
  };

  const pubsubHandler: PubsubHandler = async (msg) => {
    if (msg.from === myPeerId) return;
    let conn = connMap.getConn(msg.from);
    if (conn) {
      await handlePayload(conn, msg.data);
    } else {
      conn = initConnection(msg.from);
      await handlePayload(conn, msg.data);
      notifyNewPeer(conn.peerIndex);
      updateNetworkStatus({
        type: "NEW_CONNECTION",
        peerIndex: conn.peerIndex,
      });
    }
    showConnectedStatus();
  };

  const checkPeers = async () => {
    if (disposed) return;
    const peers = myIpfs ? myIpfs.pubsub.peers(roomTopic) : [];
    connMap.forEachConns((conn) => {
      if (!peers.includes(conn.peer)) {
        connMap.delConn(conn);
        updateNetworkStatus({
          type: "CONNECTION_CLOSED",
          peerIndex: conn.peerIndex,
        });
      }
    });
    if (!peers.length) {
      updateNetworkStatus({ type: "CONNECTING_SEED_PEERS" });
      await sleep(5000);
      checkPeers();
      return;
    }
    if (!connMap.size()) {
      await broadcastData(null);
    }
    await sleep(10 * 1000);
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
    await ipfs.pubsub.subscribe(`${roomTopic} ${myPeerId}`, pubsubHandler);
    myIpfs = ipfs;
    if (process.env.NODE_ENV !== "production") {
      (window as any).myIpfs = myIpfs;
    }
    checkPeers();
  };
  initIpfs();

  const dispose = async () => {
    disposed = true;
    if (myIpfs) {
      await myIpfs.pubsub.unsubscribe(roomTopic, pubsubHandler);
      await myIpfs.pubsub.unsubscribe(
        `${roomTopic} ${myPeerId}`,
        pubsubHandler
      );
      await myIpfs.stop();
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
