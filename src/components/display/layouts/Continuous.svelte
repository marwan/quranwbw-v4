<script>
	export let key, value;

	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import PageDivider from '$display/verses/PageDivider.svelte';
	import { updateSettings } from '$utils/updateSettings';
	import { inview } from 'svelte-inview';
</script>

{#if value}
	<!-- show page number  -->
	<PageDivider {key} page={value.meta.page} />

	<div id={key} data-words={value.meta.words} data-page={value.meta.page} data-juz={value.meta.juz} use:inview on:inview_enter={(event) => updateSettings({ type: 'lastRead', value: { key, page: value.meta.page } })} class="verse inline py-2 group">
		<WordsBlock {key} {value} />
	</div>
{/if}
