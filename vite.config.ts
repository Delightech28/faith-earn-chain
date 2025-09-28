import nodePolyfills from 'rollup-plugin-node-polyfills';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // All Node.js polyfills removed for clean browser build
    },
  },
  // Node.js polyfills removed from optimizeDeps
  // Node.js polyfills removed from define
  build: {
    sourcemap: true,
    rollupOptions: {
      // Node polyfills removed due to Vite plugin incompatibility
      plugins: []
    }
  },
}));
