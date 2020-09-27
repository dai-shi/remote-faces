import Ipfs, { PubsubHandler } from "ipfs";

import { sleep } from "../utils/sleep";
import {
  sha256,
  secureRandomId,
  importCryptoKey,
  encryptStringToChunks,
  decryptStringFromChunks,
  encryptBufferFromChunks,
  decryptBufferToChunks,
} from "../utils/crypto";
import { isObject, hasStringProp, hasObjectProp } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./ipfsUtils";
import {
  setupTrackStopOnLongMute,
  loopbackPeerConnection,
  videoTrackToImageConverter,
  imageToVideoTrackConverter,
} from "./trackUtils";

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
  const connMap = createConnectionMap();
  if (process.env.NODE_ENV !== "production") {
    (window as any).myConnMap = connMap;
  }
  let mediaTypes: string[] = [];

  const roomTopic = roomId.slice(0, ROOM_ID_PREFIX_LEN);
  const cryptoKey = await importCryptoKey(roomId.slice(ROOM_ID_PREFIX_LEN));

  updateNetworkStatus({ type: "INITIALIZING_PEER", peerIndex: 0 });
  const myIpfs = await Ipfs.create({
    repo: secureRandomId(),
    config: {
      Addresses: {
        Swarm: [
          "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        ],
      },
    },
  });
  const myPeerId = (await myIpfs.id()).id;
  await myIpfs.pubsub.subscribe(roomTopic, (msg) => pubsubHandler(msg));
  await myIpfs.pubsub.subscribe(`${roomTopic} ${myPeerId}`, (msg) =>
    pubsubHandler(msg)
  );
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
        await myIpfs.pubsub.publish(topic, encrypted);
      }
    } catch (e) {
      console.error("sendPayload", e);
    }
  };

  const sendPayloadDirectly = async (conn: Connection, payload: unknown) => {
    const topic = `${roomTopic} ${conn.peer}`;
    // XXX this doesn't seem to work in ipfs v0.48.0
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

  const mediaTypeDisposeMap = new Map<string, (() => void)[]>();

  const acceptAudioMedia = async (mediaType: string) => {
    const disposeList: (() => void)[] = [];
    mediaTypeDisposeMap.set(mediaType, disposeList);
    const topic = await getTopicForMediaType(roomId, mediaType);
    const audioHandler: PubsubHandler = async (msg) => {
      if (msg.from === myPeerId) return;
      const conn = connMap.getConn(msg.from);
      if (!conn) {
        console.warn("conn not ready");
        return;
      }
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      const c: {
        worker: Worker;
      } = conn as any; // TODO do it more cleanly
      if (!c.worker) {
        const audioCtx = new AudioContext();
        const destination = audioCtx.createMediaStreamDestination();
        let currTime = 0;
        let pending = 0;
        const worker = new Worker("audio-decoder.js", { type: "module" });
        worker.onmessage = (e) => {
          const buffer = new Float32Array(e.data);
          if (!pending) {
            currTime = audioCtx.currentTime;
          }
          currTime += 0.06; // 60ms
          pending += 1;
          const audioBuffer = audioCtx.createBuffer(1, 2880, 48000);
          audioBuffer.copyToChannel(buffer, 0);
          const audioBufferSource = audioCtx.createBufferSource();
          audioBufferSource.buffer = audioBuffer;
          audioBufferSource.connect(destination);
          audioBufferSource.onended = () => {
            pending -= 1;
          };
          audioBufferSource.start(currTime);
        };
        c.worker = worker;
        const audioTrack = destination.stream.getAudioTracks()[0];
        receiveTrack(mediaType, await loopbackPeerConnection(audioTrack), info);
        disposeList.push(() => {
          audioCtx.close();
          audioTrack.dispatchEvent(new Event("ended"));
          worker.terminate();
          if (c.worker === worker) {
            delete c.worker;
          }
        });
      }
      const bufList = await decryptBufferToChunks(
        msg.data.buffer,
        msg.data.byteOffset,
        msg.data.byteLength,
        cryptoKey
      );
      if (c.worker) {
        bufList.forEach((buf) => {
          c.worker.postMessage([buf], [buf]);
        });
      }
    };
    myIpfs.pubsub.subscribe(topic, audioHandler);
    disposeList.unshift(() => {
      myIpfs.pubsub.unsubscribe(topic, audioHandler);
    });
  };

  const acceptVideoMedia = async (mediaType: string) => {
    const disposeList: (() => void)[] = [];
    mediaTypeDisposeMap.set(mediaType, disposeList);
    const topic = await getTopicForMediaType(roomId, mediaType);
    const videoHandler: PubsubHandler = async (msg) => {
      if (msg.from === myPeerId) return;
      const conn = connMap.getConn(msg.from);
      if (!conn) {
        console.warn("conn not ready");
        return;
      }
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      const c: {
        setImage: (s: string) => void;
      } = conn as any; // TODO do it more cleanly
      if (!c.setImage) {
        const { videoTrack, setImage } = imageToVideoTrackConverter();
        c.setImage = setImage;
        receiveTrack(mediaType, videoTrack, info);
        disposeList.push(() => {
          videoTrack.dispatchEvent(new Event("ended"));
        });
      }
      try {
        const dataURL = await decryptStringFromChunks(msg.data, cryptoKey);
        if (dataURL) {
          c.setImage(dataURL);
        }
      } catch (e) {
        console.info("Error in parse for video media", e);
      }
    };
    myIpfs.pubsub.subscribe(topic, videoHandler);
    disposeList.unshift(() => {
      myIpfs.pubsub.unsubscribe(topic, videoHandler);
    });
  };

  const acceptMediaTypes = async (mTypes: string[]) => {
    if (disposed) return;
    mediaTypeDisposeMap.forEach((disposeList, existingMediaType) => {
      if (!mTypes.includes(existingMediaType)) {
        disposeList.forEach((dispose) => dispose());
        mediaTypeDisposeMap.delete(existingMediaType);
      }
    });
    mTypes.forEach((mediaType) => {
      if (mediaTypeDisposeMap.has(mediaType)) return;
      if (mediaType.endsWith("Audio")) {
        acceptAudioMedia(mediaType);
      } else if (mediaType.endsWith("Video")) {
        acceptVideoMedia(mediaType);
      } else {
        throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)");
      }
    });
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
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      receiveTrack(
        "TODO",
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

  const pubsubHandler: PubsubHandler = async (msg) => {
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

  const checkPeers = async () => {
    if (disposed) return;
    const peers = myIpfs.pubsub.peers(roomTopic);
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
  checkPeers();

  const trackDisposeMap = new WeakMap<MediaStreamTrack, () => void>();
  const runDispose = (dispose?: () => void) => {
    if (dispose) {
      dispose();
    }
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

  const addTrack = async (mediaType: string, track: MediaStreamTrack) => {
    if (disposed) return;
    if (mediaTypeMap.has(mediaType)) {
      throw new Error(`track is already added for ${mediaType}`);
    }
    const stream = new MediaStream([track]);
    mediaTypeMap.set(mediaType, { stream, track });
    if (mediaType === "faceAudio") {
      // XXX experimental
      runDispose(trackDisposeMap.get(track));
      const audioCtx = new AudioContext();
      const trackSource = audioCtx.createMediaStreamSource(stream);
      await audioCtx.audioWorklet.addModule("audio-encoder.js");
      const audioEncoder = new AudioWorkletNode(audioCtx, "audio-encoder");
      const topic = await getTopicForMediaType(roomId, "faceAudio");
      const bufList: ArrayBuffer[] = [];
      audioEncoder.port.onmessage = async (event) => {
        bufList.push(event.data);
        if (bufList.length < 40) return;
        const encrypted = await encryptBufferFromChunks(
          bufList.splice(0, bufList.length),
          cryptoKey
        );
        myIpfs.pubsub.publish(topic, encrypted);
      };
      trackSource.connect(audioEncoder);
      trackDisposeMap.set(track, () => {
        audioCtx.close();
      });
      return;
    }
    if (mediaType === "faceVideo") {
      // XXX experimental
      runDispose(trackDisposeMap.get(track));
      const topic = await getTopicForMediaType(roomId, "faceVideo");
      const { getImage } = await videoTrackToImageConverter(track);
      let faceVideoDisposed = false;
      const loop = async () => {
        if (faceVideoDisposed) return;
        const dataURL = await getImage();
        if (dataURL) {
          for await (const encrypted of encryptStringToChunks(
            dataURL,
            cryptoKey
          )) {
            if (faceVideoDisposed) return;
            await myIpfs.pubsub.publish(topic, encrypted);
            await sleep(1000);
          }
        }
        loop();
      };
      loop();
      trackDisposeMap.set(track, () => {
        faceVideoDisposed = true;
      });
      return;
    }
    connMap.forEachConnsAcceptingMedia(mediaType, (conn) => {
      try {
        conn.sendPc.addTrack(track, stream);
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

  const removeTrack = (mediaType: string) => {
    if (disposed) return;
    const item = mediaTypeMap.get(mediaType);
    if (!item) {
      console.log("track is already removed for", mediaType);
      return;
    }
    const { track } = item;
    mediaTypeMap.delete(mediaType);
    if (mediaType === "faceAudio" || mediaType === "faceVideo") {
      // XXX experimental
      runDispose(trackDisposeMap.get(track));
      return;
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
      if (!isEffective) {
        conn.sendPc.removeTrack(sender);
        startNegotiation(conn);
      }
    });
  };

  const dispose = async () => {
    disposed = true;
    await myIpfs.pubsub.unsubscribe(`${roomTopic} ${myPeerId}`, pubsubHandler);
    await myIpfs.pubsub.unsubscribe(roomTopic, pubsubHandler);
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
