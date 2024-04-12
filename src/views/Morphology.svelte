<script>
	export let key;

	import PageMeta from '$components/PageMeta.svelte';
	import { Link } from 'svelte-routing';
	import Spinner from '$svgs/Spinner.svelte';
	import VersesWords from '$verses/VersesWords.svelte';
	import MorphologyTable from '$morphology/MorphologyTable.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __wordType, __wordTranslation, __verseTranslations, __morphologyKey } from '$utils/stores';
	import { tabPillElement } from '$utils/commonStyles';
	import { fetchVersesData } from '$utils/fetchChapterData';

	let fetchWordsData, fetchWordSummary;

	let chapter, verse, word;

	$: {
		chapter = +key.split(':')[0];
		verse = +key.split(':')[1];
		word = +key.split(':')[2];

		if (isNaN(word)) word = 1;

		__morphologyKey.set(`${chapter}:${verse}:${word}`);
	}

	// fetching verse data
	$: fetchData = fetchVersesData(`${chapter}:${verse}`, $__wordType, $__wordTranslation, $__verseTranslations.toString());

	// fetch words
	$: {
		fetchWordsData = (async () => {
			const response = await fetch(`https://api.quranwbw.com/v1/morphology?words=${$__morphologyKey}`);
			const data = await response.json();
			return data.data;
		})();
	}

	// fetch word summary
	$: {
		fetchWordSummary = (async () => {
			const response = await fetch(`https://api.quranwbw.com/v1/morphology/summary?word=${$__morphologyKey}`);
			const data = await response.json();
			return data.data;
		})();
	}

	__currentPage.set('morphology');
</script>

<PageMeta title={`Morphology (${$__morphologyKey})`} />

<div class="space-y-12 my-8">
	<div id="verse-navigator" class="flex flex-row justify-center space-x-8">
		<!-- previous chapter -->
		{#if verse === 1 && chapter > 1}
			<Link to="/morphology/{+chapter - 1}:1" class={tabPillElement}>{@html '&#x2190;'} Chapter {+chapter - 1}</Link>
		{/if}

		<Link to="/morphology/{chapter}:{+verse - 1}" class="{tabPillElement} {verse === 1 && 'hidden'}">{@html '&#x2190;'} Verse {chapter}:{+verse - 1}</Link>
		<Link to="/morphology/{chapter}:{+verse + 1}" class="{tabPillElement} {verse === quranMetaData[chapter].verses && 'hidden'}">Verse {chapter}:{+verse + 1} {@html '&#x2192;'}</Link>

		<!-- next chapter -->
		{#if verse === quranMetaData[chapter].verses && chapter < 114}
			<Link to="/morphology/{+chapter + 1}:1" class={tabPillElement}>Chapter {+chapter + 1} {@html '&#x2192;'}</Link>
		{/if}
	</div>

	<div id="verse">
		{#await fetchData}
			<Spinner />
		{:then fetchData}
			<div class="flex flex-wrap justify-center direction-rtl">
				{#each Object.entries(fetchData) as [key, value]}
					<VersesWords {key} {value} />
				{/each}
			</div>
		{:catch error}
			<p>{error}</p>
		{/await}
	</div>

	<div id="word-summary" class="text-center opacity-70 mx-auto md:w-3/4 text-sm pb-6 border-b-2 md:text-lg">
		{#await fetchWordSummary}
			<span>...</span>
		{:then fetchWordSummary}
			<span>{fetchWordSummary.summary}</span>
		{:catch error}
			<p>{error}</p>
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
			<p>{error}</p>
		{/await}
	</div>

	<div id="word-root-data" class="pb-8 border-b-2">
		{#await fetchWordsData}
			<Spinner />
		{:then fetchWordsData}
			<MorphologyTable wordData={fetchWordsData[0].morphology.root.words_with_same_root} tableType={1} />
		{:catch error}
			<p>{error}</p>
		{/await}
	</div>

	<div id="exact-word-data" class="pb-8 border-b-2">
		{#await fetchWordsData}
			<Spinner />
		{:then fetchWordsData}
			<MorphologyTable wordData={fetchWordsData[0].morphology.exact_words_in_quran} tableType={2} />
		{:catch error}
			<p>{error}</p>
		{/await}
	</div>
</div>
