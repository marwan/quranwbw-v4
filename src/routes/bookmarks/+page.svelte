<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage, __fontType, __displayType, __wordTranslation, __verseTranslations, __userBookmarks } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchData';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { updateSettings } from '$utils/updateSettings';

	let fetchData;

	// fetch verses whenever there's a change
	$: {
		if (__userBookmarks.length != 0) {
			fetchData = fetchVersesData($__userBookmarks.toString(), $__fontType, $__wordTranslation, $__verseTranslations.toString());
		}
	}

	// only allow display type 1 & 2, and don't save the layout in settings
	if ([3, 4, 5].includes($__displayType)) updateSettings({ type: 'displayType', value: 1, skipSave: true });

	__currentPage.set('bookmarks');
</script>

<PageHead title={'Bookmarks'} />

<div class="">
	{#if $__userBookmarks.length === 0}
		<div class="flex items-center justify-center pt-28">You currently do not have any bookmarked verses.</div>
	{:else}
		{#await fetchData}
			<Spinner height="screen" margin="-mt-20" />
		{:then chapterData}
			<div>
				{#each Object.entries(chapterData) as [key, value]}
					<Individual {key} {value} />
				{/each}
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	{/if}
</div>
