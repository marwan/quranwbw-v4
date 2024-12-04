<script>
	import Eye from '$svgs/Eye.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import DisplayTypeSelector from '$ui/SettingsDrawer/DisplayTypeSelector.svelte';
	import { __chapterNumber, __displayType, __currentPage, __selectedDisplayId, __settingsSelectorModal } from '$utils/stores';
	import { disabledClasses } from '$data/commonClasses';
</script>

<button id="changeDisplayButton" type="button" title="Display Type" class="inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center group {window.theme('hover')} {['chapter', 'mushaf'].includes($__currentPage) ? 'opacityyy-70' : disabledClasses}" on:click={() => __settingsSelectorModal.set({ component: DisplayTypeSelector, visible: true, title: 'Display Type' })}>
	<Eye />
	<span class="sr-only">Display Type</span>
</button>
<Tooltip triggeredBy="#changeDisplayButton" arrow={false} type="light" class="hidden md:block font-normal">Display Type</Tooltip>
