/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
      // './global.css'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open-Dyslexic'],
      }
    }
  },
  presets: [require('nativewind/preset')],
  plugins: [],
}