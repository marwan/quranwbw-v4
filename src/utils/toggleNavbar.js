import { get } from 'svelte/store';
import { __currentPage, __topNavbarVisible, __bottomToolbarVisible, __audioSettings } from '$utils/stores';

let prevScrollpos = getCurrentScroll();
let ticking = false;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
	const audioSettings = get(__audioSettings);

	// only when it's the chapter or mushaf page
	if (['chapter'].includes(get(__currentPage))) {
		let currentScrollPos = getCurrentScroll();

		if (!ticking) {
			window.requestAnimationFrame(function () {
				// scrolling up
				// show both if the user is scrolling up or is at bottom of the screen
				if (prevScrollpos > currentScrollPos || window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
					__topNavbarVisible.set(true);
					__bottomToolbarVisible.set(true);
				}

				// scrolling down
				else {
					if (window.scrollY > 100) {
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

	// for all other pages except mushaf page
	else if (!['mushaf'].includes(get(__currentPage))) {
		__topNavbarVisible.set(true);
		__bottomToolbarVisible.set(true);
	}
}

function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
