<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage, __fontType, __displayType, __wordTranslation, __wordTransliteration, __userBookmarks } from '$utils/stores';
	import { fetchVersesData } from '$utils/fetchData';
	import { errorLoadingDataMessage } from '$data/websiteSettings';

	// fetch verses whenever there's a change
	$: fetchData = $__userBookmarks.length > 0 && fetchVersesData($__userBookmarks.toString(), $__fontType, $__wordTranslation, $__wordTransliteration);

	// only allow display type 1 & 2, and don't save the layout in settings
	if ([3, 4, 5].includes($__displayType)) $__displayType = 1;

	__currentPage.set('bookmarks');
</script>

<PageHead title={'Bookmarks'} />

<div class="">
	{#if $__userBookmarks.length === 0}
		<div class="flex items-center justify-center pt-28">You currently do not have any bookmarks.</div>
	{:else}
		{#await fetchData}
			<Spinner height="screen" margin="-mt-20" />
		{:then data}
			{@const totalRecords = Object.keys(data).length}
			<div id="individual-verses-block">
				<Individual {data} startIndex={0} endIndex={totalRecords > 5 ? 5 : totalRecords} />
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	{/if}
</div>
