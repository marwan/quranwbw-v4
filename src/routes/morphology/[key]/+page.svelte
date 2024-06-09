<script>
	export let data;

	import PageHead from '$misc/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Table from '$display/morphology/Table.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage, __wordType, __wordTranslation, __verseTranslations, __morphologyKey, __pageURL } from '$utils/stores';
	import { buttonClasses } from '$data/commonClasses';
	import { fetchVersesData } from '$utils/fetchData';

	let fetchWordsData, fetchWordSummary;
	let chapter, verse, word;

	$: {
		const keySplit = data.key.split(':');
		chapter = +keySplit[0];
		verse = +keySplit[1];
		word = keySplit.length === 2 ? 1 : +keySplit[2];

		if (isNaN(word)) word = 1;

		__morphologyKey.set(`${chapter}:${verse}:${word}`);
	}

	// fetching verse data
	$: fetchData = fetchVersesData(`${chapter}:${verse}`, $__wordType, $__wordTranslation, $__verseTranslations.toString());

	// fetch words
	$: {
		fetchWordsData = (async () => {
			const response = await fetch(`${apiEndpoint}/morphology?words=${$__morphologyKey}`);
			const data = await response.json();
			return data.data;
		})();

		// fetch word summary
		fetchWordSummary = (async () => {
			const response = await fetch(`${apiEndpoint}/morphology/summary?word=${$__morphologyKey}`);
			const data = await response.json();
			return data.data;
		})();
	}

	__currentPage.set('morphology');
</script>

<PageHead title={`Morphology (${$__morphologyKey})`} />

<div class="space-y-12 my-8">
	<div id="verse-navigator" class="flex flex-row justify-center space-x-8 text-sm">
		<!-- previous chapter -->
		{#if verse === 1 && chapter > 1}
			<a href="/morphology/{+chapter - 1}:1" class={buttonClasses}>{@html '&#x2190;'} Chapter {+chapter - 1}</a>
		{/if}

		<a href="/morphology/{chapter}:{+verse - 1}" class="{buttonClasses} {verse === 1 && 'hidden'}">{@html '&#x2190;'} Verse {chapter}:{+verse - 1}</a>
		<a href="/morphology/{chapter}:{+verse + 1}" class="{buttonClasses} {verse === quranMetaData[chapter].verses && 'hidden'}">Verse {chapter}:{+verse + 1} {@html '&#x2192;'}</a>

		<!-- next chapter -->
		{#if verse === quranMetaData[chapter].verses && chapter < 114}
			<a href="/morphology/{+chapter + 1}:1" class={buttonClasses}>Chapter {+chapter + 1} {@html '&#x2192;'}</a>
		{/if}
	</div>

	<div id="verse">
		{#await fetchData}
			<Spinner />
		{:then fetchData}
			<div class="flex flex-wrap justify-center direction-rtl">
				{#each Object.entries(fetchData) as [key, value]}
					<WordsBlock {key} {value} />
				{/each}
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>

	<div id="word-summary" class="text-center opacity-70 mx-auto md:w-3/4 text-sm pb-6 border-b-2 md:text-lg">
		{#await fetchWordSummary}
			<span>...</span>
		{:then fetchWordSummary}
			<span>{fetchWordSummary.summary}</span>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>

	<div id="word-forms" class="pb-8 border-b-2">
		{#await fetchWordsData}
			<Spinner />
		{:then fetchWordsData}
			{#if Object.keys(fetchWordsData[0].morphology.root.words_with_same_root).length > 0}
				<div class="flex flex-col">
					<div id="different-verbs" class="theme-grayscale">
						<div class="mx-auto text-center">
							<div class="relative grid gap-8 grid-cols-2 row-gap-5 md:row-gap-8 md:grid-cols-6">
								{#each Object.entries(fetchWordsData[0].morphology.verbs) as [key, value]}
									{#if value !== null}
										<div class="flex flex-col py-5 duration-300 transform bg-white border rounded-3xl shadow-sm text-center hover:-translate-y-2">
											<div class="flex items-center justify-center mb-2">
												<p id="verb-1" class="text-xl md:text-2xl pb-4 leading-5 arabic-font-{$__wordType}">{value}</p>
											</div>
											<p class="text-xs text-gray-900">{key}</p>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="text-center my-8 text-sm opacity-70">Root data for this word is not available.</div>
			{/if}
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>

	<div id="word-root-data" class="pb-8 border-b-2">
		{#await fetchWordsData}
			<Spinner />
		{:then fetchWordsData}
			<Table wordData={fetchWordsData[0].morphology.root.words_with_same_root} tableType={1} />
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>

	<div id="exact-word-data" class="pb-8 border-b-2">
		{#await fetchWordsData}
			<Spinner />
		{:then fetchWordsData}
			<Table wordData={fetchWordsData[0].morphology.exact_words_in_quran} tableType={2} />
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>
</div>
