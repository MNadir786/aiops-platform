// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "theme-dark",
    "theme-light",
    "theme-24k",
    "theme-flower"
  ],
  theme: {
    extend: {
      colors: {
        gold: "#ffd700",
        neonPink: "#ff00cc",
        deepPurple: "#333399",
      }
    }
  },
  plugins: []
};
