<script>
	import Eye from '$svgs/Eye.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { __chapterNumber, __displayType, __currentPage } from '$utils/stores';
	import { disabledClasses } from '$data/commonClasses';
	import { updateSettings } from '$utils/updateSettings';
</script>

<button type="button" title="Change Display" on:click={() => updateSettings({ type: 'displayType', value: $__displayType === 5 ? 1 : $__displayType + 1 })} class="inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray group {$__currentPage === 'page' ? disabledClasses : 'opacity-70'}">
	<Eye />
	<span class="sr-only">Display Type</span>
</button>
<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Display Type</Tooltip>
