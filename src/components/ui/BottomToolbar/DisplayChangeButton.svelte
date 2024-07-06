<script>
	import Dropdown from '$ui/flowbite-svelte/dropdown/Dropdown.svelte';
	import Eye from '$svgs/Eye.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import Radio from '$ui/flowbite-svelte/forms/Radio.svelte';
	import { __chapterNumber, __displayType, __currentPage, __selectedDisplayId } from '$utils/stores';
	import { selectableDisplays } from '$data/options';
	import { disabledClasses } from '$data/commonClasses';
	import { displayTypeChangeHandler } from '$utils/displayTypeChangeHandler';

	const radioClasses = 'font-normal';
	const dropdownClasses = 'w-52 p-3 space-y-3 text-sm max-h-64 overflow-y-scroll theme-grayscale';
</script>

<button id="changeDisplayButton" type="button" title="Display Type" class="inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray group {['chapter', 'page'].includes($__currentPage) ? 'opacity-70' : disabledClasses}">
	<Eye />
	<span class="sr-only">Display Type</span>
</button>
<Dropdown class={dropdownClasses}>
	{#each Object.entries(selectableDisplays) as [id, displayOption]}
		<li><Radio name="displayType" bind:group={$__selectedDisplayId} value={displayOption.displayID} on:change={(event) => displayTypeChangeHandler(+event.target.value)} class={radioClasses}>{displayOption.displayName}</Radio></li>
	{/each}
</Dropdown>
<Tooltip triggeredBy="#changeDisplayButton" arrow={false} type="light" class="hidden md:block font-filter font-normal">Display Type</Tooltip>
