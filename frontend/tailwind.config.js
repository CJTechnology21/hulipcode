/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        fredoka: ['"Fredoka"', 'sans-serif'],
        montreal: ['"Neue Montreal"', 'sans-serif'],
        figtree: ['Figtree', 'sans-serif'],
      },
    },
  },
  plugins: [],
};