import { selectableThemes } from '$data/options';

// This function takes an array of color code pairs and generates a structured JSON object with theme data for each pair.
// Each theme includes various CSS class strings for different UI elements, such as background, text, border, icons, etc..., using the provided color codes.
function generateThemes() {
	const themes = {};
	const websiteColors = {};
	const cssStyles = [];
	const normalFontPaletteStyles = [];
	const tajweedFontPaletteStyles = [];
	const headerPaletteStyles = [];

	Object.keys(selectableThemes).forEach((key) => {
		const { color1, color2, color3, name } = selectableThemes[key];
		const themeIndex = key;

		themes[themeIndex] = {
			themeName: name,
			bgMain: `bg-[${color1}]`,
			bgSecondary: `bg-[${color2}]`,
			bgSecondaryLight: `bg-[${color2}]/5`,
			bgSecondaryDark: `bg-[${color2}]/15`,
			text: `text-[${color3 !== undefined ? color3 : color2}]`,
			textSecondary: `text-[${color2}]`,
			border: `border-[${color2}]/20`,
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

		const cssComment = `/* ${selectableThemes[themeIndex].name} */`;

		cssStyles.push(`html.theme-${themeIndex} ::-webkit-scrollbar-thumb { background: ${color1}; } ${cssComment}`);
		normalFontPaletteStyles.push(`.theme-${themeIndex} .theme-palette-normal { font-palette: --palette${selectableThemes[themeIndex].paletteNormal}; } ${cssComment}`);
		tajweedFontPaletteStyles.push(`.theme-${themeIndex} .theme-palette-tajweed { font-palette: --palette${selectableThemes[themeIndex].paletteTajweed}; } ${cssComment}`);
		headerPaletteStyles.push(`.theme-${themeIndex} .header { font-palette: --palette${selectableThemes[themeIndex].paletteHeader}; } ${cssComment}`);
	});

	window.websiteColors = websiteColors;

	// log all results
	console.log(themes);
	console.log(window.websiteColors);
	console.log(cssStyles.join('\n'));
	console.log(normalFontPaletteStyles.join('\n'));
	console.log(tajweedFontPaletteStyles.join('\n'));
	console.log(headerPaletteStyles.join('\n'));
}

window.generateThemes = generateThemes;
