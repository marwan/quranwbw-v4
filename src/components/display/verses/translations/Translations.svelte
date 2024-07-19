<script>
	export let value;

	import Spinner from '$svgs/Spinner.svelte';
	import Layout from '$display/verses/translations/Layout.svelte';
	import { __currentPage, __verseTranslations, __verseTranslationData } from '$utils/stores';
	import { fetchVerseTranslationData } from '$utils/fetchData';

	let verseTranslationData;

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
	{#if $__currentPage === 'chapter'}
		{#if $__verseTranslationData}
			<Layout data={$__verseTranslationData} {value} />
		{:else}
			<div class="mr-auto">
				<Spinner size="10" />
			</div>
		{/if}
	{:else}
		{#await verseTranslationData}
			<div class="mr-auto">
				<Spinner size="10" />
			</div>
		{:then verseTranslationData}
			<Layout data={verseTranslationData} {value} />
		{:catch error}
			<p>{error}</p>
		{/await}
	{/if}
{/if}
