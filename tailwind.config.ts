import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        striker: {
          cyan: "#44f4ff",
          magenta: "#ff4ecd",
          violet: "#8b5cf6",
          navy: "#020617",
          panel: "#07111f",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(68, 244, 255, 0.18)",
        magenta: "0 0 60px rgba(255, 78, 205, 0.16)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top left, rgba(68,244,255,.16), transparent 32rem), radial-gradient(circle at top right, rgba(255,78,205,.12), transparent 30rem)",
      },
    },
  },
  plugins: [],
};

export default config;
