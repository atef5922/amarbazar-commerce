import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F57224",
        secondary: "#5B4DB8",
        accent: "#FF6B35",
        ink: "#222222",
        soft: "#FFF5F1"
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 35px rgba(34, 34, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
