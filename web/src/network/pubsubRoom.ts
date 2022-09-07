import { create as createUntyped } from "ipfs";
import type { create as createFn } from "ipfs-core/types/src/components/index";
import type { Message } from "ipfs-core-types/types/src/pubsub/index";

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
import { getWebrtcStarFromUrl } from "../utils/url";
import { isObject } from "../utils/types";
import { ROOM_ID_PREFIX_LEN, PeerInfo, CreateRoom } from "./common";
import { Connection, createConnectionMap } from "./pubsubUtils";
import {
  loopbackPeerConnection,
  videoTrackToImageConverter,
  imageToVideoTrackConverter,
} from "./trackUtils";

const create = createUntyped as typeof createFn;

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
        await myIpfs.pubsub.publish(topic, new Uint8Array(encrypted), {});
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
    const audioHandler = async (msg: Message) => {
      if (!("from" in msg)) return;
      if (msg.from.toString() === myPeerId.toString()) return;
      const conn = connMap.getConn(msg.from.toString());
      if (!conn) {
        console.warn("conn not ready");
        return;
      }
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      if (!conn.audioWorkers.has(mediaType)) {
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
        conn.audioWorkers.set(mediaType, worker);
        const audioTrack = destination.stream.getAudioTracks()[0];
        receiveTrack(mediaType, await loopbackPeerConnection(audioTrack), info);
        // XXX currently no way to detect track stop
        disposeList.push(() => {
          audioCtx.close();
          audioTrack.dispatchEvent(new Event("ended"));
          worker.terminate();
          conn.audioWorkers.delete(mediaType);
        });
      }
      const bufList = await decryptBufferToChunks(
        msg.data.buffer,
        msg.data.byteOffset,
        msg.data.byteLength,
        cryptoKey
      );
      const worker = conn.audioWorkers.get(mediaType);
      if (worker) {
        bufList.forEach((buf) => {
          worker.postMessage([buf], [buf]);
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
    const videoHandler = async (msg: Message) => {
      if (!("from" in msg)) return;
      if (msg.from.toString() === myPeerId.toString()) return;
      const conn = connMap.getConn(msg.from.toString());
      if (!conn) {
        console.warn("conn not ready");
        return;
      }
      const info: PeerInfo = {
        userId: conn.userId,
        peerIndex: conn.peerIndex,
        mediaTypes: connMap.getAcceptingMediaTypes(conn),
      };
      if (!conn.vidoeSetImages.has(mediaType)) {
        const { videoTrack, setImage } = imageToVideoTrackConverter();
        conn.vidoeSetImages.set(mediaType, setImage);
        receiveTrack(mediaType, videoTrack, info);
        // XXX currently no way to detect track stop
        disposeList.push(() => {
          videoTrack.dispatchEvent(new Event("ended"));
          conn.vidoeSetImages.delete(mediaType);
        });
      }
      const setImage = conn.vidoeSetImages.get(mediaType);
      try {
        const dataURL = await decryptStringFromChunks(msg.data, cryptoKey);
        if (setImage && dataURL) {
          setImage(dataURL);
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

  const acceptMediaTypes = (mTypes: readonly string[]) => {
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

  const handlePayloadMediaTypes = async (
    conn: Connection,
    payloadMediaTypes: unknown
  ) => {
    if (
      Array.isArray(payloadMediaTypes) &&
      payloadMediaTypes.every((x) => typeof x === "string")
    ) {
      connMap.setAcceptingMediaTypes(conn, payloadMediaTypes as string[]);
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
    if (!("from" in msg)) return;
    if (msg.from.toString() === myPeerId.toString()) return;
    const payload = await parsePayload(msg.data);
    if (payload === undefined) return;
    const payloadUserId = getUserIdFromPayload(payload);
    let conn = connMap.getConn(msg.from.toString());
    if (!conn) {
      if (payloadUserId) {
        conn = initConnection(msg.from.toString(), payloadUserId);
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
    const peers = await myIpfs.pubsub.peers(roomTopic);
    connMap.forEachConns((conn) => {
      if (!peers.some((peer) => peer.toString() === conn.peer)) {
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

  const addAudioTrack = async (mediaType: string, track: MediaStreamTrack) => {
    runDispose(trackDisposeMap.get(track));
    const stream = new MediaStream([track]);
    const audioCtx = new AudioContext();
    const trackSource = audioCtx.createMediaStreamSource(stream);
    await audioCtx.audioWorklet.addModule("audio-encoder.js");
    const audioEncoder = new AudioWorkletNode(audioCtx, "audio-encoder");
    const topic = await getTopicForMediaType(roomId, mediaType);
    const bufList: ArrayBuffer[] = [];
    audioEncoder.port.onmessage = async (event) => {
      bufList.push(event.data);
      if (bufList.length < 17) return;
      const encrypted = await encryptBufferFromChunks(
        bufList.splice(0, bufList.length),
        cryptoKey
      );
      myIpfs.pubsub.publish(topic, new Uint8Array(encrypted), {});
    };
    trackSource.connect(audioEncoder);
    trackDisposeMap.set(track, () => {
      audioCtx.close();
    });
  };

  const addVideoTrack = async (mediaType: string, track: MediaStreamTrack) => {
    runDispose(trackDisposeMap.get(track));
    const topic = await getTopicForMediaType(roomId, mediaType);
    const { getImage } = await videoTrackToImageConverter(track);
    let videoDisposed = false;
    const loop = async () => {
      if (videoDisposed) return;
      const dataURL = await getImage();
      if (dataURL) {
        for await (const encrypted of encryptStringToChunks(
          dataURL,
          cryptoKey
        )) {
          if (videoDisposed) return;
          await myIpfs.pubsub.publish(topic, new Uint8Array(encrypted), {});
          await sleep(1000);
        }
      } else {
        await sleep(5000);
      }
      loop();
    };
    loop();
    trackDisposeMap.set(track, () => {
      videoDisposed = true;
    });
  };

  const mediaTypeMap = new Map<string, MediaStreamTrack>();

  const addTrack = async (mediaType: string, track: MediaStreamTrack) => {
    if (disposed) return;
    if (mediaTypeMap.has(mediaType)) {
      throw new Error(`track is already added for ${mediaType}`);
    }
    mediaTypeMap.set(mediaType, track);
    if (mediaType.endsWith("Audio")) {
      addAudioTrack(mediaType, track);
    } else if (mediaType.endsWith("Video")) {
      addVideoTrack(mediaType, track);
    } else {
      throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)");
    }
  };

  const removeTrack = (mediaType: string) => {
    if (disposed) return;
    const track = mediaTypeMap.get(mediaType);
    if (!track) {
      console.log("track is already removed for", mediaType);
      return;
    }
    mediaTypeMap.delete(mediaType);
    runDispose(trackDisposeMap.get(track));
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
