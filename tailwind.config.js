/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte}', './public/**/*.{html,js,svelte}', 'node_modules/preline/dist/*.js'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				...colors,
				lightGray: '#ebebeb'
			}
		}
	},
	plugins: [require('flowbite/plugin')]
};
