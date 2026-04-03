import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display": [
          "clamp(1.95rem, 1.55rem + 1.35vw, 3.05rem)",
          { lineHeight: "1.15", letterSpacing: "-0.012em", fontWeight: "600" },
        ],
        h1: [
          "clamp(1.75rem, 1.4rem + 1vw, 2.45rem)",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.45rem, 1.28rem + 0.6vw, 1.9rem)",
          { lineHeight: "1.28", letterSpacing: "-0.008em", fontWeight: "500" },
        ],
        h3: [
          "clamp(1.2rem, 1.08rem + 0.35vw, 1.45rem)",
          { lineHeight: "1.35", letterSpacing: "-0.006em", fontWeight: "500" },
        ],
        "body-lg": ["1.05rem", { lineHeight: "1.62", fontWeight: "500" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.55", fontWeight: "400" }],
      },
      lineHeight: {
        heading: "1.25",
        body: "1.62",
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--border) / 0.5), 0 16px 36px -28px hsl(0 0% 0% / 0.78)",
      },
      backgroundImage: {
        "hero-ink": "linear-gradient(145deg, hsl(var(--bg)) 0%, hsl(var(--bg-2)) 45%, hsl(var(--bg)) 100%)",
      },
      letterSpacing: {
        display: "-0.012em",
        eyebrow: "0.02em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
