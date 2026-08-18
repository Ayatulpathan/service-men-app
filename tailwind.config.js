/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf3',
          100: '#d7f6e3',
          200: '#b2ecc9',
          300: '#7ddba8',
          400: '#43c080',
          500: '#006a4e', // Bangladesh Green
          600: '#005b42',
          700: '#024936',
          800: '#053a2d',
          900: '#063026',
        },
        redaccent: {
          500: '#f42a41', // Bangladesh Red
          600: '#d91d33',
        },
        bkash: {
          DEFAULT: '#e2136e',
          dark: '#b30e55'
        },
        nagad: {
          DEFAULT: '#f7941d',
          dark: '#cf750d'
        },
        rocket: {
          DEFAULT: '#8c3494',
          dark: '#6e2474'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif']
      }
    },
  },
  plugins: [],
}
