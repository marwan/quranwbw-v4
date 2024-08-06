<script>
	// check and set user settings from URL parameters
	import '$utils/checkURLParameters';

	// check for key presses
	import '$utils/keyDownHandler';

	import Navbar from '$ui/Navbar.svelte';
	import SettingsDrawer from '$ui/SettingsDrawer/SettingsDrawer.svelte';
	import BottomToolbar from '$ui/BottomToolbar/BottomToolbar.svelte';
	import InitialSetupModal from '$ui/modals/InitialSetupModal.svelte';
	import AudioModal from '$ui/modals/AudioModal.svelte';
	import TajweedRulesModal from '$ui/modals/TajweedRulesModal.svelte';
	import NotesModal from '$ui/modals/NotesModal.svelte';
	import TokenModal from '$ui/modals/TokenModal.svelte';
	import DownloadModal from '$ui/modals/DownloadModal.svelte';
	import TafsirModal from '$ui/modals/TafsirModal.svelte';
	import QuranNavigationModal from '$ui/modals/QuranNavigationModal.svelte';
	import SiteNavigationModal from '$ui/modals/SiteNavigationModal.svelte';
	import SettingsSelectorModal from '$ui/modals/SettingsSelectorModal.svelte';
	import { __websiteOnline, __currentPage, __chapterNumber, __settingsDrawerHidden, __wakeLockEnabled, __userToken, __fontType, __wordTranslation, __verseTranslations, __selectedDisplayId } from '$utils/stores';
	import { checkOldBookmarks } from '$utils/checkOldBookmarks';
	import { debounce } from '$utils/debounce';
	import { toggleNavbar } from '$utils/toggleNavbar';
	import { resetAudioSettings } from '$utils/audioController';
	import { updateSettings } from '$utils/updateSettings';
	// import { downloadSettingsFromCloud } from '$utils/cloudSettings';

	// check old bookmarks for v3 update
	checkOldBookmarks();

	// custom padding depending on page
	$: paddingTop = $__currentPage === 'home' ? 'pt-10' : 'pt-16';
	$: paddingBottom = $__currentPage === 'chapter' ? 'pb-24' : 'pb-8';
	$: paddingX = $__currentPage === 'page' ? 'px-0 md:px-4' : $__currentPage === 'home' ? 'px-0' : 'px-4';

	// if settings drawer is open, hide body scroll
	$: {
		if ($__settingsDrawerHidden) document.body.classList.remove('overflow-y-hidden');
		else document.body.classList.add('overflow-y-hidden');
	}

	// wakelock / screen sleep settings
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

	// fetch settings from cloud whenever there's a change in chapter or page
	// $: if ($__currentPage && $__chapterNumber) downloadSettingsFromCloud();

	// reset chapterDataLoaded if any of the following updates
	$: if ($__currentPage || $__fontType || $__wordTranslation || $__verseTranslations) localStorage.setItem('chapterDataLoaded', false);

	// stop all audio when the page or chapter is changed
	$: if ($__currentPage || $__chapterNumber) resetAudioSettings({ location: 'end' });

	// update display and font type depending on the page
	$: {
		if ($__currentPage === 'page') {
			__selectedDisplayId.set(6); // Mushaf Mode
			if (![2, 3].includes($__fontType)) __fontType.set(2); // v4 font b&w
		} else {
			const userSettings = JSON.parse(localStorage.getItem('userSettings'));

			// update display type
			updateSettings({ type: 'displayType', value: userSettings.displaySettings.displayType });
			__selectedDisplayId.set(userSettings.displaySettings.displayType);

			// update font type
			__fontType.set(userSettings.displaySettings.fontType);
		}
	}

	// toggle bottom nav on scroll
	document.getElementsByTagName('body')[0].onscroll = () => {
		debounce(toggleNavbar, 0);
	};

	// if website is online
	window.addEventListener('online', function () {
		__websiteOnline.set(true);
	});

	// if website is offline
	window.addEventListener('offline', function () {
		__websiteOnline.set(false);
	});
</script>

<div class="max-w-screen-lg mx-auto select-none {paddingTop} {paddingBottom} {paddingX}">
	<!-- include the UI elements -->
	<Navbar />
	<SettingsDrawer />
	<QuranNavigationModal />
	<InitialSetupModal />
	<AudioModal />
	<TajweedRulesModal />
	<NotesModal />
	<TokenModal />
	<DownloadModal />
	<TafsirModal />
	<SiteNavigationModal />
	<SettingsSelectorModal />
	<BottomToolbar />
	<slot />
</div>
