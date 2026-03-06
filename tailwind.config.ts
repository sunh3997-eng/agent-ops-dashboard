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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "#1a1a2e",
          raised: "#16213e",
          overlay: "#0f3460",
        },
        accent: {
          blue: "#4f8ef7",
          purple: "#9b59b6",
          cyan: "#00d2ff",
          green: "#2ecc71",
          yellow: "#f39c12",
          red: "#e74c3c",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          muted: "rgba(255,255,255,0.04)",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
