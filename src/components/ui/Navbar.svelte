<script>
	import { Link } from 'svelte-routing';
	import { quranMetaData } from '$data/quranMeta';
	import { __chapterNumber, __currentPage, __lastRead, __pageURL, __topNavbarVisible, __pageNumber, __morphologyKey, __mushafPageDivisions, __settingsDrawerHidden } from '$utils/stores';
	import { toggleModal } from '$utils/toggleModal';
	import NavigationDropdown from '$ui/NavigationDropdown.svelte';
	import PointNavigationSelector from '$ui/PointNavigationSelector.svelte';

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

<nav id="navbar" class="{$__currentPage === 'home' ? 'hidden' : 'block'} bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200 text-black print:hidden dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 theme-grayscale">
	<div id="top-nav" class="{$__topNavbarVisible === true ? 'block' : 'hidden'} flex flex-row items-center justify-between max-w-screen-lg mx-auto px-4 py-2">
		<Link to="/" class="flex flex-row items-center p-3 cursor-pointer hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700">
			<Home />
			<span class="text-xs pl-2 hidden md:block">Home</span>
		</Link>

		<!-- display the chapter name on chapter page -->
		<button id="navigationDropdownButton" data-dropdown-toggle="navigationDropdown" class="{$__currentPage === 'chapter' ? 'block' : 'hidden'} flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700">
			{@html navbarChapterName}
			<ChevronDown />
		</button>

		<!-- display only the page name for non-chapter page -->
		<button class="{$__currentPage !== 'chapter' ? 'block' : 'hidden'} flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-[#ebebeb] rounded-3xl">
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

		<button class="flex flex-row items-center p-3 cursor-pointer hover:bg-[#ebebeb] rounded-3xl" type="button" id="rightMenuDropdownButton1" data-dropdown-toggle="rightMenuDropdown1">
			<span class="text-xs pr-2 hidden md:block">Menu</span>
			<Menu />
		</button>
		<NavigationDropdown />
	</div>

	<!-- mini nav for chapter page -->
	{#if $__currentPage === 'chapter'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6 dark:border-slate-700">
			<div id="navbar-bottom-chapter-revalation" class="flex flex-row items-center py-2">
				{#if $__topNavbarVisible === false}
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

		<div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-gray-300 transition-width transition-slowest ease" style="width: {chapterProgress}%" />
	{/if}

	<!-- mini nav for mushaf page -->
	{#if $__currentPage === 'page'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6">
			<div class="flex flex-row items-center py-2">{mushafChapter}</div>
			<div class="flex flex-row items-center py-2">{mushafJuz}</div>
		</div>
	{/if}

	<!-- navigation list -->
	<div id="navigationDropdown" class="navbar-dropdown z-30 mt-1 border border-gray-200 rounded-3xl shadow-sm bg-white border-y shadow-lg hidden">
		<div class="flex flex-col space-y-4 justify-between max-w-screen-lg px-4 py-5 mx-auto text-gray-900 md:px-2">
			<div class="mx-2">
				<PointNavigationSelector width="full" />
			</div>

			<!-- chapter and verse selectors -->
			<div class="flex flex-row space-x-4 max-h-80">
				<!-- chapter selector -->
				<div class="flex flex-col space-y-2 w-full">
					<div class="mx-4 text-xs pb-2 border-b">Chapters</div>
					<ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll">
						{#each { length: 114 } as _, chapter}
							<li>
								<button on:click={() => toggleModal('navigationDropdown', 'hide')} class="w-full text-left">
									<Link to="/{chapter + 1}" class="block p-3 rounded-3xl hover:bg-[#ebebeb] {$__chapterNumber === chapter + 1 && 'bg-[#ebebeb]'}">
										<span class="text-sm text-gray-500">
											{chapter + 1}. {quranMetaData[chapter + 1].transliteration}
											<span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
										</span>
									</Link>
								</button>
							</li>
						{/each}
					</ul>
				</div>

				<!-- verse selector -->
				<div class="flex flex-col space-y-2 w-44">
					<div class="mx-4 text-xs pb-2 border-b">Verse</div>
					<ul id="navbar-verse-list" class="grow basis-1/2 px-2 overflow-y-scroll">
						{#each { length: quranMetaData[$__chapterNumber].verses } as _, verse}
							<li>
								<button on:click={() => toggleModal('navigationDropdown', 'hide')} class="w-full text-left">
									<Link to="/{$__chapterNumber}/{verse + 1}" on:click={() => __pageURL.set(Math.random())} class="block p-3 rounded-3xl hover:bg-[#ebebeb]">
										<span class="text-sm text-gray-500">Verse {verse + 1}</span>
									</Link>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</nav>
