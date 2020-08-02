DIST_FILE=../web/public/libopus.js

OPTS=-O1 --memory-init-file 0 -s NO_FILESYSTEM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0 -s WASM_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_opus_encoder_create', '_opus_encode_float', '_opus_decoder_create', '_opus_decode_float', '_speex_resampler_init', '_speex_resampler_process_interleaved_float', '_speex_resampler_destroy']"

LIBOPUS=opus/.libs/libopus.a

LIBSPEEXDSP=speexdsp/libspeexdsp/.libs/libspeexdsp.a

all: $(DIST_FILE)

$(LIBOPUS):
	cd opus; ./autogen.sh
	cd opus; emconfigure ./configure --disable-extra-programs --disable-doc  --disable-intrinsics
	cd opus; sed -i~ 's/-fstack-protector-strong//g' Makefile
	cd opus; emmake make
	cd opus; rm a.out*

$(LIBSPEEXDSP):
	cd speexdsp; ./autogen.sh
	cd speexdsp; emconfigure ./configure --disable-examples
	cd speexdsp; emmake make
	cd speexdsp; rm a.out*

$(DIST_FILE): $(LIBOPUS) $(LIBSPEEXDSP) Makefile
	emcc $(OPTS) -o $(DIST_FILE) $(LIBOPUS) $(LIBSPEEXDSP)
	echo "\n/*" >> $(DIST_FILE)
	cat opus/COPYING >> $(DIST_FILE)
	echo "\n" >> $(DIST_FILE)
	cat speexdsp/COPYING >> $(DIST_FILE)
	echo "*/" >> $(DIST_FILE)
