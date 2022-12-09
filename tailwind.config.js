/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './build/**/*.{html,htm,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'win-desktop': '#008080',
        'win-box': '#c0c0c0',
        'win-box-title': '#010180',
        'win-box-border1': '#fefefe',
        'win-box-border2': '#000000',
        'win-box-text': '#212529',
        'win-box-disabled': '#5c656d',
      },
      fontFamily: {
        'term-mono': '"Major Mono Display", monospace',
        'term-logo': '"Courier New", Courier, monospace',
        'ubuntu': '"Ubuntu", sans-serif',
        'win': '"MS Sans Serif", Tahoma, sans-serif',
        'win-sys': 'System, "MS Sans Serif", Tahoma, sans-serif',
      }
    },
  },
  plugins: [],
}
