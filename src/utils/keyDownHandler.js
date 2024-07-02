import { toggleQuranNavigation } from '$utils/toggleQuranNavigation';

// check for key presses
window.addEventListener(
	'keydown',
	(event) => {
		// open Quran nav modal when CTRL+K is pressed
		if (event.ctrlKey && event.code === 'KeyK') {
			event.preventDefault();
			toggleQuranNavigation('show');
		}
	},
	true
);
