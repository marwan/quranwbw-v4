<script>
	export let data;

	import SinglePage from './SinglePage.svelte';
	import { __currentPage, __displayType, __lastRead } from '$utils/stores';

	// only allow continious normal mode, but skip saving the settings
	$__displayType = 4;

	__currentPage.set('page');
</script>

<div id="page-block" class="text-center text-xl mt-6 mb-6 overflow-x-hidden">
	{#key +data.page}
		<SinglePage page={+data.page} />
	{/key}
</div>
