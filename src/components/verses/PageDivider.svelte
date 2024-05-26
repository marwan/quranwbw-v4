<script>
	export let key, page;
	import { pageNumberKeys } from '$data/quranMeta';
	import { __currentPage } from '$utils/stores';
</script>

<!-- if the current key is the first verse of a page  -->
{#if $__currentPage === 'chapter'}
	{#if pageNumberKeys.includes(key)}
		<div class="flex flex-col text-center mx-auto w-full mt-14 mb-1 py-2 px-4 text-sm cursor-pointer rounded-lg bg-lightGray">Page {page}</div>
	{/if}
{/if}
