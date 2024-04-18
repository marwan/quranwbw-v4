<script>
	import PageMeta from '$components/PageMeta.svelte';
	import IndividualVerses from '$verses/IndividualVerses.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage, __wordType, __displayType, __wordTranslation, __verseTranslations } from '$utils/stores';
	import { getSupplicationKeys } from '$utils/getSupplicationKeys';
	import { fetchVersesData } from '$utils/fetchChapterData';

	// fetch supplication verses
	$: fetchData = fetchVersesData(getSupplicationKeys(), $__wordType, $__wordTranslation, $__verseTranslations.toString());

	__currentPage.set('supplications');
</script>

<PageMeta title={'Supplications From Quran'} />

<div>
	{#await fetchData}
		<Spinner height="screen" margin="-mt-20" />
	{:then chapterData}
		<div>
			{#each Object.entries(chapterData) as [key, value]}
				<IndividualVerses {key} {value} />
			{/each}
		</div>
	{:catch error}
		<p>{error}</p>
	{/await}
</div>
