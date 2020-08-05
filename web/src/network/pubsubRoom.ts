import Ipfs, { IpfsType, PubsubHandler } from "ipfs";

import { sleep } from "../utils/sleep";
import {
  sha256,
  secureRandomId,
  importCryptoKey,
  encryptBuffer,
  decryptBuffer,
  encrypt,
  decrypt,
} from "../utils/crypto";
import { isObject, hasStringProp, hasObjectProp } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./ipfsUtils";
import { setupTrackStopOnLongMute, loopbackPeerConnection } from "./trackUtils";

const topicsForMediaTypes = new Map<string, string>();

const getTopicForMediaType = async (roomId: string, mediaType: string) => {
  const key = `${roomId} ${mediaType}`;
  let topic = topicsForMediaTypes.get(key);
  if (!topic) {
    topic = (await sha256(key)).slice(0, ROOM_ID_PREFIX_LEN);
    topicsForMediaTypes.set(key, topic);
  }
  return topic;
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
  let myIpfs: IpfsType | null = null;
  let myPeerId: string | null = null;
  const connMap = createConnectionMap();
  if (process.env.NODE_ENV !== "production") {
    (window as any).myConnMap = connMap;
  }
  let mediaTypes: string[] = [];
  let localStream: MediaStream | null = null;

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);
  const cryptoKey = await importCryptoKey(roomId.slice(ROOM_ID_PREFIX_LEN));

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
      if (!myIpfs) {
        console.warn("no myIpfs initialized");
        return;
      }
      await myIpfs.pubsub.publish(topic, encrypted);
    } catch (e) {
      console.error("sendPayload", e);
    }
  };

  const sendPayloadDirectly = async (conn: Connection, payload: unknown) => {
    const topic = `${roomTopic} ${conn.peer}`;
    // HACK somehow, publish doesn't work without this
    if (myIpfs) {
      const noop = () => null;
      await myIpfs.pubsub.subscribe(topic, noop);
      await myIpfs.pubsub.unsubscribe(topic, noop);
    }
    await sendPayload(topic, payload);
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

  const acceptMediaTypes = async (mTypes: string[]) => {
    if (mTypes.includes("faceAudio")) {
      // XXX trial
      if (myIpfs) {
        myIpfs.pubsub.subscribe(
          await getTopicForMediaType(roomId, "faceAudio"),
          async (msg) => {
            if (msg.from === myPeerId) return;
            const conn = connMap.getConn(msg.from);
            if (!conn) {
              console.warn("conn not ready");
              return;
            }
            const info: PeerInfo = {
              userId: conn.userId,
              peerIndex: conn.peerIndex,
              mediaTypes: connMap.getMediaTypes(conn),
            };
            const c: {
              worker: Worker;
            } = conn as any;
            if (!c.worker) {
              const audioCtx = new AudioContext();
              const destination = audioCtx.createMediaStreamDestination();
              let currTime = 0;
              let pending = 0;
              c.worker = new Worker("audio-decoder.js", { type: "module" });
              c.worker.onmessage = (e) => {
                const buffer = new Float32Array(e.data);
                if (!pending) {
                  currTime = audioCtx.currentTime;
                }
                currTime += 0.06; // 60ms
                pending += 1;
                const audioBuffer = audioCtx.createBuffer(1, 2880, 48000);
                const audioBufferSource = audioCtx.createBufferSource();
                audioBuffer.copyToChannel(buffer, 0);
                audioBufferSource.connect(destination);
                audioBufferSource.buffer = audioBuffer;
                audioBufferSource.onended = () => {
                  pending -= 1;
                };
                audioBufferSource.start(currTime);
              };
              const audioTrack = destination.stream.getAudioTracks()[0];
              receiveTrack(await loopbackPeerConnection(audioTrack), info);
            }
            const buf = await decryptBuffer(
              msg.data.buffer,
              msg.data.byteOffset,
              msg.data.byteLength,
              cryptoKey
            );
            c.worker.postMessage([buf], [buf]);
          }
        );
      }
    }
    mediaTypes = mTypes.filter((t) => t !== "faceAudio");
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
    await sendPayloadDirectly(conn, { SDP: sdp });
  };

  const handlePayloadSDP = async (conn: Connection, sdp: unknown) => {
    if (!isObject(sdp)) return;
    if (!hasStringProp(sdp, "negotiationId")) {
      console.warn("negotiationId not found in SDP");
      return;
    }
    const { negotiationId } = sdp;
    if (hasObjectProp(sdp, "offer")) {
      try {
        await conn.recvPc.setRemoteDescription(sdp.offer);
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
        await conn.sendPc.setRemoteDescription(sdp.answer);
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

  const getUserIdFromPayload = (payload: unknown) => {
    if (!isObject(payload)) return null;
    const payloadUserId = (payload as { userId: unknown }).userId;
    if (typeof payloadUserId !== "string") return null;
    return payloadUserId;
  };

  const pubsubHandler: PubsubHandler = async (msg) => {
    if (msg.from === myPeerId) return;
    const payload = await parsePayload(msg.data);
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
    if (
      myIpfs &&
      connMap.size() === 0 &&
      lastInitIpfsTime + 3 * 60 * 1000 < Date.now()
    ) {
      const prevIpfs = myIpfs;
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
    await sleep(5000);
    checkPeers();
  };

  let lastInitIpfsTime = 0;
  const initIpfs = async () => {
    lastInitIpfsTime = Date.now();
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

  const closeIpfs = async (ipfs: IpfsType) => {
    await ipfs.pubsub.unsubscribe(`${roomTopic} ${myPeerId}`, pubsubHandler);
    await ipfs.pubsub.unsubscribe(roomTopic, pubsubHandler);
    await ipfs.stop();
  };

  const trackMediaTypeMap = new WeakMap<MediaStreamTrack, string>();

  const addTrack = async (mediaType: string, track: MediaStreamTrack) => {
    if (!localStream) return;
    if (mediaType === "faceAudio") {
      // XXX trial
      const stream = new MediaStream([track]);
      const audioCtx = new AudioContext();
      const trackSource = audioCtx.createMediaStreamSource(stream);
      await audioCtx.audioWorklet.addModule("audio-encoder.js");
      const audioEncoder = new AudioWorkletNode(audioCtx, "audio-encoder");
      const topic = await getTopicForMediaType(roomId, "faceAudio");
      audioEncoder.port.onmessage = async (event) => {
        const encrypted = await encryptBuffer(event.data, cryptoKey);
        if (myIpfs) {
          myIpfs.pubsub.publish(topic, encrypted);
        }
      };
      trackSource.connect(audioEncoder);
      return;
    }
    trackMediaTypeMap.set(track, mediaType);
    localStream.addTrack(track);
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        if (!localStream) return;
        conn.sendPc.addTrack(track, localStream);
        startNegotiation(conn);
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
        startNegotiation(conn);
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
          startNegotiation(conn);
        }
      });
    }
    senders.forEach((sender) => {
      if (sender.track) {
        const mType = trackMediaTypeMap.get(sender.track);
        if (!mType || !mTypes.includes(mType)) {
          conn.sendPc.removeTrack(sender);
          startNegotiation(conn);
        }
      }
    });
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
