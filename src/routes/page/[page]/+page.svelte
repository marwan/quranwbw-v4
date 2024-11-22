<script>
	export let data;

	import SinglePage from './SinglePage.svelte';
	import { __currentPage, __displayType } from '$utils/stores';

	$: page = +data.page;

	// only allow continious normal mode, but skip saving the settings
	$__displayType = 4;

	__currentPage.set('page');
</script>

<div id="page-block" class="text-center text-xl mt-6 mb-14 overflow-x-hidden">
	<SinglePage page={1} />
	<!-- <SinglePage page="2" />
	<SinglePage page="3" />
	<SinglePage page="4" />
	<SinglePage page="5" />
	<SinglePage page="6" /> -->
</div>
