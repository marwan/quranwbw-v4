<script>
	import { Link } from 'svelte-routing';
	import { quranMetaData, pageNumberKeys } from '$data/quranMeta';
	import { __chapterNumber, __currentPage, __lastRead, __pageURL, __topNavbarVisible, __pageNumber, __morphologyKey, __mushafPageDivisions } from '$utils/stores';
	import { toggleModal } from '$utils/toggleModal';
	import { disabledElement, buttonElement } from '$data/commonStyles';

	// icons
	import Menu from '$svgs/Menu.svelte';
	import Home from '$svgs/Home.svelte';
	import ExternalLink from '$svgs/ExternalLink.svelte';
	import ChevronDown from '$svgs/ChevronDown.svelte';

	// classes
	const rightMenuDropdownClasses = 'block w-full text-left px-4 py-2 hover:bg-[#ebebeb] dark:hover:bg-slate-700';

	let gotoVerse = 1,
		gotoPageChapter = 1,
		gotoPageVerse = 1;

	function pageSelector(event) {
		const pageKey = pageNumberKeys[event.target.valueAsNumber - 1].split(':');
		(gotoPageChapter = +pageKey[0]), (gotoPageVerse = +pageKey[1]);
	}

	// updating the page, juz... when the last read location updates
	let lastReadPage, lastReadJuz;

	$: {
		// window.HSStaticMethods.autoInit();

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
		<Link to="/" class="flex flex-row items-center p-3 cursor-pointer bg-[#ebebeb] md:bg-transparent hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700">
			<Home />
			<span class="text-xs pl-2 hidden md:block">Home</span>
		</Link>

		<!-- display the chapter name on chapter page -->
		<button id="navigationDropdownButton" data-dropdown-toggle="navigationDropdown" class="{$__currentPage === 'chapter' ? 'block' : 'hidden'} flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700">
			{@html navbarChapterName}
			<ChevronDown />
		</button>

		<!-- display only the page name for non-chapter page -->
		<button class="{$__currentPage !== 'chapter' ? 'block' : 'hidden'} flex items-center p-3 text-sm border-gray-200 w-auto p-2 hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700">
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

		<div class="flex flex-row items-center p-3 cursor-pointer bg-[#ebebeb] md:bg-transparent hover:bg-[#ebebeb] rounded-3xl dark:hover:bg-slate-700" type="button" id="rightMenuDropdownButton" data-dropdown-toggle="rightMenuDropdown">
			<span class="text-xs pr-2 hidden md:block">Menu</span>
			<Menu />
		</div>
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

		<div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-gray-300 transition-width transition-slowest ease dark:bg-slate-700" style="width: {chapterProgress}%" />
	{/if}

	<!-- mini nav for mushaf page -->
	{#if $__currentPage === 'page'}
		<div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6 dark:border-slate-700">
			<div class="flex flex-row items-center py-2">{mushafChapter}</div>
			<div class="flex flex-row items-center py-2">{mushafJuz}</div>
		</div>
	{/if}

	<!-- navigation list -->
	<div id="navigationDropdown" class="navbar-dropdown z-30 mt-1 border border-gray-200 rounded-3xl shadow-sm bg-white border-y shadow-lg hidden dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
		<div class="flex flex-row space-x-4 justify-between max-h-80 max-w-screen-lg px-4 py-5 mx-auto text-gray-900 dark:text-slate-400 md:px-2">
			<!-- chapter selector -->
			<div class="flex flex-col space-y-2">
				<div class="mx-4 text-xs pb-2 border-b dark:border-slate-700">Chapters</div>
				<ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll md:min-w-fit">
					{#each { length: 114 } as _, chapter}
						<li>
							<button on:click={() => toggleModal('navigationDropdown', 'hide')} class="w-full text-left">
								<Link to="/{chapter + 1}" class="block p-3 rounded-3xl hover:bg-[#ebebeb] dark:hover:bg-slate-700 {$__chapterNumber === chapter + 1 && 'bg-[#ebebeb] dark:bg-slate-700'}">
									<span class="text-sm text-gray-500 dark:text-slate-400">
										{chapter + 1}. {quranMetaData[chapter + 1].transliteration}
										<span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
									</span>
								</Link>
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<!-- verses selector -->
			{#if $__currentPage === 'chapter'}
				<div class="flex flex-col space-y-6">
					<!-- goto verse -->
					<div class="flex flex-col space-y-2">
						<div class="text-xs pb-2 border-b dark:border-slate-700">Go to Verse</div>
						<div class="flex flex-row space-x-2">
							<input
								type="number"
								min="1"
								max={quranMetaData[$__chapterNumber].verses}
								id="gotoVerse"
								on:change={(event) => (gotoVerse = event.target.valueAsNumber)}
								aria-describedby="helper-text-explanation"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="e.g. {Math.floor(Math.random() * (quranMetaData[$__chapterNumber].verses - 1 + 1)) + 1}"
							/>
							<button on:click={() => toggleModal('navigationDropdown', 'hide')}>
								<Link to="/{$__chapterNumber}/{gotoVerse}" on:click={() => __pageURL.set(Math.random())} class={buttonElement}>Go</Link>
							</button>
						</div>
					</div>
					<!-- goto page -->
					<div class="flex flex-col space-y-2">
						<div class="text-xs pb-2 border-b dark:border-slate-700">Go to Page</div>
						<div class="flex flex-row space-x-2">
							<input
								type="number"
								min="1"
								max="604"
								id="gotoPage"
								on:change={(event) => pageSelector(event)}
								aria-describedby="helper-text-explanation"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="e.g. {Math.floor(Math.random() * 604) + 1}"
							/>
							<button on:click={() => toggleModal('navigationDropdown', 'hide')}>
								<Link to="/{gotoPageChapter}/{gotoPageVerse}" on:click={() => __pageURL.set(Math.random())} class={buttonElement}>Go</Link>
							</button>
						</div>
						<div class="flex flex-col text-xs opacity-50">{quranMetaData[gotoPageChapter].transliteration}, {gotoPageChapter}:{gotoPageVerse}</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Dropdown menu -->
	<div id="rightMenuDropdown" class="navbar-dropdown z-30 hidden bg-white divide-y divide-gray-100 rounded-3xl shadow left-[-5%] w-44 dark:bg-slate-800 dark:border-slate-700">
		<ul class="py-2 text-sm text-gray-700 dark:text-slate-400" aria-labelledby="rightMenuDropdownButton">
			<li class={$__currentPage === 'changelogs' || $__currentPage === 'issues' || $__currentPage === 'about' || $__currentPage === 'search' ? disabledElement : ''}>
				<button id="settings-drawer-button" data-drawer-target="settings-drawer" data-drawer-show="settings-drawer" data-drawer-placement="right" aria-controls="settings-drawer" class={rightMenuDropdownClasses}>Settings</button>
			</li>
			<li>
				<Link to="/about">
					<button class={rightMenuDropdownClasses}>About</button>
				</Link>
			</li>
			<!-- <li>
        <Link to="/changelogs">
          <button class={rightMenuDropdownClasses}>Changelogs</button>
        </Link>
      </li>
      <li>
        <Link to="/issues">
          <button class={rightMenuDropdownClasses}>Issues</button>
        </Link>
      </li>
      <li class={disabledElement}>
        <button class={rightMenuDropdownClasses}>Chapter Overview</button>
      </li> -->
			<li>
				<button id="tajweed-modal-button" on:click={() => toggleModal('tajweed-rules-modal', 'show')} class={rightMenuDropdownClasses}>Tajweed Rules</button>
			</li>
			<li>
				<button on:click={() => toggleModal('token-modal', 'show')} class={rightMenuDropdownClasses}>Token Login</button>
			</li>
			<!-- <li class={$__currentPage === "changelogs" || $__currentPage === "issues" || $__currentPage === "about" || $__currentPage === "search" ? disabledElement : ""}>
        <button on:click={() => toggleModal("initial-setup-modal", "show")} class={rightMenuDropdownClasses}>Initial Setup</button>
      </li> -->
			<li>
				<a href="https://legacy.quranwbw.com/" target="_blank" class="flex flex-row items-center justify-between {rightMenuDropdownClasses}">
					Legacy Website
					<ExternalLink />
				</a>
			</li>
			<!-- <li>
        <a href="https://status.quranwbw.com/" target="_blank" class="flex flex-row items-center justify-between {rightMenuDropdownClasses}">
          Status
          <ExternalLink />
        </a>
      </li>
      <li>
        <a href="https://github.com/marwan/quranwbw-svelte/" target="_blank" class="flex flex-row items-center justify-between {rightMenuDropdownClasses}">
          GitHub
          <ExternalLink />
        </a>
      </li> -->
		</ul>
	</div>
</nav>
