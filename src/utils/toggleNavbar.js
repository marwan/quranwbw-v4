import { get } from 'svelte/store';
import { __currentPage, __topNavbarVisible, __bottomNavbarVisible } from '$utils/stores';

let prevScrollpos = getCurrentScroll();
let ticking = false;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
	// only when it's the chapter page and any scrollable elements are not open
	if (get(__currentPage) === 'chapter' && elementsHidden() === true) {
		let currentScrollPos = getCurrentScroll();

		if (!ticking) {
			window.requestAnimationFrame(function () {
				// scrolling up
				if (prevScrollpos > currentScrollPos) {
					__topNavbarVisible.set(true);
					__bottomNavbarVisible.set(true);
				}

				// scrolling down
				else {
					__topNavbarVisible.set(false);
					__bottomNavbarVisible.set(false);
				}

				prevScrollpos = currentScrollPos;
				ticking = false;
			});

			ticking = true;
		}

		// hide dropdowns manually
		try {
			document.getElementById('navigationDropdown').classList.remove('block');
			document.getElementById('navigationDropdown').classList.add('hidden');
			document.getElementById('rightMenuDropdown').classList.remove('block');
			document.getElementById('rightMenuDropdown').classList.add('hidden');
		} catch (error) {
			// ...
		}
	}

	// for all other pages
	else __topNavbarVisible.set(true);
}

function elementsHidden() {
	if (
		document.getElementById('settings-drawer').getAttribute('aria-hidden') === 'true' &&
		document.getElementById('tajweed-rules-modal').getAttribute('aria-hidden') === 'true' &&
		document.getElementById('notes-modal').getAttribute('aria-hidden') === 'true' &&
		document.getElementById('audio-modal').getAttribute('aria-hidden') === 'true' &&
		document.getElementById('token-modal').getAttribute('aria-hidden') === 'true'
	) {
		return true;
	} else return false;
}

function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
