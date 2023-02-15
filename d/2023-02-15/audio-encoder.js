/* global sampleRate */
/* eslint no-underscore-dangle: off */
/* eslint no-bitwise: off */
/* eslint import/extensions: off */
import Libopus from "./libopus.js";

const VOIP = 2048;
const FRAME_DURATION = 60;
const SAMPLE_RATE = 48000;
const FRAME_SIZE = (SAMPLE_RATE * FRAME_DURATION) / 1000;
const RESAMPLE_FRAME_SIZE = (sampleRate * FRAME_DURATION) / 1000;

const OUTPUT_SIZE = 3828;

const RESAMPLE_QUALITY = 3;
const RESAMPLE_SIZE = RESAMPLE_FRAME_SIZE + 128 * 2;

let libopus;

const init = async () => {
  libopus = await Libopus();
};
init();

const isSilent = (pcm) => {
  const muted = pcm.every((x) => x === 0);
  return muted;
};

class AudioEncoder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.encoder = libopus._opus_encoder_create(SAMPLE_RATE, 1, VOIP);
    this.ptrInput = libopus._malloc(FRAME_SIZE * 4);
    this.ptrOutput = libopus._malloc(OUTPUT_SIZE);

    this.resampler = libopus._speex_resampler_init(
      1,
      sampleRate,
      SAMPLE_RATE,
      RESAMPLE_QUALITY
    );
    this.ptrResample = libopus._malloc(RESAMPLE_SIZE * 4);
    this.resampleLen = 0;
    this.ptrResampleInLen = libopus._malloc(4);
    this.ptrResampleOutLen = libopus._malloc(4);
  }

  // nobody will call this...
  destroy() {
    libopus._free(this.ptrResampleOutLen);
    libopus._free(this.ptrResampleInLen);
    libopus._free(this.ptrResample);
    libopus._speex_resampler_destroy(this.resampler);

    libopus._free(this.ptrOutput);
    libopus._free(this.ptrInput);
    libopus._opus_encoder_destroy(this.encoder);
  }

  process(inputs) {
    const input = inputs[0];
    const channel = input[0];
    if (isSilent(channel)) {
      return true;
    }
    libopus.HEAPF32.set(channel, (this.ptrResample >> 2) + this.resampleLen);
    this.resampleLen += channel.length;
    if (this.resampleLen >= RESAMPLE_FRAME_SIZE) {
      libopus.HEAPU32[this.ptrResampleInLen >> 2] = RESAMPLE_FRAME_SIZE;
      libopus.HEAPU32[this.ptrResampleOutLen >> 2] = FRAME_SIZE;
      libopus._speex_resampler_process_interleaved_float(
        this.resampler,
        this.ptrResample,
        this.ptrResampleInLen,
        this.ptrInput,
        this.ptrResampleOutLen
      );
      const resampledLen = libopus.HEAPU32[this.ptrResampleInLen >> 2];
      this.resampleLen -= resampledLen;
      for (let i = 0; i < this.resampleLen; i += 1) {
        libopus.HEAPF32[(this.ptrResample >> 2) + i] =
          libopus.HEAPF32[(this.ptrResample >> 2) + i + resampledLen];
      }

      const outputLen = libopus._opus_encode_float(
        this.encoder,
        this.ptrInput,
        libopus.HEAPU32[this.ptrResampleOutLen >> 2],
        this.ptrOutput,
        OUTPUT_SIZE
      );
      const buf = libopus.HEAPU8.subarray(
        this.ptrOutput,
        this.ptrOutput + outputLen
      ).slice().buffer;
      this.port.postMessage(buf, [buf]);
    }
    return true;
  }
}

registerProcessor("audio-encoder", AudioEncoder);
