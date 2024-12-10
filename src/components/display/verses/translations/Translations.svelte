<script>
	export let value;

	import Spinner from '$svgs/Spinner.svelte';
	import Layout from '$display/verses/translations/Layout.svelte';
	import Skeleton from '$ui/FlowbiteSvelte/skeleton/Skeleton.svelte';
	import { __currentPage, __verseKey, __verseTranslations, __verseTranslationData, __chapterData, __userSettings, __fontType, __wordTranslation, __wordTransliteration, __keysToFetch } from '$utils/stores';
	import { fetchChapterData, fetchVerseTranslationData } from '$utils/fetchData';

	let verseTranslationData, verseTransliterationData;

	$: fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	$: verseTranslationClasses = `verseTranslationText flex flex-col space-y-4 leading-normal ${fontSizes.verseTranslationText}`;

	// Setting the variables depending on the page
	$: chapterData = $__currentPage === 'mushaf' ? JSON.parse(localStorage.getItem('pageData')) : $__chapterData;
	$: chapterToFetch = $__currentPage === 'mushaf' ? parseInt($__verseKey.split(':')[0], 10) : value.meta.chapter;

	// Fetch verse translations for pages other than chapter
	$: if ($__currentPage !== 'chapter') {
		(async () => {
			verseTranslationData = await fetchVerseTranslationData(chapterToFetch, $__verseTranslations.toString());
			verseTransliterationData = await fetchChapterData({ chapter: value.meta.chapter, reRenderWhenTheseUpdates: $__verseTranslations });
		})();
	}
</script>

{#if $__verseTranslations.length > 0}
	<div class={verseTranslationClasses} data-fontSize={fontSizes.verseTranslationText}>
		<!-- for chapter page, we fetch the translation for the whole chapter in one go -->
		{#if $__currentPage === 'chapter'}
			{#if $__verseTranslationData}
				<!-- tajweed/syllables transliteration -->
				{#if $__verseTranslations.includes(1)}
					<Layout verseTranslationID={1} verseTranslation={chapterData[`${value.meta.chapter}:${value.meta.verse}`].translations[0]} {value} />
				{/if}

				<!-- tajweed/syllables transliteration -->
				{#if $__verseTranslations.includes(3)}
					<Layout verseTranslationID={3} verseTranslation={chapterData[`${value.meta.chapter}:${value.meta.verse}`].translations[1]} {value} />
				{/if}
				<!-- ================== -->

				<!-- data from Quran.com's API -->
				<!-- after transliteration, show other translations -->
				{#if $__verseTranslationData[value.meta.verse - 1].hasOwnProperty('translations')}
					{#each Object.entries($__verseTranslationData[Object.keys($__verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
						{#if verseTranslation.resource_id !== 57}
							<Layout verseTranslationID={verseTranslation.resource_id} {verseTranslation} {value} />
						{/if}
					{/each}
				{/if}
			{:else}
				<Skeleton size="xxl" class="mb-2.5" />
			{/if}

			<!-- for other pages, we fetch chapter translations for each verse -->
		{:else}
			<!-- Render verse transliterations -->
			{#await verseTransliterationData}
				<Skeleton size="xxl" class="mb-2.5" />
			{:then verseTransliterationData}
				{#if verseTransliterationData}
					{#if $__verseTranslations.includes(1)}
						<Layout verseTranslationID={1} verseTranslation={verseTransliterationData[`${value.meta.chapter}:${value.meta.verse}`].translations[0]} {value} />
					{/if}

					{#if $__verseTranslations.includes(3)}
						<Layout verseTranslationID={3} verseTranslation={verseTransliterationData[`${value.meta.chapter}:${value.meta.verse}`].translations[1]} {value} />
					{/if}
				{/if}
			{:catch error}
				<p>{error}</p>
			{/await}

			<!-- Render verse translations -->
			{#await verseTranslationData}
				<Skeleton size="xxl" class="mb-2.5" />
			{:then verseTranslationData}
				{#if verseTranslationData}
					{#if verseTranslationData[Object.keys(verseTranslationData)[value.meta.verse - 1]].hasOwnProperty('translations')}
						{#each Object.entries(verseTranslationData[Object.keys(verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
							{#if verseTranslation.resource_id !== 57}
								<Layout verseTranslationID={verseTranslation.resource_id} {verseTranslation} {value} />
							{/if}
						{/each}
					{/if}
				{/if}
			{:catch error}
				<p>{error}</p>
			{/await}
		{/if}
	</div>
{/if}
