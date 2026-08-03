import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        cocoa: "#4A3026",
        mocha: "#8A6654",
        rose: "#C98B8B",
        lavender: "#80649B",
        lilac: "#E8DDF0",
        ink: "#2E2622",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(74,48,38,.08)",
      },
    },
  },
  plugins: [],
};

export default config;
