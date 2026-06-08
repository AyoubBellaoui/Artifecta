/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#001A33', 50: '#e6edf5', 100: '#ccd9eb', 200: '#99b4d6', 300: '#668ec2', 400: '#3369ad', 500: '#004d99', 600: '#003d7a', 700: '#002e5c', 800: '#001f3d', 900: '#001A33' },
        saffron: { DEFAULT: '#D99000', 50: '#fdf5e0', 100: '#faeab5', 200: '#f5d466', 300: '#f0bf17', 400: '#D99000', 500: '#b87800', 600: '#966000', 700: '#744900', 800: '#533200', 900: '#311c00' },
        emerald: { DEFAULT: '#065F2E', 50: '#e6f5ee', 100: '#ccebdc', 200: '#99d6b9', 300: '#66c296', 400: '#33ad74', 500: '#07993e', 600: '#067a32', 700: '#065F2E', 800: '#04451f', 900: '#022b13' },
        cream: { DEFAULT: '#F2F0E6', 50: '#fafaf7', 100: '#F2F0E6', 200: '#e8e4d4', 300: '#d4ceb8', 400: '#b8af90', 500: '#9c9068' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderWidth: { '3': '3px' },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
