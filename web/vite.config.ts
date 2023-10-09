import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "window",
      },
      plugins: [polyfillNode()],
      target: "es2020",
    },
  },
  base: "./",
  build: {
    target: "es2020",
    outDir: "build",
  },
});
