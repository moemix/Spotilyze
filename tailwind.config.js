/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0b0f14",
          800: "#101722",
          700: "#182235",
          600: "#223149"
        },
        accent: {
          500: "#1db954",
          400: "#38e07a",
          300: "#86f2b0"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,224,122,0.3), 0 12px 30px rgba(15,23,42,0.5)"
      }
    }
  },
  plugins: []
};
