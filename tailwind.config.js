/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: '"Major Mono Display", monospace',
        logo: '"Courier New", Courier, monospace',
      }
    },
  },
  plugins: [],
}
