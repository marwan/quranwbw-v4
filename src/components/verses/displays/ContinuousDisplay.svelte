<script>
	export let key, value;

	import { inview } from 'svelte-inview';

	import VersesWords from '$verses/VersesWords.svelte';
	import { pageNumberKeys } from '$data/quranMeta';
	import { updateSettings } from '$utils/updateSettings';
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.includes(key)}
	<div class="justify-center my-4 theme-grayscale">
		<div class="flex items-center">
			<div class="flex-1 border-t-2 border-gray-200"></div>
			<span class="px-3">Page {value.meta.page}</span>
			<div class="flex-1 border-t-2 border-gray-200"></div>
		</div>
	</div>
{/if}

<div id={key} data-words={value.meta.words} data-page={value.meta.page} data-juz={value.meta.juz} use:inview on:inview_enter={(event) => updateSettings({ type: 'lastRead', value: `${event.target.id}` })} class="verse inline py-2 group">
	<VersesWords {key} {value} />
</div>
