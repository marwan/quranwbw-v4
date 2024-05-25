<script>
	export let key, value;

	import { inview } from 'svelte-inview';
	import VersesWords from '$verses/VersesWords.svelte';
	import PageDivider from '$verses/PageDivider.svelte';
	import { pageNumberKeys } from '$data/quranMeta';
	import { updateSettings } from '$utils/updateSettings';
</script>

<!-- show page number  -->
<PageDivider {key} page={value.meta.page} />

<div id={key} data-words={value.meta.words} data-page={value.meta.page} data-juz={value.meta.juz} use:inview on:inview_enter={(event) => updateSettings({ type: 'lastRead', value: `${event.target.id}` })} class="verse inline py-2 group">
	<VersesWords {key} {value} />
</div>
