/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#1a1d29',
        'dark-secondary': '#252836',
        'dark-tertiary': '#2d3142',
        'green-primary': '#00e701',
        'green-glow': '#7fff00',
      },
    },
  },
  plugins: [],
}

