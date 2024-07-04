<!-- for supplications and duas routes -->
<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage, __fontType, __displayType, __wordTranslation, __verseTranslations } from '$utils/stores';
	import { getSupplicationKeys } from '$utils/getSupplicationKeys';
	import { fetchVersesData } from '$utils/fetchData';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { term } from '$utils/terminologies';

	// fetch supplication verses
	$: fetchData = fetchVersesData(getSupplicationKeys(), $__fontType, $__wordTranslation, $__verseTranslations.toString());

	// only allow display type 1 & 2, and don't save the layout in settings
	if ([3, 4, 5].includes($__displayType)) $__displayType = 1;

	// __currentPage.set(`${term('supplications').toLowerCase()}`);
	__currentPage.set('supplications');
</script>

<PageHead title={`${term('supplications')} From Quran`} />

<div>
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
</div>
