/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./build/**/*.{html,htm,js,ts,jsx,tsx}',
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
