import { Platform } from "react-native";

export const colors = {
  ink: "#2A211B",
  plum: "#7F6278",
  aubergine: "#5A2E22",
  saffron: "#D97824",
  gold: "#E9B949",
  parchment: "#FCF8EF",
  paper: "#FFFFFF",
  sand: "#F4E9DA",
  // Warm highlight tint behind selected / featured surfaces.
  warm: "#FFF1D6",
  sage: "#6D8C71",
  sageSoft: "#EAF1E9",
  rose: "#B94735",
  roseSoft: "#F9E4DD",
  muted: "#7A6A5D",
  line: "#E8DCCB",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const shadows = {
  card: Platform.select({
    web: { boxShadow: "0 2px 14px rgba(90, 46, 34, 0.10)" },
    default: {
      shadowColor: colors.aubergine,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
  }),
} as const;

export const fonts = {
  // Serif display face for headings. Georgia ships on iOS and most desktop
  // browsers but not on Android, where an unknown family silently falls back
  // to the sans default; ask for the platform's generic serif there instead.
  display: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }),
} as const;

export const layout = {
  maxWidth: 430,
  screenPadding: 16,
  // Height of the absolute bottom tab bar in app/(tabs)/_layout.tsx. Anything
  // pinned above the tab bar (the Ask composer) or padding content clear of it
  // must use this so the two never drift apart.
  tabBarHeight: Platform.select({ ios: 86, default: 70 }),
} as const;
