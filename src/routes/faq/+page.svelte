<script>
	import PageMeta from '$components/PageMeta.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __currentPage } from '$utils/stores';
	import { linkElement } from '$data/commonStyles';
	import { errorLoadingDataMessage } from '$data/websiteSettings';

	let fetchData;

	// fetch the FAQ from our API
	$: {
		fetchData = (async () => {
			const response = await fetch('https://api.quranwbw.com/faq.json');
			const data = await response.json();
			return data;
		})();
	}

	// https://stackoverflow.com/a/59862556
	function linkMarkdown(string) {
		return string.replace(/\[.*?\]\(.*?\)/g, (text) => {
			let [fullmatch, name, link] = /\[(.*?)\]\((.*?)\)/g.exec(text);
			return `<a href="${link}" target="_blank" class="${linkElement}">${name}</a>`;
		});
	}

	__currentPage.set('faq');
</script>

<PageMeta title={'FAQ'} />

<div class="">
	<div class="my-6 space-y-4 pb-4 border-b-2">
		<h1 class="text-2xl">Frequently Asked Questions</h1>
	</div>

	{#await fetchData}
		<Spinner />
	{:then fetchData}
		<div class="text-sm">
			{#each Object.entries(fetchData) as [key, value]}
				<div id={+key + 1} class="py-6 space-y-2 border-b">
					<div class="flex flex-col space-y-2">
						<div class="font-medium">#{+key + 1}: {value.question}</div>
						<div>{@html linkMarkdown(value.answer)}</div>
					</div>
				</div>
			{/each}
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
