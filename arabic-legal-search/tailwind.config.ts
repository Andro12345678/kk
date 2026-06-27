import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["'Noto Naskh Arabic'", "'Cairo'", "serif"],
        display: ["'Amiri'", "serif"],
      },
      colors: {
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D4A017",
          600: "#B8860B",
          700: "#92680A",
          800: "#78520B",
          900: "#5C3D0B",
        },
        ink: {
          50: "#F8F7F4",
          100: "#EEECEA",
          200: "#D8D5D0",
          300: "#B8B3AB",
          400: "#918A80",
          500: "#6B6259",
          600: "#4A4340",
          700: "#2D2926",
          800: "#1A1714",
          900: "#0D0B09",
        },
        parchment: {
          50: "#FDFBF7",
          100: "#F9F5EC",
          200: "#F1E8D4",
          300: "#E4D4B0",
          400: "#D4BC88",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite linear",
        "spin-slow": "spin 3s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(212, 160, 23, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(212, 160, 23, 0.5)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.15) 50%, transparent 100%)",
        "arabesque-pattern": "url('/arabesque.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
