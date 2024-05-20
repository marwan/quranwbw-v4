/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/dist/**/*.{js,svelte,ts}'],
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
