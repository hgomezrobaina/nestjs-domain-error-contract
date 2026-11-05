import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// Nest resolves constructor dependencies from decorator metadata, which esbuild
// does not emit. SWC does, so the e2e tests boot the real application.
export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["src/**/*.test.ts"],
    watch: false,
    passWithNoTests: false,
    env: { LOG_LEVEL: "silent" },
  },
});
