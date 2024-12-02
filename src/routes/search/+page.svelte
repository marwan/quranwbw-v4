<script>
	import PageHead from '$misc/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Translation from '$svgs/Translation.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import VerseTranslationSelector from '$ui/SettingsDrawer/VerseTranslationSelector.svelte';
	import { goto } from '$app/navigation';
	import { __currentPage, __fontType, __wordTranslation, __verseTranslations, __wordTransliteration, __settingsSelectorModal } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchData';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { buttonOutlineClasses } from '$data/commonClasses';
	import { term } from '$utils/terminologies';

	// Retrieve URL parameters
	const params = new URLSearchParams(window.location.search);

	// Retrieve or set default values for search parameters
	let searchQuery = params.get('query') === null ? '' : params.get('query'); // Search text
	let selectedTranslation = params.get('translation') === null ? $__verseTranslations.toString() : params.get('translation'); // Selected translation index
	let searchPage = params.get('page') === null ? 1 : +params.get('page'); // Selected page
	let resultsPerPage = 50;
	let totalResults;
	let areResultsMoreThan200;
	let pagePagination = null;

	// Basic checks
	$: if (searchPage < 1 || isNaN(searchPage)) searchPage = 1;

	// Update the search results whenever query changes
	$: if (searchQuery.length > 0 || $__verseTranslations) goto(`/search?query=${searchQuery}&page=${searchPage}&translation=${selectedTranslation}`, { replaceState: false });

	// Set the page back to 1 everytime the verse translation changes
	$: if ($__verseTranslations) {
		searchPage = 1;
		selectedTranslation = $__verseTranslations.toString();
	}

	$: fetchVerses = (async () => {
		try {
			const urlParameters = `query=${searchQuery}&size=${resultsPerPage}&page=${searchPage}&filter_translations=${selectedTranslation}`;
			let versesKeyData;

			// Fetching from Quran.com default search API
			let response = await fetch(`https://api.qurancdn.com/api/qdc/search?${urlParameters}`);
			let data = await response.json();
			versesKeyData = data;

			// If no data, then fetch from our API
			if (!versesKeyData.result.verses.length) {
				response = await fetch(`${apiEndpoint}/search-translations?${urlParameters}`);
				data = await response.json();
				versesKeyData = data.data;
			}

			const { pagination } = versesKeyData;
			totalResults = pagination.total_records;
			pagePagination = pagination;

			return await fetchVersesData(generateKeys(versesKeyData), $__fontType, $__wordTranslation, $__wordTransliteration, selectedTranslation);
		} catch (error) {
			console.error(errorLoadingDataMessage, error);
			return {};
		}
	})();

	function generateKeys(data) {
		const verseKeys = [];

		Object.keys(data.result.verses).forEach(function (key) {
			verseKeys.push(data.result.verses[key].verse_key);
		});

		return verseKeys.toString();
	}

	// Set the current page to 'search'
	__currentPage.set('search');
</script>

<PageHead title={'Search'} />

<div class="mt-4 space-y-4">
	<div class="flex max-w-2xl mx-auto">
		<button class="py-3 pl-6 pr-4 text-gray-600 bg-lightGray hover:bg-gray-200 rounded-l-3xl items-center" title="Translations" on:click={() => __settingsSelectorModal.set({ component: VerseTranslationSelector, visible: true, title: `${term('verse')} Translation` })}>
			<Translation size={5} />
		</button>

		<!-- search input form -->
		<form on:submit|preventDefault={(event) => (searchQuery = document.getElementById('search-input').value)} class="flex items-center w-full">
			<div class="relative w-full">
				<input type="search" id="search-input" value={searchQuery} class="block p-3 pl-4 w-full z-20 text-sm text-gray-900 bg-gray-50 border border-black/10" placeholder="Search Abraham, Mary, Noah, Paradise..." required />
			</div>
			<button type="submit" class="p-3 px-4 text-sm font-medium text-white bg-gray-500 rounded-r-3xl border border-gray-500">
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
				</svg>
				<span class="sr-only">Search</span>
			</button>
		</form>
	</div>

	<!-- search instructions -->
	{#if searchQuery.length === 0}
		<div id="how-to-search" class="flex flex-col text-sm space-y-2 max-w-2xl mx-auto theme">
			<span><b>Note:</b> To prevent browser slowdowns, avoid searching for extremely short phrases or words, as they may return a large number of records. Additionally, note that phrases or words available in one translation may not be available in others. For instance, in the Saheeh International translation, the word "Abraham" yields 72 records, whereas "Ibrahim" returns none.</span>
		</div>
	{/if}

	{#if searchQuery.length > 0}
		<div>
			{#await fetchVerses}
				<Spinner />
			{:then data}
				{#if data !== 404}
					<!-- search results info -->
					<div class="flex flex-col space-y-4 text-center text-xs theme">
						{#if areResultsMoreThan200}
							<div>Displaying the first 200 results for "{searchQuery}" out of {totalResults} found.</div>
						{:else}
							<div>Displaying {totalResults} results for "{searchQuery}".</div>
						{/if}
					</div>

					{@const totalRecords = Object.keys(data).length}
					<div id="individual-verses-block">
						<Individual {data} startIndex={0} endIndex={totalRecords > 5 ? 5 : totalRecords} />
					</div>

					<!-- pagination -->
					{#if pagePagination !== null}
						<div class="flex flex-row space-x-4 mt-8 justify-center">
							{#if pagePagination.current_page > 1}
								<button class="{buttonOutlineClasses} text-xs" on:click={() => (searchPage = pagePagination.current_page - 1)}>{@html '&#x2190;'} {pagePagination.current_page - 1}</button>
							{/if}

							{#if pagePagination.total_pages > 1}
								<button>Page {pagePagination.current_page}</button>
							{/if}

							{#if pagePagination.next_page !== null}
								<button class="{buttonOutlineClasses} text-xs" on:click={() => (searchPage = pagePagination.next_page)}>{pagePagination.next_page} {@html '&#x2192;'}</button>
							{/if}
						</div>
					{/if}
				{:else}
					<div class="flex text-center items-center justify-center pt-18 theme text-xs max-w-2xl mx-auto">Unfortunately, your query did not yield any results from the selected translations. Please try using a different keyword or consider switching to another translation for better results.</div>
				{/if}
			{:catch error}
				<p>{errorLoadingDataMessage}</p>
			{/await}
		</div>
	{/if}
</div>
