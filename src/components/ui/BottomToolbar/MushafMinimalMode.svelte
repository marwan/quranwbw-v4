<script>
	import Maximize from '$svgs/Maximize.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import { toggleMushafMinimalMode } from '$utils/toggleMushafMinimalMode';
</script>

<button id="mushafMinimalModeButton" type="button" title="Minimal Mode" class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group" on:click={toggleMushafMinimalMode}>
	<Maximize />
	<span class="sr-only">Minimal Mode</span>
</button>
<Tooltip triggeredBy="#mushafMinimalModeButton" arrow={false} type="light" class="hidden md:block font-filter font-normal">Minimal Mode</Tooltip>
