/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './build/**/*.{html,htm,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'term-mono': '"Major Mono Display", monospace',
        'term-logo': '"Courier New", Courier, monospace',
        'ubuntu': '"Ubuntu", sans-serif',
      }
    },
  },
  plugins: [],
}
