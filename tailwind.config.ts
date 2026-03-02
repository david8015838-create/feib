import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#cc0000",
        "primary-dark": "#990000",
        "primary-light": "#ffeded",
        "background-light": "#fcf8f8",
        "background-dark": "#230f0f",
        "surface-light": "#ffffff",
        "surface-dark": "#2d1a1a",
      },
      fontFamily: {
        "display": ["Manrope", "Noto Sans TC", "sans-serif"],
        "body": ["Noto Sans TC", "sans-serif"],
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
