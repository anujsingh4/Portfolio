import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#0F0E0D",
        surface: "#1A1816",
        border: "#2A2622",
        text: "#EDEAE4",
        muted: "#6B6560",
        accent: "#D4A24C",
      },
    },
  },
  plugins: [],
};

export default config;
