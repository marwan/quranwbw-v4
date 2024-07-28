<script>
	import Eye from '$svgs/Eye.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { __chapterNumber, __displayType, __currentPage, __selectedDisplayId, __settingsSelectorModal } from '$utils/stores';
	import { disabledClasses } from '$data/commonClasses';

	const radioClasses = 'font-normal';
	const dropdownClasses = 'w-52 p-3 space-y-3 text-sm max-h-64 overflow-y-scroll theme-grayscale';
</script>

<button id="changeDisplayButton" type="button" title="Display Type" class="inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray group {['chapter', 'page'].includes($__currentPage) ? 'opacity-70' : disabledClasses}" on:click={() => __settingsSelectorModal.set({ visible: true, title: 'Display Type' })}>
	<Eye />
	<span class="sr-only">Display Type</span>
</button>
<Tooltip triggeredBy="#changeDisplayButton" arrow={false} type="light" class="hidden md:block font-filter font-normal">Display Type</Tooltip>
