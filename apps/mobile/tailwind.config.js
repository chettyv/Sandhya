/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#F7F2E8",
        plum: "#D6C8E6",
        aubergine: "#0F0E0C",
        saffron: "#FFC928",
        gold: "#F6B53B",
        parchment: "#080807",
        paper: "#12110F",
        surface: "#12110F",
        surface2: "#1B1915",
        sand: "#242017",
        sage: "#89B8A1",
        rose: "#EA8C7F",
        muted: "#A9A29A",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
