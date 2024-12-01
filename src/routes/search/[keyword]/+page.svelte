<script>
	export let data;

	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage, __fontType, __wordTranslation, __wordTransliteration } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchData';

	const keyword = data.keyword;
	let totalResults = 0;
	let areResultsMoreThan200 = false;

	// Fetch verse data based on keyword
	$: fetchVerses = (async () => {
		try {
			const versesKeys = await fetch(`${apiEndpoint}/get-verses-from-keyword?query=${keyword}`);
			const versesKeysResponse = await versesKeys.json();
			if (versesKeysResponse.code === 404) return 404;
			totalResults = versesKeysResponse.data.count;
			return await fetchVersesData(processVerses(versesKeysResponse.data.verses), $__fontType, $__wordTranslation, $__wordTransliteration);
		} catch (error) {
			console.error(errorLoadingDataMessage, error);
			return {};
		}
	})();

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

	__currentPage.set('search');
</script>

<PageHead title={'Keyword Search'} />

<div>
	{#await fetchVerses}
		<Spinner height="screen" margin="-mt-20" />
	{:then data}
		{#if data !== 404}
			<!-- search results info -->
			<div class="flex flex-col space-y-4 text-center text-xs">
				{#if areResultsMoreThan200}
					<div>Displaying the first 200 results for "{keyword}" out of {totalResults} found.</div>
				{:else}
					<div>Displaying {totalResults} results for "{keyword}".</div>
				{/if}
			</div>

			{@const totalRecords = Object.keys(data).length}
			<div id="individual-verses-block">
				<Individual {data} startIndex={0} endIndex={totalRecords > 5 ? 5 : totalRecords} />
			</div>
		{:else}
			<div class="flex items-center justify-center pt-28">No results found for the given query.</div>
		{/if}
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
