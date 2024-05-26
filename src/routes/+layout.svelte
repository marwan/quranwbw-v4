<script>
	// check and set user settings from URL parameters
	import '$utils/checkURLParameters';

	// check for key presses
	// import "$utils/keyDownHandler";

	import { __currentPage, __settingsDrawerHidden, __wakeLockEnabled } from '$utils/stores';
	import { checkOldBookmarks } from '$utils/checkOldBookmarks';
	import Navbar from '$ui/Navbar.svelte';
	import SettingsDrawer from '$ui/SettingsDrawer.svelte';
	import BottomNavbar from '$ui/BottomNavbar.svelte';
	import InitialSetupModal from '$modals/InitialSetupModal.svelte';
	import AudioModal from '$modals/AudioModal.svelte';
	import TajweedRulesModal from '$modals/TajweedRulesModal.svelte';
	import NotesModal from '$modals/NotesModal.svelte';
	import TokenModal from '$modals/TokenModal.svelte';
	import DownloadModal from '$modals/DownloadModal.svelte';
	import { debounce } from '$utils/debounce';
	import { toggleNavbar } from '$utils/toggleNavbar';

	// check old bookmarks for v3 update
	checkOldBookmarks();

	// custom padding depending on page
	$: paddingTop = $__currentPage === 'home' ? 'pt-12' : 'pt-16';
	$: paddingX = $__currentPage === 'page' ? 'px-0 md:px-4' : $__currentPage === 'home' ? 'px-0' : 'px-4';

	// if settings drawer is open, hide body scroll
	$: {
		if ($__settingsDrawerHidden) document.body.classList.remove('overflow-y-hidden');
		else document.body.classList.add('overflow-y-hidden');
	}

	// Create a reference for the Wake Lock.
	let wakeLock = null;

	$: {
		// enabled wakeLock
		if ($__wakeLockEnabled === true) {
			if (wakeLock === null) {
				(async function () {
					try {
						wakeLock = await navigator.wakeLock.request('screen');
						console.log('wake lock enabled');
					} catch (err) {
						console.log(err);
					}
				})();
			}
		}
		// disable wakeLock
		else {
			if (wakeLock !== null) {
				wakeLock.release().then(() => {
					wakeLock = null;
					console.log('wake lock disabled');
				});
			}
		}
	}

	// toggle bottom nav on scroll
	document.getElementsByTagName('body')[0].onscroll = () => {
		debounce(toggleNavbar, 0);
	};
</script>

<div class="max-w-screen-lg mx-auto {paddingTop} pb-24 select-none {paddingX}">
	<!-- include the UI elements -->
	<Navbar />
	<SettingsDrawer />
	<InitialSetupModal />
	<AudioModal />
	<TajweedRulesModal />
	<NotesModal />
	<TokenModal />
	<DownloadModal />
	<BottomNavbar />

	<slot />
</div>
