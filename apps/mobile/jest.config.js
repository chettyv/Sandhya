// Render-level smoke tests only. Unit tests stay on vitest (`pnpm test`);
// this runner mounts real screens through the real router with React
// Native's iOS preset, so a route that renders nothing fails here instead of
// on a phone. Run with `pnpm test:smoke`.

// Packages that ship untranspiled ESM/Flow/TS and must go through Babel.
// pnpm nests them as node_modules/.pnpm/<name>@<ver>_<hash>/node_modules/<name>,
// so the allowlist has to match both the store entry and the inner package,
// on either path separator.
const TRANSFORM = [
  "(jest-)?react-native",
  "@react-native(-community)?",
  "@react-navigation",
  "expo(nent)?",
  "@expo(nent)?",
  "@expo-google-fonts",
  "react-navigation",
  "expo-router",
  "react-native-css-interop",
  "nativewind",
  "react-native-reanimated",
  "react-native-worklets",
  "react-native-gesture-handler",
  "react-native-screens",
  "react-native-safe-area-context",
  "react-native-purchases",
  "@revenuecat",
  "zustand",
  "@tanstack",
  "react-native-url-polyfill",
].join("|");

module.exports = {
  preset: "jest-expo/ios",
  rootDir: __dirname,
  // Keep this relative to rootDir. The <rootDir> token is normalized with
  // mixed Windows separators and can prevent Jest from discovering the file.
  testMatch: ["**/*.smoke.test.tsx"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Only the /mock subpath is mapped: mapping the package root to the same
    // file would give both the same module id and make the explicit mock
    // factory below (and expo-router's) require itself.
    "^react-native-reanimated/mock$": "<rootDir>/jest.reanimated.js",
    "\\.css$": "<rootDir>/jest.empty.js",
  },
  transformIgnorePatterns: [
    // Prefix match, like jest-expo's own preset: "expo" also covers expo-*.
    `node_modules[\\\\/](?!(\\.pnpm[\\\\/])?(${TRANSFORM}))`,
  ],
};
