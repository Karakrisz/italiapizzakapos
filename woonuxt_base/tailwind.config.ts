/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'digital-seed': '#1AC78D',
        'black': '#1D1E19',
        'pizza-red': '#B84C37',
        'pizza-yellow': '#FFF8ED',
        'grey': '#717171',
        'pizza-green': '#486854',
        'Primary': '#B84C37',
        'Dark': '#1D1E19',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        titoli: ['Titoli Di Testa', 'sans-serif'],
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

