const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Metro indexes every file under the monorepo root on startup (watchFolders
// includes the workspace root so pnpm's node_modules/.pnpm store resolves).
// On Windows there is no Watchman, so that crawl is the largest part of a
// cold `expo start`. Nothing the app imports lives in these trees, so keep
// them out of the file map: the editorial corpus, docs, built output, the
// other apps, Supabase, and git internals. Patterns accept both separators.
const blockList = [
  /[\\/]\.git[\\/]/,
  /[\\/]content[\\/]/,
  /[\\/]docs[\\/]/,
  /[\\/]supabase[\\/]/,
  /[\\/]apps[\\/](web|admin)[\\/]/,
  /[\\/]apps[\\/]mobile[\\/]dist(-all|-verify)?[\\/]/,
  /[\\/]apps[\\/]mobile[\\/]\.expo[\\/]/,
];
const existing = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  ...blockList,
];

module.exports = withNativeWind(config, {
  input: "./global.css",
  configPath: "./tailwind.config.js",
  projectRoot: __dirname,
});
