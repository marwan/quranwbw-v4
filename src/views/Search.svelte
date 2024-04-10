<script>
	import PageMeta from '$components/PageMeta.svelte';
	import { Link, navigate } from 'svelte-routing';
	import Spinner from '$svgs/Spinner.svelte';
	import { searchableTranslations } from '$data/searchableTranslations';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage } from '$utils/stores';
	import { linkElement } from '$utils/commonStyles';

	let fetchData;

	const params = new URLSearchParams(window.location.search);
	const defaultTranslation = 19;

	let selectedTranslation = params.get('translation') === null ? defaultTranslation : +params.get('translation'); // default to Saheeh International
	let searchText = params.get('text') === null ? 'abraham' : params.get('text'); // default to "abraham"

	// in case it's not a number or out of range
	if (isNaN(selectedTranslation) || selectedTranslation < 0 || selectedTranslation > 120) selectedTranslation = defaultTranslation;

	// fetch the search results from Al Quran Cloud API
	$: {
		// update the params
		navigate(`/search?text=${searchText}&translation=${selectedTranslation}`, { replace: true });

		fetchData = (async () => {
			const response = await fetch(`https://api.alquran.cloud/v1/search/${searchText}/all/${searchableTranslations[selectedTranslation].identifier}`);
			const data = await response.json();
			return data.data;
		})();
	}

	// to make the searched text bolder
	function highlightSearchedText(verseText) {
		const searchTextReg = searchText.replace(/(\s+)/, '(<[^>]+>)*$1(<[^>]+>)*');
		const pattern = new RegExp('(' + searchTextReg + ')', 'gi');
		return verseText.replace(pattern, '<b>$1</b>');
	}

	__currentPage.set('search');
</script>

<PageMeta title={'Search'} />

<div class="grayscale space-y-8">
	<div class="my-6 space-y-4 pb-4 border-b-2 dark:border-slate-700">
		<h1 class="text-2xl">Search the Quran</h1>
		<div class="text-sm">
			Search the Quran for any text in over 100+ translations. Powered by the <a href="https://alquran.cloud/api" target="_blank" class={linkElement}>Al Quran Cloud API</a>.
		</div>
	</div>

	<div class="flex max-w-3xl mx-auto">
		<div id="dropdown" class="z-10 bg-white divide-y divide-gray-100 rounded-3xl shadow w-44 dark:bg-gray-700">
			<select
				id="dropdown"
				bind:value={selectedTranslation}
				on:change={(event) => (selectedTranslation = +event.target.value)}
				class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl rounded-r-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			>
				{#each Object.entries(searchableTranslations) as [id, translation]}
					<option value={+id}>{translation.language.toUpperCase()} - {translation.name} ({translation.englishName})</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center w-full">
			<div class="relative w-full">
				<input type="search" id="search-input" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Abraham, Mary, Noah, Paradise..." required />
			</div>
			<button on:click={(event) => (searchText = document.getElementById('search-input').value)} class="p-2.5 ms-2 text-sm font-medium text-white bg-gray-500 rounded-3xl border border-gray-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-80">
				<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
				</svg>
				<span class="sr-only">Search</span>
			</button>
		</div>
	</div>

	<div id="search-results">
		{#await fetchData}
			<Spinner />
		{:then fetchData}
			<div class="text-sm space-y-2 pt-4">
				<div id="info" class="font-medium text-center">Showing {fetchData.count} results for "{searchText}" from {searchableTranslations[selectedTranslation].name}</div>
				<div id="results">
					{#each Object.entries(fetchData.matches) as [key, value]}
						<Link to="/{value.surah.number}/{value.numberInSurah}">
							<div class="py-6 space-y-2 border-b dark:border-slate-700">
								<div>{@html highlightSearchedText(value.text)}</div>
								<div class="text-gray-500">&mdash; {quranMetaData[value.surah.number].transliteration}, {value.surah.number}:{value.numberInSurah} ({value.edition.name})</div>
							</div>
						</Link>
					{/each}
				</div>
			</div>
		{:catch error}
			<div id="info" class="text-sm text-center pt-4">Could not find anything for "{searchText}" in {searchableTranslations[selectedTranslation].name}. Please try searching something else.</div>
		{/await}
	</div>
</div>
