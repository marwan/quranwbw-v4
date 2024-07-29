<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Input from '$ui/flowbite-svelte/forms/Input.svelte';
	import CloseButton from '$ui/flowbite-svelte/utils/CloseButton.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Search from '$svgs/Search.svelte';
	import { quranMetaData, startPageOfChapters, pageNumberKeys, juzNumberKeys } from '$data/quranMeta';
	import { buttonClasses } from '$data/commonClasses';
	import { __chapterNumber, __pageURL, __currentPage, __pageNumber, __quranNavigationModalVisible, __lastRead, __morphologyKey } from '$utils/stores';
	import { inview } from 'svelte-inview';
	import { validateKey } from '$utils/validateKey';
	import { staticEndpoint } from '$data/websiteSettings';
	import { page } from '$app/stores';
	import { term } from '$utils/terminologies';
	import { supplicationsFromQuran, mostRead } from '$data/quranMeta';

	const linkClasses = 'flex flex-row space-x-2 items-center';
	const linkTextClasses = 'px-4 py-2 rounded-3xl bg-lightGray hover:bg-gray-200 w-fit text-sm';
	const listItemClasses = 'py-2 px-2 text-sm hover:bg-black/5 w-full text-left font-normal rounded-3xl';
	let maxChaptersLoaded = false;
	let maxVersesLoaded = false;
	let maxItemsToLoad = 20;
	let maxVersesToLoad = 1;
	let searchedKey = '';
	let placeholder = 'Navigate or Search Quran';
	let verseKeyData;
	let searchResults;
	let lastReadChapter = 1;
	let lastReadVerse = 1;
	let morphologyKey = '1:1';

	$: {
		if ($__lastRead.hasOwnProperty('key')) {
			lastReadChapter = $__lastRead.key.split(':')[0];
			lastReadVerse = $__lastRead.key.split(':')[1];
		}
	}

	// $: if ($page.url.href || $__pageURL || $__chapterNumber || $__pageNumber) __quranNavigationModalVisible.set(false);
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
		verseKeyData = (async () => {
			const response = await fetch(`${staticEndpoint}/v4/meta/verseKeyData.json`);
			const data = await response.json();
			return data;
		})();
	}

	// focus the search input box
	$: {
		if ($__quranNavigationModalVisible) {
			setTimeout(function () {
				document.getElementById('searchKey').focus();
			}, 1);
		}
	}

	// setting stuff for the morphology page
	$: if ($__morphologyKey) morphologyKey = `${$__morphologyKey.split(':')[0]}:${$__morphologyKey.split(':')[1]}`;

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
</script>

