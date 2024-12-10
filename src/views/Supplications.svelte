<!-- for supplications and duas routes -->
<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import { __currentPage, __keysToFetch } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { supplicationsFromQuran } from '$data/quranMeta';

	// storing the keys
	__keysToFetch.set(null);
	__keysToFetch.set(Object.keys(supplicationsFromQuran).toString());

	// Set the current page to 'supplications'
	__currentPage.set('supplications');
</script>

<PageHead title={`Quranic ${term('supplications')}`} />

<div id="individual-verses-block">
	<Individual />
</div>
