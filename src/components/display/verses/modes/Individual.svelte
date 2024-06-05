<!-- component to load verses for supplications and bookmarks -->
<script>
	export let key, value;

	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import { updateSettings } from '$utils/updateSettings';
	import { __displayType } from '$utils/stores';

	// set the display back to type 1, in case it was 3, 4 or 5
	if ($__displayType > 2) {
		updateSettings({ type: 'displayType', value: 1 });
	}
</script>

<svelte:component this={$__displayType === 1 ? WordByWord : Normal} {key} {value} />
