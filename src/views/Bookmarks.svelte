<script>
	import PageMeta from '$components/PageMeta.svelte';
	import IndividualVerses from '$verses/IndividualVerses.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage, __wordType, __displayType, __wordTranslation, __verseTranslations, __userBookmarks } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchChapterData';

	let fetchData;

	// fetch verses whenever there's a change
	$: {
		if (__userBookmarks.length != 0) {
			fetchData = fetchVersesData($__userBookmarks.toString(), $__wordType, $__wordTranslation, $__verseTranslations.toString());
		}
	}

	__currentPage.set('bookmarks');
</script>

<PageMeta title={'Bookmarks'} />

<div class="">
	{#if $__userBookmarks.length === 0}
		<div class="flex items-center justify-center pt-28">You currently do not have any bookmarked verses.</div>
	{:else}
		{#await fetchData}
			<Spinner height="screen" margin="-mt-20" />
		{:then chapterData}
			<div>
				{#each Object.entries(chapterData) as [key, value]}
					<IndividualVerses {key} {value} />
				{/each}
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	{/if}
</div>
