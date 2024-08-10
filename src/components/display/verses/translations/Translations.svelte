<script>
	export let value;

	import Spinner from '$svgs/Spinner.svelte';
	import Layout from '$display/verses/translations/Layout.svelte';
	import { __currentPage, __verseTranslations, __verseTranslationData, __chapterData, __userSettings } from '$utils/stores';
	import { fetchVerseTranslationData } from '$utils/fetchData';

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	let verseTranslationData;

	$: verseTranslationClasses = `verseTranslationText flex flex-col space-y-4 leading-normal theme ${fontSizes.verseTranslationText}`;

	// for chapter and mushaf page, we fetch the verse translations for the whole chapter in one API call from the Chapter.svelte file
	// and for other pages like supplications & bookmarks, we fetch the translations for each verse because all can be different
	$: {
		if (!['chapter', 'page'].includes($__currentPage)) {
			(async () => {
				verseTranslationData = await fetchVerseTranslationData(value.meta.chapter);
			})();
		}
	}
</script>

{#if $__verseTranslations.length > 0}
	<div class={verseTranslationClasses} data-fontSize={fontSizes.verseTranslationText}>
		<!-- for chapter page, we fetch the translation for the whole chapter in one go -->
		{#if $__currentPage === 'chapter'}
			{#if $__verseTranslationData}
				<!-- tajweed transliteration -->
				{#if $__verseTranslations.includes(1)}
					<Layout data={$__chapterData} {value} />
				{/if}

				<!-- always show transliteration (resource id 57) on top -->
				{#each Object.entries($__verseTranslationData[Object.keys($__verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
					{#if verseTranslation.resource_id === 57}
						<Layout {verseTranslationID} {verseTranslation} {value} />
					{/if}
				{/each}

				<!-- after transliteration, show other translations -->
				{#each Object.entries($__verseTranslationData[Object.keys($__verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
					{#if verseTranslation.resource_id !== 57}
						<Layout {verseTranslationID} {verseTranslation} {value} />
					{/if}
				{/each}
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
				<!-- tajweed transliteration -->
				{#if $__verseTranslations.includes(1)}
					<Layout data={$__chapterData} {value} />
				{/if}

				{#if verseTranslationData}
					<!-- always show transliteration (resource id 57) on top -->
					{#each Object.entries(verseTranslationData[Object.keys(verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
						{#if verseTranslation.resource_id === 57}
							<Layout {verseTranslationID} {verseTranslation} {value} />
						{/if}
					{/each}

					<!-- after transliteration, show other translations -->
					{#each Object.entries(verseTranslationData[Object.keys(verseTranslationData)[value.meta.verse - 1]].translations) as [verseTranslationID, verseTranslation]}
						{#if verseTranslation.resource_id !== 57}
							<Layout {verseTranslationID} {verseTranslation} {value} />
						{/if}
					{/each}
				{/if}
			{:catch error}
				<p>{error}</p>
			{/await}
		{/if}
	</div>
{/if}
