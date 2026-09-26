import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070f22",
          900: "#0c1b38",
          800: "#132846",
          700: "#1b3760",
        },
        gold: {
          300: "#e6c97a",
          500: "#c9a24a",
          600: "#a68534",
        },
        ivory: "#f3efe6",
        mist: "#b7c0d0",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
