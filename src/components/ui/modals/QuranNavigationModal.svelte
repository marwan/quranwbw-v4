<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Input from '$ui/flowbite-svelte/forms/Input.svelte';
	import CloseButton from '$ui/flowbite-svelte/utils/CloseButton.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Search from '$svgs/Search.svelte';
	import { quranMetaData, startPageOfChapters, pageNumberKeys, juzNumberKeys } from '$data/quranMeta';
	import { buttonClasses } from '$data/commonClasses';
	import { __chapterNumber, __pageURL, __currentPage, __pageNumber, __quranNavigationModalVisible } from '$utils/stores';
	import { inview } from 'svelte-inview';
	import { validateKey } from '$utils/validateKey';
	import { staticEndpoint } from '$data/websiteSettings';
	import { page } from '$app/stores';
	import { term } from '$utils/terminologies';

	const listItemClasses = 'py-2 px-2 text-sm hover:bg-black/5 w-full text-left font-normal rounded-3xl';
	let maxChaptersLoaded = false;
	let maxVersesLoaded = false;
	let maxItemsToLoad = 20;
	let maxVersesToLoad = 1;
	let searchedKey = '';
	let placeholder = `${term('chapter').toLowerCase()}, page, juz or key`;
	let keyPages;
	let iskeyboardVisible = false;
	let searchResults;

	$: if ($page.url.href || $__pageURL || $__chapterNumber || $__pageNumber) __quranNavigationModalVisible.set(false);
	$: if ($__currentPage) searchedKey = '';
	$: chapterVerses = quranMetaData[$__chapterNumber].verses;

	$: (async () => {
		searchResults = await validateKey(searchedKey);
	})();

	$: {
		maxVersesLoaded = false;
		maxVersesToLoad = chapterVerses > maxItemsToLoad ? maxItemsToLoad : chapterVerses;
	}

	// load it externally because including it locally increases the bundle size
	$: {
		if ($__quranNavigationModalVisible) {
			keyPages = (async () => {
				const response = await fetch(`${staticEndpoint}/v4/meta/keyPages.json`);
				const data = await response.json();
				return data;
			})();

			// focus the search input box
			setTimeout(function () {
				document.getElementById('searchKey').focus();
			}, 1);
		}
	}

	function loadMaxChapters() {
		if (!maxChaptersLoaded) {
			maxItemsToLoad = 114;
			maxChaptersLoaded = true;
		}
	}

	function loadMaxVerses() {
		if (!maxVersesLoaded) {
			maxVersesToLoad = chapterVerses;
			maxVersesLoaded = true;
		}
	}

	// https://stackoverflow.com/a/74618784
	if ('visualViewport' in window) {
		const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = 0.75;
		window.visualViewport.addEventListener('resize', function (event) {
			if ((event.target.height * event.target.scale) / window.screen.height < VIEWPORT_VS_CLIENT_HEIGHT_RATIO) iskeyboardVisible = true;
			else iskeyboardVisible = false;
		});
	}
</script>

