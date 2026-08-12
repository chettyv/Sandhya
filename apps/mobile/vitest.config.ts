import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Mirrors the tsconfig "@/*" path alias so src modules (which import bundled
// data via "@/data/...") load under vitest.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
