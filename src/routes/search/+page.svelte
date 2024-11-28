<script>
	import PageHead from '$misc/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { searchableTranslations } from '$data/searchableTranslations';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage } from '$utils/stores';

	const params = new URLSearchParams(window.location.search);
	const defaultTranslation = 0;
	let searchResults;
	let selectedTranslation = params.get('translation') === null ? defaultTranslation : +params.get('translation'); // default to Saheeh International
	let searchText = params.get('text') === null ? '' : params.get('text'); // default to ""

	// in case it's not a number or out of range
	if (isNaN(selectedTranslation) || selectedTranslation < 0 || selectedTranslation > 120) selectedTranslation = defaultTranslation;

	// fetch the search results from Al Quran Cloud API
	$: {
		if (searchText.length > 0) {
			// update the params
			goto(`/search?text=${searchText}&translation=${selectedTranslation}`, { replaceState: false });

			searchResults = (async () => {
				const response = await fetch(`https://api.alquran.cloud/v1/search/${searchText}/all/${searchableTranslations[selectedTranslation].identifier}`);
				const data = await response.json();
				return data;
			})();
		}
	}

	// to make the searched text bolder
	function highlightSearchedText(verseText) {
		const searchTextReg = searchText.replace(/(\s+)/, '(<[^>]+>)*$1(<[^>]+>)*');
		const pattern = new RegExp('(' + searchTextReg + ')', 'gi');
		return verseText.replace(pattern, '<b>$1</b>');
	}

	__currentPage.set('search');
</script>

<PageHead title={'Search'} />

<div class="theme mt-4 space-y-4">
	<div class="flex max-w-2xl mx-auto theme-grayscale">
		<div id="dropdown" class="z-10 w-44">
			<select
				id="dropdown"
				bind:value={selectedTranslation}
				on:change={(event) => (selectedTranslation = +event.target.value)}
				class="truncate bg-gray-50 border border-black/10 text-gray-900 text-sm rounded-3xl rounded-r-none focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500"
			>
				{#each Object.entries(searchableTranslations) as [id, translation]}
					<option value={+id}>{translation.name} ({translation.englishName})</option>
				{/each}
			</select>
		</div>

		<!-- search input form -->
		<form on:submit|preventDefault={(event) => (searchText = document.getElementById('search-input').value)} class="flex items-center w-full">
			<div class="relative w-full">
				<input type="search" id="search-input" value={searchText} class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50 border-s-2 border border-black/10" placeholder="Search Abraham, Mary, Noah, Paradise..." required />
			</div>
			<button type="submit" class="p-2.5 px-4 text-sm font-medium text-white bg-gray-500 rounded-r-3xl border border-gray-500">
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
				</svg>
				<span class="sr-only">Search</span>
			</button>
		</form>
	</div>

	<!-- search instructions -->
	{#if searchText.length === 0}
		<div id="how-to-search" class="flex flex-col text-sm space-y-2 max-w-2xl mx-auto">
			<span><b>Note:</b> To prevent browser slowdowns, avoid searching for extremely short phrases or words, as they may return a large number of records. Additionally, note that phrases or words available in one translation may not be available in others. For instance, in the Saheeh International translation, the word "Abraham" yields 72 records, whereas "Ibrahim" returns none.</span>
		</div>
	{/if}

	<!-- search results -->
	{#if searchText.length > 0}
		<div id="search-results">
			{#await searchResults}
				<Spinner />
			{:then searchResults}
				{#if searchResults.code === 200}
					<div class="text-sm space-y-2 pt-4">
						<div id="info" class="font-medium text-center">Showing {searchResults.data.count} results for "{searchText}" from {searchableTranslations[selectedTranslation].name}</div>
						<div id="results">
							{#each Object.entries(searchResults.data.matches) as [key, value]}
								<a href="/{value.surah.number}/{value.numberInSurah}">
									<div class="py-6 space-y-2 border-b dark:border-slate-700">
										<div>{@html highlightSearchedText(value.text)}</div>
										<div class="opacity-70">&mdash; {quranMetaData[value.surah.number].transliteration}, {value.surah.number}:{value.numberInSurah} ({value.edition.name})</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{:else if searchResults.code === 404}
					<div id="info" class="text-sm text-center pt-4">Could not find anything for "{searchText}" in {searchableTranslations[selectedTranslation].name}. Try searching something else or switching the translation.</div>
				{:else}
					<div id="info" class="text-sm text-center pt-4">There was an error with your search. Please try again later.</div>
				{/if}
			{:catch error}
				<div id="info" class="text-sm text-center pt-4">There was an error with your search. Please try again later.</div>
			{/await}
		</div>
	{/if}
</div>
