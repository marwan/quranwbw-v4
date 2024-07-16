<script>
	export let value;

	import Spinner from '$svgs/Spinner.svelte';
	import Layout from './Layout.svelte';
	import { __currentPage, __userSettings, __verseTranslations, __verseTranslationData } from '$utils/stores';

	let thisVerseTranslation;

	$: {
		if ($__currentPage === 'chapter') thisVerseTranslation = $__verseTranslations;
		else
			thisVerseTranslation = (async () => {
				const apiURL = `https://api.qurancdn.com/api/qdc/verses/by_chapter/${value.meta.chapter}?per_page=286&translations=${$__verseTranslations.toString()}`;
				const response = await fetch(apiURL);
				const data = await response.json();
				return data.verses;
			})();
	}
</script>

{#if $__currentPage === 'chapter'}
	{#if $__verseTranslationData}
		<Layout data={$__verseTranslationData} {value} />
	{:else}
		<Spinner size="14" />
	{/if}
{:else}
	{#await thisVerseTranslation}
		<Spinner size="14" />
	{:then thisVerseTranslation}
		<Layout data={thisVerseTranslation} {value} />
	{:catch error}
		<p>{error}</p>
	{/await}
{/if}
