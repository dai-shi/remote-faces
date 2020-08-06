/* eslint no-restricted-globals: off */
/* eslint no-underscore-dangle: off */
/* eslint no-bitwise: off */
/* eslint import/extensions: off */
import Libopus from "./libopus.js";

const FRAME_DURATION = 60;
const SAMPLE_RATE = 48000;
const FRAME_SIZE = (SAMPLE_RATE * FRAME_DURATION) / 1000;

const PACKET_SIZE = 3828;

let audioDecoder;
const getAudioDecoder = async () => {
  if (!audioDecoder) {
    const libopus = await Libopus();
    const decoder = libopus._opus_decoder_create(SAMPLE_RATE, 1);
    const ptrInput = libopus._malloc(PACKET_SIZE);
    const ptrOutput = libopus._malloc(FRAME_SIZE * 4);
    audioDecoder = (input) => {
      libopus.HEAPU8.set(new Uint8Array(input), ptrInput);
      const outputLen = libopus._opus_decode_float(
        decoder,
        ptrInput,
        input.byteLength,
        ptrOutput,
        FRAME_SIZE,
        0
      );
      return libopus.HEAPF32.subarray(
        ptrOutput >> 2,
        (ptrOutput >> 2) + outputLen
      ).slice().buffer;
    };
    // nobody will call this...
    audioDecoder.destroy = () => {
      libopus._free(ptrOutput);
      libopus._free(ptrInput);
      libopus._opus_decoder_destroy(this.decoder);
    };
  }
  return audioDecoder;
};

self.onmessage = async (e) => {
  const decode = await getAudioDecoder();
  const buf = decode(e.data[0]);
  self.postMessage(buf, [buf]);
};
