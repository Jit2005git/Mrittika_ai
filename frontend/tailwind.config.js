/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mrittika: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f6f0e4',
          200: '#ecdec9',
          300: '#dfc6a6',
          400: '#ceaa7f',
          500: '#b88d5e',
          600: '#9d714a',
          700: '#7e573c',
          800: '#674734',
          900: '#553b2d',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
