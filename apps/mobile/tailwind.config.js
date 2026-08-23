/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#2A211B",
        plum: "#7F6278",
        aubergine: "#5A2E22",
        saffron: "#D97824",
        saffronText: "#A04F17",
        sageText: "#4F6E54",
        roseText: "#A33A2A",
        gold: "#E9B949",
        parchment: "#FCF8EF",
        paper: "#FFFFFF",
        surface: "#FFFFFF",
        surface2: "#FFF4E4",
        sand: "#F4E9DA",
        warm: "#FFF1D6",
        sage: "#6D8C71",
        sageSoft: "#EAF1E9",
        rose: "#B94735",
        roseSoft: "#F9E4DD",
        muted: "#7A6A5D",
        line: "#E8DCCB",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
