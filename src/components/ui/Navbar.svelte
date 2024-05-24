<script>
	import { quranMetaData } from '$data/quranMeta';
	import { __chapterNumber, __currentPage, __lastRead, __pageURL, __topNavbarVisible, __pageNumber, __morphologyKey, __mushafPageDivisions, __settingsDrawerHidden } from '$utils/stores';
	import NavigationDropdown from '$ui/NavigationDropdown.svelte';
	import NavbarChaptersDropdown from '$ui/NavbarChaptersDropdown.svelte';

	// icons
	import Menu from '$svgs/Menu.svelte';
	import Home from '$svgs/Home.svelte';
	import ChevronDown from '$svgs/ChevronDown.svelte';

	// updating the page, juz... when the last read location updates
	let lastReadPage, lastReadJuz;

	$: {
		try {
			lastReadPage = document.getElementById($__lastRead).getAttribute('data-page');
			lastReadJuz = document.getElementById($__lastRead).getAttribute('data-juz');
		} catch (error) {}
	}

	// revelation
	$: chapterRevelation = quranMetaData[$__chapterNumber].revelation;

	// scroll percentage
	$: chapterProgress = ($__lastRead.split(':')[1] / quranMetaData[$__chapterNumber].verses) * 100;

	let navbarChapterName;

	$: {
		navbarChapterName = quranMetaData[$__chapterNumber].transliteration;

		// chapters for which the Arabic and English names are same, the navbar should not show both
		// quick fix using raw HTML for now, will improve later...
		if (quranMetaData[$__chapterNumber].transliteration !== quranMetaData[$__chapterNumber].translation) {
			navbarChapterName += `<span class="hidden md:inline-block">&nbsp;(${quranMetaData[$__chapterNumber].translation})</span>`;
		}
	}

	// for mushaf page bottom nav
	let mushafChapter = '...',
		mushafJuz = '...';

	$: {
		try {
			const chapters = $__mushafPageDivisions.chapters;
			mushafChapter = '';

			// join all the chapter names
			for (const [key, value] of Object.entries(chapters)) {
				mushafChapter += quranMetaData[value].transliteration;
				if (key < Object.keys(chapters).length - 1) mushafChapter += ' / ';
			}

			mushafJuz = `Juz ${$__mushafPageDivisions.juz}`;
		} catch (error) {}
	}
</script>

<nav id="navbar" class="bg-white/60 fixed w-full z-20 top-0 left-0 border-b border-gray-200 text-black print:hidden backdrop-blur-xl theme-grayscale {$__currentPage === 'home' ? 'hidden' : 'block'}">
	<div id="top-nav" class="{$__topNavbarVisible ? 'block' : 'hidden'} flex flex-row items-center justify-between max-w-screen-lg mx-auto px-4 py-2" aria-label="Home">
		<a href="/" class="flex flex-row items-center p-3 cursor-pointer hover:bg-lightGray rounded-3xl dark:hover:bg-slate-700">
			<Home />
			<span class="text-xs pl-2 hidden md:block">Home</span>
		</a>

		<!-- display the chapter name on chapter page -->
		{#if $__currentPage === 'chapter'}
			<button class="flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-lightGray rounded-3xl">
				{@html navbarChapterName}
				<ChevronDown />
			</button>
			<NavbarChaptersDropdown />
		{/if}

		<!-- display only the page name for non-chapter page -->
		{#if $__currentPage !== 'chapter'}
			<button class="flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-lightGray rounded-3xl">
				{$__currentPage[0].toUpperCase() + $__currentPage.slice(1)}

				<!-- if it's the mushaf page, show page number as well -->
				{#if $__currentPage === 'page'}
					{$__pageNumber}
				{/if}

				<!-- if it's the morphology page, show morphology key as well -->
				{#if $__currentPage === 'morphology'}
					{$__morphologyKey}
				{/if}
			</button>
		{/if}

		<button class="flex flex-row items-center p-3 cursor-pointer hover:bg-lightGray rounded-3xl" type="button" aria-label="Menu">
			<span class="text-xs pr-2 hidden md:block">Menu</span>
			<Menu />
		</button>
		<NavigationDropdown />
	</div>

	<!-- mini nav for chapter page -->
	{#if $__currentPage === 'chapter'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6">
			<div id="navbar-bottom-chapter-revalation" class="flex flex-row items-center py-2">
				{#if !$__topNavbarVisible}
					<span>{@html navbarChapterName}</span>
				{:else}
					<span>{chapterRevelation === 1 ? 'Meccan' : 'Medinan'}</span>
				{/if}
			</div>
			<div class="flex flex-row items-center py-2">
				<span>{lastReadPage !== undefined ? `Page ${lastReadPage}` : '...'}</span>
				<span class="px-1 opacity-60">/</span>
				<span>{lastReadJuz !== undefined ? `Juz ${lastReadJuz}` : '...'}</span>
			</div>
		</div>

		<div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-gray-300 transition transition-width transition-slowest ease" style="width: {chapterProgress}%" />
	{/if}

	<!-- mini nav for mushaf page -->
	{#if $__currentPage === 'page'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6">
			<div class="flex flex-row items-center py-2">{mushafChapter}</div>
			<div class="flex flex-row items-center py-2">{mushafJuz}</div>
		</div>
	{/if}
</nav>

<div class="{$__currentPage === 'chapter' ? 'pb-8' : 'pb-4'} {$__currentPage === 'home' ? 'hidden' : 'block'}"></div>
