<script>
	export let key, page;
	import { pageNumberKeys } from '$data/quranMeta';
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.includes(key)}
	<div class="flex flex-col text-center mx-auto w-full mt-14 py-2 px-4 text-sm cursor-pointer rounded-lg bg-lightGray">Page {page}</div>
{/if}
