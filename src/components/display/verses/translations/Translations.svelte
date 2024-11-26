<script>
	export let value;

	import Spinner from '$svgs/Spinner.svelte';
	import Layout from '$display/verses/translations/Layout.svelte';
	import { __currentPage, __verseKey, __verseTranslations, __verseTranslationData, __chapterData, __userSettings } from '$utils/stores';
	import { fetchVerseTranslationData } from '$utils/fetchData';

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	let verseTranslationData;

	$: verseTranslationClasses = `verseTranslationText flex flex-col space-y-4 leading-normal theme ${fontSizes.verseTranslationText}`;

	// setting the variables depending on the page
	$: chapterData = $__currentPage === 'page' ? JSON.parse(localStorage.getItem('pageData')) : $__chapterData;
	$: chapterToFetch = $__currentPage === 'page' ? +$__verseKey.split(':')[0] : value.meta.chapter;

	// for chapter and mushaf page, we fetch the verse translations for the whole chapter in one API call from the Chapter.svelte file
	// and for other pages like supplications & bookmarks, we fetch the translations for each verse because all can be different
	$: {
		if (!['chapter'].includes($__currentPage)) {
			(async () => {
				verseTranslationData = await fetchVerseTranslationData(chapterToFetch);
			})();
		}
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
				{#if $__verseTranslationData[value.meta.verse - 1].hasOwnProperty('translations')}
					<!-- after transliteration, show other translations -->
					{#each Object.entries($__verseTranslationData[Object.keys($__verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
						{#if verseTranslation.resource_id !== 57}
							<Layout verseTranslationID={verseTranslation.resource_id} {verseTranslation} {value} />
						{/if}
					{/each}
				{/if}
			{:else}
				<div class="mr-auto">
					<Spinner size="10" />
				</div>
			{/if}

			<!-- for other pages, we fetch chapter translations for each verse -->
		{:else}
			{#await verseTranslationData}
				<div class="mr-auto">
					<Spinner size="10" />
				</div>
			{:then verseTranslationData}
				<!-- tajweed/syllables transliteration -->
				{#if chapterData !== null}
					{#if $__verseTranslations.includes(1)}
						<Layout verseTranslationID={1} verseTranslation={chapterData[`${value.meta.chapter}:${value.meta.verse}`].translations[0]} {value} />
					{/if}

					{#if $__verseTranslations.includes(3)}
						<Layout verseTranslationID={3} verseTranslation={chapterData[`${value.meta.chapter}:${value.meta.verse}`].translations[1]} {value} />
					{/if}
				{/if}
				<!-- ================== -->

				<!-- after transliteration, show other translations -->
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
