import { get } from 'svelte/store';
import { __currentPage, __topNavbarVisible, __bottomNavbarVisible } from '$utils/stores';

let prevScrollpos = getCurrentScroll();
let ticking = false;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
	// only when it's the chapter or mushaf page
	if (['chapter', 'page'].includes(get(__currentPage))) {
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
	}

	// for all other pages
	else __topNavbarVisible.set(true);
}

function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
