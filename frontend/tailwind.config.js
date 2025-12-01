/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#003366', // A deep, corporate blue
        'brand-gold': '#d4af37', // A rich gold for accents
        'brand-gray': {
          'light': '#f5f5f5', // Light gray for backgrounds
          'DEFAULT': '#a3a3a3', // Default gray for text
          'dark': '#333333',  // Dark gray for headings
        },
        primary: { // Keep primary for existing components, but align with new brand
          50: '#e0e8f0',
          100: '#b3c3d6',
          500: '#003366',
          600: '#002b54',
          700: '#002242',
          900: '#001a33',
        },
        accent: {
          500: '#d4af37',
          600: '#c09e31',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
