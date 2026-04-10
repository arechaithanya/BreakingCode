/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        devmind: {
          cyan: "#00FFFF",
          purple: "#A020F0",
          dark: "#050505",
          glass: "rgba(255, 255, 255, 0.05)",
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 255, 0.2), 0 0 10px rgba(0, 255, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(160, 32, 240, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
