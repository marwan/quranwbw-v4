<script>
	export let key;

	import Spinner from '$svgs/Spinner.svelte';
	import { fetchSingleVerseData } from '$utils/fetchData';
	import { __fontType } from '$utils/stores';
	import { splitDelimiter } from '$data/websiteSettings';

	$: fontType = [1, 2, 3].includes($__fontType) ? 1 : 4;
	$: fetchData = fetchSingleVerseData(key, fontType);
</script>

{#await fetchData}
	<Spinner size="10" />
{:then data}
	<div class="direction-rtl text-3xl leading-normal arabic-font-{fontType}">
		{data[key].words.arabic.split(splitDelimiter).join(' ')}
		{data[key].words.end}
	</div>
{:catch error}
	<p>error.</p>
{/await}
