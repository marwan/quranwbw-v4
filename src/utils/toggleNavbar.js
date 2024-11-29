import { get } from 'svelte/store';
import { __currentPage, __topNavbarVisible, __bottomToolbarVisible, __audioSettings } from '$utils/stores';

let prevScrollPos = getCurrentScroll();
let ticking = false;

// Function to toggle top navbar and bottom toolbar on scroll
export function toggleNavbar() {
	const currentPage = get(__currentPage);
	const audioSettings = get(__audioSettings);

	// Check if the current page is 'chapter' or 'mushaf'
	if (currentPage === 'chapter') {
		handleScroll(audioSettings);
	} else if (currentPage !== 'mushaf') {
		showNavbars();
	}
}

// Handle scrolling behavior
function handleScroll(audioSettings) {
	const currentScrollPos = getCurrentScroll();

	if (!ticking) {
		window.requestAnimationFrame(() => {
			if (isScrollingUp(currentScrollPos) || isBottomOfPage()) {
				showNavbars();
			} else {
				hideNavbars(audioSettings);
			}

			prevScrollPos = currentScrollPos;
			ticking = false;
		});

		ticking = true;
	}
}

// Determine if scrolling up
function isScrollingUp(currentScrollPos) {
	return prevScrollPos > currentScrollPos;
}

// Determine if at the bottom of the page
function isBottomOfPage() {
	return window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
}

// Show top navbar and bottom toolbar
function showNavbars() {
	__topNavbarVisible.set(true);
	__bottomToolbarVisible.set(true);
}

// Hide top navbar and bottom toolbar based on audio settings
function hideNavbars(audioSettings) {
	if (window.scrollY > 100) {
		__topNavbarVisible.set(false);
		__bottomToolbarVisible.set(false);
	}

	// Don't hide the bottom toolbar if verse audio is playing
	if (audioSettings.isPlaying && audioSettings.audioType === 'verse') {
		__bottomToolbarVisible.set(true);
	}
}

// Get the current scroll position
function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
