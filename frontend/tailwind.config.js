/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ec1c24',
          dark: '#b11218',
          light: '#ff4d55',
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}


