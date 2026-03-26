/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '860px',
      xl: '1100px',
    },
    extend: {
      colors: {
        brand: {
          red:   '#dc1e1e',
          dark:  '#111111',
          light: '#f5f3ef',
          gray:  '#1a1a1a',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        arabic:  ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

