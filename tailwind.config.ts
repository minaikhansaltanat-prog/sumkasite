import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B4650",
          soft: "#0E5560",
          text: "#13282B",
          muted: "#5C7478",
        },
        gold: {
          DEFAULT: "#C2410C",
          light: "#EA580C",
        },
        cream: "#F6F2E9",
        line: "#E1E4DE",
        danger: "#C0392B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        ribbon: "0 2px 6px rgba(11,70,80,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
