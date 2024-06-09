import { get } from 'svelte/store';
import { __currentPage, __topNavbarVisible, __bottomToolbarVisible, __audioSettings } from '$utils/stores';

let prevScrollpos = getCurrentScroll();
let ticking = false;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
	const audioSettings = get(__audioSettings);

	// only when it's the chapter or mushaf page
	if (['chapter', 'page'].includes(get(__currentPage))) {
		let currentScrollPos = getCurrentScroll();

		if (!ticking) {
			window.requestAnimationFrame(function () {
				// scrolling up
				if (prevScrollpos > currentScrollPos) {
					__topNavbarVisible.set(true);
					__bottomToolbarVisible.set(true);
				}

				// scrolling down
				else {
					// show both is the user is at top of screen
					if (window.scrollY === 0) {
						__topNavbarVisible.set(true);
						__bottomToolbarVisible.set(true);
					} else {
						__topNavbarVisible.set(false);
						__bottomToolbarVisible.set(false);
					}

					// don't hide the bottom toolbar if verse audio is playing
					if (audioSettings.isPlaying && audioSettings.audioType === 'verse') __bottomToolbarVisible.set(true);
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
