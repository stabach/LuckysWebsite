import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        carbon: "#111111",
        linen: "#f8f6ef",
        champagne: "#d6b35f",
        ember: "#9b6b25",
        graphite: "#2a2a2a"
      },
      boxShadow: {
        gold: "0 22px 80px rgba(214, 179, 95, 0.18)",
        glass: "0 28px 90px rgba(0, 0, 0, 0.55)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        pixel: ["'Press Start 2P'", "var(--font-geist-mono)", "monospace"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"]
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent, rgba(214, 179, 95, 0.92), transparent)",
        "case-glint":
          "linear-gradient(120deg, rgba(255,255,255,0), rgba(255,255,255,0.42), rgba(255,255,255,0))"
      }
    }
  },
  plugins: []
};

export default config;
