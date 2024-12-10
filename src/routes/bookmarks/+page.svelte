<script>
	import PageHead from '$misc/PageHead.svelte';
	import Individual from '$display/verses/modes/Individual.svelte';
	import { __currentPage, __displayType, __userBookmarks, __keysToFetch } from '$utils/stores';

	// only allow display type 1 & 2, and don't save the layout in settings
	if ([3, 4, 5].includes($__displayType)) $__displayType = 1;

	// storing the keys
	__keysToFetch.set(null);
	__keysToFetch.set($__userBookmarks.toString());

	__currentPage.set('bookmarks');
</script>

<PageHead title={'Bookmarks'} />

<div id="individual-verses-block">
	<Individual />
</div>
