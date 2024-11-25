<script>
	import Menu from '$svgs/Menu.svelte';
	import Home from '$svgs/Home.svelte';
	import ChevronDown from '$svgs/ChevronDown.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __chapterNumber, __currentPage, __lastRead, __pageURL, __topNavbarVisible, __pageNumber, __morphologyKey, __mushafPageDivisions, __siteNavigationModalVisible, __quranNavigationModalVisible } from '$utils/stores';
	import { term } from '$utils/terminologies';

	let lastReadPage;
	let lastReadJuz;
	let lastReadChapter = 1;
	let lastReadVerse = 1;
	let navbarChapterName;
	let mushafChapters = [];
	let mushafJuz = '...';

	$: navbarClasses = `bg-white fixed w-full z-20 top-0 left-0 border-b border-black/10 text-black print:hidden theme ${$__currentPage === 'home' ? 'hidden' : 'block'}`;
	$: topNavClasses = `${$__topNavbarVisible ? 'block' : 'hidden'} flex flex-row items-center justify-between max-w-screen-lg mx-auto px-4 py-2`;

	// last read
	$: {
		try {
			lastReadPage = document.getElementById($__lastRead.key).getAttribute('data-page');
			lastReadJuz = document.getElementById($__lastRead.key).getAttribute('data-juz');

			if ($__lastRead.hasOwnProperty('key')) {
				lastReadChapter = $__lastRead.key.split(':')[0];
				lastReadVerse = $__lastRead.key.split(':')[1];
			}
		} catch (error) {}
	}

	// revelation
	$: chapterRevelation = quranMetaData[$__chapterNumber].revelation;

	// scroll percentage
	$: chapterProgress = (lastReadVerse / quranMetaData[lastReadChapter].verses) * 100;

	// chapter name in navbar
	$: {
		navbarChapterName = quranMetaData[$__chapterNumber].transliteration;

		// chapters for which the Arabic and English names are same, the navbar should not show both
		// quick fix using raw HTML for now, will improve later...
		if (quranMetaData[$__chapterNumber].transliteration !== quranMetaData[$__chapterNumber].translation) {
			navbarChapterName += `<span class="hidden md:inline-block">&nbsp;(${quranMetaData[$__chapterNumber].translation})</span>`;
		}
	}

	// chapter names for mushaf page
	$: {
		try {
			mushafJuz = `${term('juz')} ${$__mushafPageDivisions.juz}`;
			mushafChapters = [];

			// join all the chapter names
			for (const [key, value] of Object.entries($__mushafPageDivisions.chapters)) {
				mushafChapters.push(quranMetaData[value].transliteration);
			}
		} catch (error) {}
	}
</script>

<nav id="navbar" class={navbarClasses}>
	<div id="top-nav" class={topNavClasses} aria-label="Home">
		<a href="/" class="flex flex-row items-center p-3 cursor-pointer hover:bg-lightGray rounded-3xl" aria-label="Home">
			<Home />
			<span class="text-xs pl-2 hidden md:block">Home</span>
		</a>

		<button class="flex items-center p-3 text-sm border-black/10 w-auto p-2 hover:bg-lightGray rounded-3xl" on:click={() => __quranNavigationModalVisible.set(true)}>
			<!-- display the chapter name on chapter page -->
			{#if $__currentPage === 'chapter'}
				{@html navbarChapterName}
				<ChevronDown />
			{/if}

			<!-- display only the page name for non-chapter page -->
			{#if $__currentPage === 'page'}
				Page {$__pageNumber}
				<ChevronDown />
			{/if}

			<!-- display only the page name for non-chapter page -->
			{#if !['chapter', 'page'].includes($__currentPage)}
				{$__currentPage[0].toUpperCase() + $__currentPage.slice(1)}

				<!-- if it's the morphology page, show morphology key as well -->
				{#if $__currentPage === 'morphology'}
					{$__morphologyKey}
				{/if}
			{/if}
		</button>

		<button class="flex flex-row items-center p-3 cursor-pointer hover:bg-lightGray rounded-3xl" type="button" aria-label="Menu" on:click={() => __siteNavigationModalVisible.set(true)}>
			<span class="text-xs pr-2 hidden md:block">Menu</span>
			<Menu />
		</button>
	</div>

	<!-- mini nav for chapter page -->
	{#if $__currentPage === 'chapter'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t border-black/10 text-xs max-w-screen-lg mx-auto px-6 theme-grayscale">
			<div id="navbar-bottom-chapter-revalation" class="flex flex-row items-center py-2">
				{#if !$__topNavbarVisible}
					<span>{@html navbarChapterName}</span>
				{:else}
					<span>{chapterRevelation === 1 ? 'Meccan' : 'Medinan'}</span>
				{/if}
			</div>
			<div class="flex flex-row items-center py-2">
				<span>{lastReadPage ? `Page ${lastReadPage}` : '...'}</span>
				<span class="px-1 opacity-60">/</span>
				<span>{lastReadJuz ? `${term('juz')} ${lastReadJuz}` : '...'}</span>
			</div>
		</div>

		<div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-black/30 rounded-r-3xl" style="width: {chapterProgress}%" />
	{/if}

	<!-- mini nav for mushaf page -->
	{#if $__currentPage === 'page'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t border-black/10 text-xs max-w-screen-lg mx-auto px-6 theme-grayscale">
			<div class="flex flex-row items-center py-2">
				{#if !$__topNavbarVisible}
					<span>Page {$__pageNumber} -&nbsp;</span>
				{/if}
				<span>{mushafChapters.join(' / ')}</span>
			</div>
			<div class="flex flex-row items-center py-2">{mushafJuz}</div>
		</div>
	{/if}
</nav>

<div class="{$__currentPage === 'chapter' ? 'pb-8' : 'pb-4'} {$__currentPage === 'home' ? 'hidden' : 'block'}"></div>