<Modal id="quranNavigationModal" bind:open={$__quranNavigationModalVisible} title="Navigate" size="sm" class="!rounded-t-none md:!rounded-3xl text-black theme" bodyClass="md:p-2 !border-t-0" headerClass="hidden" placement="center" position="top" outsideclose>
	<div class="flex flex-col space-y-2 justify-between max-w-screen-lg px-4 py-5 mx-auto">
		<!-- search block -->
		<div id="search-block" class="mx-2">
			<div id="navigatation-inputs" class="flex flex-col space-y-4 mb-4 justify-start theme-grayscale">
				<div class="flex flex-row w-full h-fit items-center">
					<form on:submit|preventDefault={() => (searchedKey = document.getElementById('searchKey').value)} class="flex flex-row w-full">
						<Input id="searchKey" type="text" bind:value={searchedKey} autocomplete="off" {placeholder} size="md" class="rounded-3xl !text-black theme-grayscale text-center pl-10 px-8">
							<Search slot="left" size={7} classes="pl-2 pt-1 {searchedKey.length > 0 && 'hidden'}" />
							<CloseButton slot="right" on:click={() => (searchedKey = '')} class="pr-2 opacity-50 {searchedKey.length === 0 && 'hidden'}" />
						</Input>
					</form>
				</div>

				<!-- instructions -->
				{#if searchedKey.length === 0}
					<div class="text-xs">
						<span class="font-semibold">Instructions:</span>
						You may navigate by entering either a {term('chapter').toLowerCase()}/page/juz number, or a {term('verse').toLowerCase()}/word key seperated by a colon, period, dash or a space (e.g. 2:255, 2.286, 18-10 or 2 1 1).

						<!-- <br /><br />
						This navigation modal can be opened from anywhere on the website by pressing CTRL+K. -->
					</div>
				{/if}

				<!-- suggestions (only for home page) -->
				{#if searchedKey.length === 0 && $__currentPage === 'home'}
					<div id="search-suggestions" class="flex flex-col space-y-2 text-base md:text-lg max-h-52 overflow-y-auto">
						<!-- last read -->
						{#if $__lastRead.hasOwnProperty('key')}
							<span class="text-xs font-semibold pt-2">Last Read</span>
							<div class={linkClasses}>
								<span>{@html '&#10230'}</span>
								<a href="/{lastReadChapter}/{lastReadVerse}" class={linkTextClasses}>{quranMetaData[lastReadChapter].transliteration}, {lastReadChapter}:{lastReadVerse}</a>
							</div>
						{/if}

						<!-- other suggestions -->
						<span class="text-xs font-semibold pt-2">Suggestions</span>
						{#each Object.entries(mostRead) as [id, item]}
							<div class={linkClasses}>
								<span>{@html '&#10230'}</span>
								<a href={item.url} class={linkTextClasses}>{quranMetaData[item.chapter].transliteration} ({item.verses})</a>
							</div>
						{/each}
					</div>
				{/if}

				<!-- results -->
				{#if searchedKey.length > 0}
					<div id="search-results" class="flex flex-col space-y-2 text-base md:text-lg max-h-52 overflow-y-auto">
						{#if searchResults}
							<!-- stuff for current chapter -->
							{#each Object.entries(searchResults) as [key, value]}
								<!-- numbers -->
								{#if $__chapterNumber !== 'page'}
									{#if key === 'verse' && $__currentPage === 'chapter'}
										<span class="text-xs font-semibold {searchResults && 'pt-2'}">Current {term('chapter')}</span>

										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{$__chapterNumber}/{value}" class={linkTextClasses}>{term('verse')} {value}</a>
										</div>
									{/if}
								{/if}
							{/each}

							<!-- normal stuff -->
							<span class="text-xs font-semibold {searchResults && 'pt-2'}">Navigate</span>
							{#each Object.entries(searchResults) as [key, value]}
								<!-- numbers -->
								{#if $__currentPage === 'page'}
									{#if key === 'chapter'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/page/{startPageOfChapters[value]}" class={linkTextClasses}>{term('chapter')} {value} ({quranMetaData[value].transliteration})</a>
										</div>
									{:else if key === 'page'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/page/{value}" class={linkTextClasses}>Page {value}</a>
										</div>
									{/if}

									<!-- only show results of key-pages if we have loaded the data -->
									{#await verseKeyData then verseKeyData}
										{#if key === 'juz'}
											<div class={linkClasses}>
												<span>{@html '&#10230'}</span>
												<a href="/page/{verseKeyData[juzNumberKeys[value - 1]].page}" class={linkTextClasses}>Juz {value}</a>
											</div>
										{:else if key === 'key'}
											<div class={linkClasses}>
												<span>{@html '&#10230'}</span>
												<a href="/page/{verseKeyData[value].page}" class={linkTextClasses}>{quranMetaData[value.split(':')[0]].transliteration}, {term('verse')} {value.split(':')[1]} (Page {verseKeyData[value].page})</a>
											</div>
										{/if}
									{/await}
								{:else if $__chapterNumber !== 'page'}
									{#if key === 'chapter'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{value}" class={linkTextClasses}>{term('chapter')} {value} ({quranMetaData[value].transliteration})</a>
										</div>
									{:else if key === 'page'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{pageNumberKeys[value - 1].split(':')[0]}/{pageNumberKeys[value - 1].split(':')[1]}" class={linkTextClasses}>Page {value} ({quranMetaData[pageNumberKeys[value - 1].split(':')[0]].transliteration})</a>
										</div>
									{:else if key === 'juz'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{juzNumberKeys[value - 1].split(':')[0]}/{juzNumberKeys[value - 1].split(':')[1]}" class={linkTextClasses}>Juz {value} ({quranMetaData[juzNumberKeys[value - 1].split(':')[0]].transliteration})</a>
										</div>
									{:else if key === 'key'}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{value.split(':')[0]}/{value.split(':')[1]}" class={linkTextClasses}>{quranMetaData[value.split(':')[0]].transliteration}, {term('verse')} {value.split(':')[1]}</a>
										</div>
									{/if}
								{/if}

								<!-- word key -->
								{#if key === 'word'}
									<div class={linkClasses}>
										<span>{@html '&#10230'}</span>
										<a href="/morphology/{value}" class={linkTextClasses}>Word {value} Morphology</a>
									</div>
								{/if}

								<!-- chapter names -->
								{#if key === 'chapters' && Object.keys(value).length > 0}
									{#each Object.entries(value) as [key, value]}
										<div class={linkClasses}>
											<span>{@html '&#10230'}</span>
											<a href="/{key}" class={linkTextClasses}>{value.transliteration} <span class="hidden md:inline-block">({value.translation})</span></a>
										</div>
									{/each}
								{/if}
							{/each}
						{/if}

						<!-- always allow user to search the Quran -->
						{#if searchedKey.length > 0}
							<span class="text-xs font-semibold {searchResults && 'pt-2'}">Search Quran</span>
							<div class={linkClasses}>
								<span>{@html '&#10230'}</span>
								<a href="/search?text={searchedKey}&translation=0" class={linkTextClasses}>"{searchedKey}"</a>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- chapter and verse selectors -->
		{#if $__currentPage !== 'home'}
			<div class="flex flex-row space-x-4 max-h-56 {searchedKey.length > 0 ? 'hidden' : 'block'}">
				<!-- chapter selector -->
				{#if !['supplications', 'morphology'].includes($__currentPage)}
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
				{/if}

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

				<!-- supplications selector -->
				{#if $__currentPage === 'supplications'}
					<div class="flex flex-col space-y-2 w-full">
						<div class="px-2 text-sm pb-2 border-b border-black/10 font-medium">{term('supplications')}</div>
						<ul id="navbar-supplications-list" class="grow basis-1/2 px-2 overflow-y-scroll">
							{#each Object.entries(supplicationsFromQuran) as [key, value]}
								<li>
									<a href="#{key}">
										<div class={listItemClasses}>{quranMetaData[key.split(':')[0]].transliteration}, {key}</div>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- words selector -->
				{#if $__currentPage === 'morphology'}
					<div class="flex flex-col space-y-2 w-full">
						<div class="px-2 text-sm pb-2 border-b border-black/10 font-medium">Words</div>
						{#await verseKeyData then verseKeyData}
							<ul id="navbar-words-list" class="grow basis-1/2 px-2 overflow-y-scroll">
								{#each { length: verseKeyData[morphologyKey].words } as _, word}
									<li>
										<a href="/morphology/{morphologyKey}:{word + 1}">
											<div class={listItemClasses}>Word {morphologyKey}:{word + 1}</div>
										</a>
									</li>
								{/each}
							</ul>
						{/await}
					</div>
				{/if}
			</div>
		{/if}

		<div class="w-full px-2">
			<button class="w-full {buttonClasses}" on:click={() => __quranNavigationModalVisible.set(false)}>Close</button>
		</div>
	</div>
</Modal>
