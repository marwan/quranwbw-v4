// https://stackoverflow.com/a/74027426
export function loadFont(name, url) {
	return new Promise((resolve, reject) => {
		const myFont = new FontFace(name, `url(${url})`);
		myFont
			.load()
			.then(() => {
				document.fonts.add(myFont);
				const el = document.createElement('DIV');
				el.style.fontFamily = name;
				resolve();
			})
			.catch(() => reject());
	});
}
