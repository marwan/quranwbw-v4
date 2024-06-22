import { __quranNavigationModalVisible } from '$utils/stores';

// check for key presses
window.addEventListener(
	'keydown',
	(event) => {
		// open Quran nav modal when CTRL+K is pressed
		if (event.ctrlKey && event.code === 'KeyK') {
			event.preventDefault();
			__quranNavigationModalVisible.set(true);
		}
	},
	true
);
