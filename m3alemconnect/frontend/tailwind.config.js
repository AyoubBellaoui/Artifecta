/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8', 100: '#DCE4EC', 200: '#B8C8D8', 300: '#8BA3BC', 400: '#5A7A99',
          500: '#365A7C', 600: '#234563', 700: '#183551', 800: '#0F2A44', 900: '#0A1D30', 950: '#06121F',
          DEFAULT: '#0F2A44',
        },
        saffron: {
          50: '#FDF7EA', 100: '#FAEBC9', 200: '#F4D48E', 300: '#EDBB52', 400: '#E3A21F',
          500: '#D99000', 600: '#B57600', 700: '#8C5B00', 800: '#6A4500', 900: '#4A3000',
          DEFAULT: '#D99000',
        },
        emerald: {
          50: '#ECF6F0', 100: '#D2EADB', 200: '#A6D4B8', 400: '#3E9E66', 500: '#1B8049',
          600: '#0B6B3A', 700: '#095830', 800: '#074425',
          DEFAULT: '#0B6B3A',
        },
        sand: {
          50: '#FAF9F6', 100: '#F3F1EB', 200: '#E7E3DA', 300: '#D5CFC2', 400: '#ADA696',
          500: '#857E70', 600: '#666054', 700: '#4B463E', 800: '#322F2A',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 42, 68, 0.06), 0 1px 1px rgba(15, 42, 68, 0.03)',
        raised: '0 8px 24px -12px rgba(15, 42, 68, 0.22)',
        pop: '0 16px 40px -12px rgba(15, 42, 68, 0.28)',
      },
    },
  },
  plugins: [],
};
