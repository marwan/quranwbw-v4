<script>
	// Flowbite JS
	import '$lib/flowbite.min.js';

	// default user settings
	import '$utils/userSettings';

	// check and set user settings from URL parameters
	import '$utils/checkURLParameters';

	// check for key presses
	// import "$utils/keyDownHandler";

	import { Router, Route } from 'svelte-routing';
	import { __currentPage, __settingsDrawerHidden } from '$utils/stores';
	import { checkOldBookmarks } from '$utils/checkOldBookmarks';
	import { downloadData } from '$utils/downloadData';

	// views
	import Home from '$views/Home.svelte';
	import Chapter from '$views/Chapter.svelte';
	import Page from '$views/Page.svelte';
	import Supplications from '$views/Supplications.svelte';
	import Bookmarks from '$views/Bookmarks.svelte';
	import Changelogs from '$views/Changelogs.svelte';
	import Issues from '$views/Issues.svelte';
	import About from '$views/About.svelte';
	import Morphology from '$views/Morphology.svelte';
	import Search from '$views/Search.svelte';
	import FAQ from '$views/FAQ.svelte';

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

<Router>
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
		<!-- <BottomAlert /> -->

		<!-- views will be rendered in this div -->
		<div>
			<Route path="/" component={Home} />
			<Route path="/supplications" component={Supplications} />
			<Route path="/duas" component={Supplications} />
			<Route path="/bookmarks" component={Bookmarks} />
			<Route path="/changelogs" component={Changelogs} />
			<Route path="/issues" component={Issues} />
			<Route path="/about" component={About} />
			<Route path="/search" component={Search} />
			<Route path="/faq" component={FAQ} />

			<Route path="/page/:page" let:params>
				<Page page={params.page} />
			</Route>

			<Route path="/morphology/:key" let:params>
				<Morphology key={params.key} />
			</Route>

			<Route path="/:chapter/*" let:params>
				<Chapter chapter={params.chapter} />
			</Route>
		</div>
	</div>
</Router>
