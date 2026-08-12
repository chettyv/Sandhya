import { Platform } from "react-native";

export const colors = {
  ink: "#F7F2E8",
  plum: "#D6C8E6",
  aubergine: "#0F0E0C",
  saffron: "#FFC928",
  gold: "#F6B53B",
  parchment: "#080807",
  paper: "#12110F",
  sand: "#242017",
  sage: "#89B8A1",
  sageSoft: "#1F332B",
  rose: "#EA8C7F",
  roseSoft: "#351C1A",
  muted: "#A9A29A",
  line: "#302C25",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const shadows = {
  card: Platform.select({
    web: { boxShadow: "0 1px 12px rgba(0, 0, 0, 0.35)" },
    default: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 4,
    },
  }),
} as const;

export const layout = {
  maxWidth: 430,
  screenPadding: 16,
  tabBarHeight: 64,
} as const;
