<script>
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import ChevronLeft from '$svgs/ChevronLeft.svelte';
	import { __chapterNumber, __currentPage, __pageNumber } from '$utils/stores';
	import { disabledClasses } from '$data/commonClasses';
	import { term } from '$utils/terminologies';

	let linkHref;
	let linkText;
	let linkDisabled;

	$: {
		// chapter (left to right navigation)
		if ($__currentPage === 'chapter') {
			linkHref = $__chapterNumber - 1;
			linkText = `Previous ${term('chapter')}`;
			linkDisabled = $__chapterNumber === 1 ? true : false;
		}

		// page/mushaf (right to left navigation)
		else if ($__currentPage === 'page') {
			linkHref = `page/${$__pageNumber + 1}`;
			linkText = 'Next Page';
			linkDisabled = $__pageNumber === 604 ? true : false;
		}
	}
</script>

<!-- previous chapter / next page -->
<a href="/{linkHref}" class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-lightGray group {linkDisabled ? disabledClasses : 'opacity-70'}">
	<ChevronLeft />
	<span class="sr-only">{linkText}</span>
</a>
<Tooltip arrow={false} type="light" class="w-max hidden md:block font-filter font-normal">{linkText}</Tooltip>
