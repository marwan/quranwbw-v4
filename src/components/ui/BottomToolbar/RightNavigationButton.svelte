<script>
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import ChevronRight from '$svgs/ChevronRight.svelte';
	import { __chapterNumber, __currentPage, __pageNumber } from '$utils/stores';
	import { disabledClasses } from '$data/commonClasses';

	let linkHref;
	let linkText;
	let linkDisabled;

	$: {
		// chapter (left to right navigation)
		if ($__currentPage === 'chapter') {
			linkHref = $__chapterNumber + 1;
			linkText = 'Next Chapter';
			linkDisabled = $__chapterNumber === 114 ? true : false;
		}

		// page/mushaf (right to left navigation)
		else if ($__currentPage === 'page') {
			linkHref = `page/${$__pageNumber - 1}`;
			linkText = 'Previous Page';
			linkDisabled = $__pageNumber === 1 ? true : false;
		}
	}
</script>

<!-- next chapter / previous page -->
<a href="/{linkHref}" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-lightGray group {linkDisabled ? disabledClasses : 'opacity-70'}">
	<ChevronRight />
	<span class="sr-only">{linkText}</span>
</a>
<Tooltip arrow={false} type="light" class="w-max hidden md:block font-filter font-normal">{linkText}</Tooltip>
