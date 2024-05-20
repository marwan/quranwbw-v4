<script>
	// check and set user settings from URL parameters
	import '$utils/checkURLParameters';

	// check for key presses
	// import "$utils/keyDownHandler";

	import { __currentPage, __settingsDrawerHidden } from '$utils/stores';
	import { checkOldBookmarks } from '$utils/checkOldBookmarks';
	import { downloadData } from '$utils/downloadData';

	// ui
	import Navbar from '$ui/Navbar.svelte';
	import SettingsDrawer from '$ui/SettingsDrawer.svelte';
	import BottomNavbar from '$ui/BottomNavbar.svelte';
	// import BottomAlert from '$ui/BottomAlert.svelte';
	import InitialSetupModal from '$modals/InitialSetupModal.svelte';
	import AudioModal from '$modals/AudioModal.svelte';
	import TajweedRulesModal from '$modals/TajweedRulesModal.svelte';
	import NotesModal from '$modals/NotesModal.svelte';
	import TokenModal from '$modals/TokenModal.svelte';
	import DownloadModal from '$modals/DownloadModal.svelte';

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
