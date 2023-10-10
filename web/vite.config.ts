import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^node:(.*)/,
        replacement: "./node_modules/@jspm/core/src-browser/$1.js",
      },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "window",
      },
      plugins: [polyfillNode({ polyfills: { fs: true } })],
      target: "es2020",
    },
  },
  base: "./",
  build: {
    target: "es2020",
    outDir: "build",
  },
});
