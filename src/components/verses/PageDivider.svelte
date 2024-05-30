<script>
	export let key, page;
	import { pageNumberKeys } from '$data/quranMeta';
	import { __currentPage, __displayType } from '$utils/stores';
	import { displayOptions } from '$data/options';
</script>

<!-- if the current key is the first verse of a page  -->
{#if $__currentPage === 'chapter'}
	{#if pageNumberKeys.includes(key)}
		<div class="flex flex-col text-center mx-auto w-full mt-8 {displayOptions[`${$__displayType}`].continuous ? 'mb-4' : 'mb-1'} py-2 px-4 text-sm cursor-pointer rounded-lg bg-lightGray">Page {page}</div>
	{/if}
{/if}
