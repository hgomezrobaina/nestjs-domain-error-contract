import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: [{ find: "@modules", replacement: path.resolve(import.meta.dirname, "src/modules") }],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    watch: false,
    passWithNoTests: false,
  },
})
