/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#1C1C1E',
          darker: '#121212',
          card: '#2C2C2E',
          green: '#28C76F',
          greenHover: '#22a95f',
          red: '#EA5455',
          text: '#F5F5F7',
          textMuted: '#A0A0A5',
          border: '#3A3A3C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
