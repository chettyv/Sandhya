import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";

// Mirrors the tsconfig "@/*" path alias so src modules (which import bundled
// data via "@/data/...") load under vitest.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url).href),
    },
  },
  test: {
    // Render-level smoke tests need React Native's jest preset; they run via
    // `pnpm test:smoke` (jest.config.js), never under vitest.
    exclude: [...configDefaults.exclude, "smoke/**"],
  },
});
