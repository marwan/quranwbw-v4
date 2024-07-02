<script>
	import Settings from '$svgs/Settings.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { __audioSettings } from '$utils/stores';
	import { __settingsDrawerHidden } from '$utils/stores';
</script>

<button type="button" title="Settings" on:click={() => ($__settingsDrawerHidden = false)} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
	<Settings />
	<span class="sr-only">Settings</span>
</button>
<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Settings</Tooltip>