<Modal id="quranNavigationModal" title="Navigate" bind:open={$__quranNavigationModalVisible} size="sm" class="rounded-3xl text-black theme" bodyClass="p-2 !border-t-0" headerClass="hidden" placement={iskeyboardVisible ? 'top-center' : 'center'} outsideclose>
	<div class="flex flex-col space-y-2 justify-between max-w-screen-lg px-4 py-5 mx-auto">
		<div class="mx-2">
			<div id="navigatation-inputs" class="flex flex-col space-y-4 mb-4 justify-start theme-grayscale">
				<div class="flex flex-row w-full h-fit items-center">
					<form on:submit|preventDefault={() => (searchedKey = document.getElementById('searchKey').value)} class="flex flex-row w-full">
						<Input id="searchKey" type="text" bind:value={searchedKey} autocomplete="off" {placeholder} size="md" class="rounded-3xl !text-black theme-grayscale text-center pl-10 px-8">
							<Search slot="left" size={7} classes="pl-2 pt-1" />
							<CloseButton slot="right" on:click={() => (searchedKey = '')} class="pr-2 opacity-50 {searchedKey.length === 0 ? 'hidden' : null}" />
						</Input>
					</form>
				</div>

				<div class="text-xs">
					<span class="font-semibold">Instructions:</span>
					You may navigate by entering either a {term('chapter').toLowerCase()}/page/juz number, a {term('verse').toLowerCase()} key (e.g. 2:255 or 2-255) or a word key (e.g. 2:1:1 or 2-1-1).

					<br /><br />
					<span class="font-semibold">Tip:</span>
					This navigation modal can be opened from anywhere on the website by pressing CTRL+K.
				</div>

				{#if searchedKey.length > 0}
					<div id="search-results" class="flex flex-col space-y-2 text-base md:text-lg py-4 max-h-52 overflow-y-auto">
						{#if searchResults}
							{#each Object.entries(searchResults) as [key, value]}
								<!-- numbers -->
								{#if $__currentPage === 'page'}
									{#if key === 'chapter'}
										<a href="/page/{startPageOfChapters[value]}" class="font-semibold hover:underline">{@html '&#10230'} {term('chapter')} {value} ({quranMetaData[value].transliteration})</a>
									{:else if key === 'page'}
										<a href="/page/{value}" class="font-semibold hover:underline">{@html '&#10230'} Page {value}</a>
									{/if}

									<!-- only show results of key-pages if we have loaded the data -->
									{#await keyPages then keyPages}
										{#if key === 'juz'}
											<a href="/page/{keyPages[juzNumberKeys[value - 1]]}" class="font-semibold hover:underline">{@html '&#10230'} Juz {value}</a>
										{:else if key === 'key'}
											<a href="/page/{keyPages[value]}" class="font-semibold hover:underline">{@html '&#10230'} {quranMetaData[value.split(':')[0]].transliteration}, {term('verse')} {value.split(':')[1]} (Page {keyPages[value]})</a>
										{/if}
									{/await}
								{:else if $__chapterNumber !== 'page'}
									{#if key === 'chapter'}
										<a href="/{value}" class="font-semibold hover:underline">{@html '&#10230'} {term('chapter')} {value} ({quranMetaData[value].transliteration})</a>
									{:else if key === 'verse' && $__currentPage === 'chapter'}
										<a href="/{$__chapterNumber}/{value}" class="font-semibold hover:underline">{@html '&#10230'} {term('verse')} {value} (Current {term('chapter')})</a>
									{:else if key === 'page'}
										<a href="/{pageNumberKeys[value - 1].split(':')[0]}/{pageNumberKeys[value - 1].split(':')[1]}" class="font-semibold hover:underline">{@html '&#10230'} Page {value} ({quranMetaData[pageNumberKeys[value - 1].split(':')[0]].transliteration})</a>
									{:else if key === 'juz'}
										<a href="/{juzNumberKeys[value - 1].split(':')[0]}/{juzNumberKeys[value - 1].split(':')[1]}" class="font-semibold hover:underline">{@html '&#10230'} Juz {value} ({quranMetaData[juzNumberKeys[value - 1].split(':')[0]].transliteration})</a>
									{:else if key === 'key'}
										<a href="/{value.split(':')[0]}/{value.split(':')[1]}" class="font-semibold hover:underline">{@html '&#10230'} {quranMetaData[value.split(':')[0]].transliteration}, {term('verse')} {value.split(':')[1]}</a>
									{/if}
								{/if}

								<!-- word key -->
								{#if key === 'word'}
									<a href="/morphology/{value}" class="font-semibold hover:underline">{@html '&#10230'} Word {value} Morphology</a>
								{/if}

								<!-- chapter names -->
								{#if key === 'chapters' && Object.keys(value).length > 0}
									{#each Object.entries(value) as [key, value]}
										<a href="/{key}" class="font-semibold hover:underline">{@html '&#10230'} {value.transliteration} <span class="hidden md:inline-block">({value.translation})</span></a>
									{/each}
								{/if}
							{/each}
						{/if}

						<!-- always allow user to search the Quran -->
						{#if searchedKey.length > 0}
							<span class="text-xs font-semibold {searchResults ? 'pt-2' : null}">Search Quran</span>
							<a href="/search?text={searchedKey}&translation=0" class="font-semibold hover:underline">{@html '&#10230'} "{searchedKey}"</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- chapter and verse selectors -->
		<div class="flex flex-row space-x-4 max-h-56 {searchedKey.length > 0 ? 'hidden' : 'block'}">
			<!-- chapter selector -->
			<div class="flex flex-col space-y-2 w-full">
				<div class="px-2 text-sm pb-2 border-b border-black/10 font-medium">{term('chapters')}</div>
				<ul id="navbar-chapter-list" class="grow basis-1/2 overflow-y-scroll">
					{#each { length: maxItemsToLoad } as _, chapter}
						<li>
							<a href={$__currentPage === 'page' ? `/page/${startPageOfChapters[chapter + 1]}` : `/${chapter + 1}`}>
								<div class="{listItemClasses} {$__currentPage === 'chapter' ? (chapter + 1 === $__chapterNumber ? 'bg-black/5' : null) : null}">
									{chapter + 1}. {quranMetaData[chapter + 1].transliteration}

									{#if $__currentPage === 'chapter'}
										<span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
									{:else}
										<span>({quranMetaData[chapter + 1].translation})</span>
									{/if}
								</div>
							</a>
						</li>
					{/each}
					{#if !maxChaptersLoaded}
						<Spinner size="8" />
					{/if}
					<div class="invisible" use:inview on:inview_enter={() => loadMaxChapters()}></div>
				</ul>
			</div>

			<!-- verse selector -->
			{#if $__currentPage === 'chapter'}
				<div class="flex flex-col space-y-2 w-44">
					<div class="mx-4 text-sm pb-2 border-b border-black/10 font-medium">{term('verses')}</div>
					<ul id="navbar-verse-list" class="grow basis-1/2 px-2 overflow-y-scroll">
						{#key $__chapterNumber}
							{#each { length: maxVersesToLoad } as _, verse}
								<li>
									<a href="/{$__chapterNumber}/{verse + 1}" on:click={() => __pageURL.set(Math.random())}>
										<div class={listItemClasses}>{term('verse')} {verse + 1}</div>
									</a>
								</li>
							{/each}
							{#if !maxVersesLoaded && chapterVerses > maxItemsToLoad}
								<Spinner size="8" />
							{/if}
						{/key}

						<div class="invisible" use:inview on:inview_enter={() => loadMaxVerses()}></div>
					</ul>
				</div>
			{/if}
		</div>

		<div class="w-full px-2">
			<button class="w-full {buttonClasses}" on:click={() => __quranNavigationModalVisible.set(false)}>Close</button>
		</div>
	</div>
</Modal>
