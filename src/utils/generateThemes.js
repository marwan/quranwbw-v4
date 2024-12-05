// This function takes an array of color code pairs and generates a structured JSON object with theme data for each pair.
// Each theme includes various CSS class strings for different UI elements, such as background, text, border, icons, inputs, toggles, sliders, and placeholders, using the provided color codes.
function generateThemes() {
	const colorSets = [
		// theme name, primary color, secondary color, optional text color to over the secondary color
		['white', '#FFFFFF', '#000000'],
		['blue', '#02021b', '#c2c2c2'],
		['green', '#001617', '#dddddd'],
		['black', '#000000', '#dddddd'],
		['sepia', '#e9e3d7', '#553c0f'],
		['gold', '#FFFFFF', '#b1901f', '#000000'],
		['coffee', '#20161f', '#c59f60'],
		['silver', '#e1e1e1', '#000000']
	];

	const themes = {};
	const websiteColors = {};

	colorSets.forEach((colors, index) => {
		const [themeName, color1, color2, color3] = colors;
		const themeIndex = index + 1;

		themes[index + 1] = {
			themeName: `${themeName}`,
			bgMain: `bg-[${color1}]`,
			bgSecondary: `bg-[${color2}]`,
			bgSecondaryLight: `bg-[${color2}]/5`,
			bgSecondaryDark: `bg-[${color2}]/5`,
			text: `text-[${color3 !== undefined ? color3 : color2}]`,
			textSecondary: `text-[${color2}]`,
			border: `border-[${color2}]/10`,
			icon: `${color2}`,
			input: `focus:border-[${color2}] focus:ring-[${color2}]`,
			checked: `peer-checked:border-2 peer-checked:border-[${color2}] peer-checked:border-[${color2}]`,
			toggle: `bg-[${color2}]/5 after:bg-[${color1}] peer-checked:bg-[${color2}]`,
			slider: `bg-[${color2}]/10 [&::-webkit-slider-thumb]:!bg-[${color2}]`,
			hover: `hover:bg-[${color2}]/5`,
			via: `via-[${color2}]`,
			placeholder: `placeholder:text-[${color2}]/50`
		};

		websiteColors[themeIndex] = `bg-[${color1}]`;
	});

	window.websiteColors = websiteColors;

	// log all results
	// console.log(`const themes = ${JSON.stringify(themes)}`);
	console.log(themes);
	console.log(window.websiteColors);
}

window.generateThemes = generateThemes;
