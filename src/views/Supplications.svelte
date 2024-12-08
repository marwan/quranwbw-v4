<!-- for supplications and duas routes -->
<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import { __currentPage, __keysToFetch } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { supplicationsFromQuran } from '$data/quranMeta';

	// Function to get a string of all supplications chapter:verses
	function getSupplicationKeys() {
		let keysArray = [];

		for (const [key] of Object.entries(supplicationsFromQuran)) {
			keysArray.push(key);
		}

		return keysArray.toString();
	}

	// storing the keys
	__keysToFetch.set(null);
	__keysToFetch.set(getSupplicationKeys());

	// Set the current page to 'supplications'
	__currentPage.set('supplications');
</script>

<PageHead title={`Quranic ${term('supplications')}`} />

<div id="individual-verses-block">
	<Individual verses={$__keysToFetch} />
</div>
