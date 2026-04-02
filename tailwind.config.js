/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FAF6F0',
          100: '#F0E6D6',
          200: '#E0CCAB',
          300: '#C8A96E',
          400: '#B08D4A',
          500: '#8B6914',
          600: '#6B4F10',
          700: '#4E390C',
          800: '#3E2723',
          900: '#2A1A17',
          950: '#1A100E',
        },
        gold: '#C8A96E',
      },
    },
  },
  plugins: [],
}
