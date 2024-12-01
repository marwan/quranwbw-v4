<script>
	import PageHead from '$misc/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import { goto } from '$app/navigation';
	import { __currentPage, __fontType, __wordTranslation, __verseTranslations, __wordTransliteration } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchData';
	import { errorLoadingDataMessage } from '$data/websiteSettings';

	// Retrieve URL parameters
	const params = new URLSearchParams(window.location.search);

	// Retrieve or set default values for search parameters
	let searchQuery = params.get('query') === null ? '' : params.get('query'); // Search text
	let totalResults = 0;
	let areResultsMoreThan200 = false;

	// Update the search results whenever query changes
	$: if (searchQuery.length > 0) goto(`/search?query=${searchQuery}`, { replaceState: false });

	$: fetchVerses = (async () => {
		try {
			const versesKeys = await fetch(`https://api.alquran.cloud/v1/search/${searchQuery}/all/en.hilali`);
			const versesKeysResponse = await versesKeys.json();
			if (versesKeysResponse.code === 404) return 404;
			totalResults = versesKeysResponse.data.count;
			generateUniqueKeys(versesKeysResponse.data);
			return await fetchVersesData(generateUniqueKeys(versesKeysResponse.data), $__fontType, $__wordTranslation, $__wordTransliteration, $__verseTranslations);
		} catch (error) {
			console.error(errorLoadingDataMessage, error);
			return {};
		}
	})();

	function generateUniqueKeys(data) {
		// Initialize an empty array to hold the unique keys
		let keysArray = [];

		// Initialize a set to track unique keys
		let uniqueKeys = new Set();

		// Loop through each record in the "matches" array
		for (let i = 0; i < data.matches.length; i++) {
			// Extract the surah number and number in surah
			let surahNumber = data.matches[i].surah.number;
			let numberInSurah = data.matches[i].numberInSurah;

			// Create the key in the format <surahnumber>:<numberinsurah>
			let key = `${surahNumber}:${numberInSurah}`;

			// Add the key to the set and array if it's not already present
			if (!uniqueKeys.has(key)) {
				uniqueKeys.add(key);
				keysArray.push(key);
			}
		}

		return processVerses(keysArray.toString());
	}

	function processVerses(data) {
		// Split the verses by comma
		let versesArray = data.split(',');

		// Limit the array to 200 items if there are more than 200
		if (versesArray.length > 200) {
			versesArray = versesArray.slice(0, 200);
			areResultsMoreThan200 = true;
		}

		return versesArray.toString();
	}

	// Set the current page to 'search'
	__currentPage.set('search');
</script>

<PageHead title={'Search'} />

<div class="mt-4 space-y-4">
	<div class="flex max-w-2xl mx-auto">
		<!-- search input form -->
		<form on:submit|preventDefault={(event) => (searchQuery = document.getElementById('search-input').value)} class="flex items-center w-full">
			<div class="relative w-full">
				<input type="search" id="search-input" value={searchQuery} class="block p-2.5 pl-4 w-full z-20 text-sm text-gray-900 bg-gray-50 border border-black/10 rounded-l-3xl" placeholder="Search Abraham, Mary, Noah, Paradise..." required />
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
				{:else}
					<div class="flex items-center justify-center pt-28 theme">No results found for the given query.</div>
				{/if}
			{:catch error}
				<p>{errorLoadingDataMessage}</p>
			{/await}
		</div>
	{/if}
</div>
