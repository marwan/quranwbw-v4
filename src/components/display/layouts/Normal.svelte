<script>
	export let key, value;

	import { inview } from 'svelte-inview';
	import OptionButtons from '$display/verses/OptionButtons.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Translations from '$display/verses/Translations.svelte';
	import PageDivider from '$display/verses/PageDivider.svelte';
	import { updateSettings } from '$utils/updateSettings';
</script>

<!-- show page number  -->
<PageDivider {key} page={value.meta.page} />

<div id={key} data-words={value.meta.words} data-page={value.meta.page} data-juz={value.meta.juz} use:inview on:inview_enter={(event) => updateSettings({ type: 'lastRead', value: `${event.target.id}` })} class="verse flex flex-col py-8 space-y-8">
	<OptionButtons {key} {value} />

	<!-- words -->
	<div class="flex flex-row-reverse flex-wrap">
		<WordsBlock {key} {value} />
	</div>

	<!-- verse translations and transliterations -->
	<Translations {value} />
</div>

<div class="border-b theme-grayscale"></div>
