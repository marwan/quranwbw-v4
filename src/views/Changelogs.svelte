<script>
	import PageMeta from '$components/PageMeta.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage } from '$utils/stores';
	import { timeAgo } from '$utils/timeAgo';
	import { linkElement } from '$data/commonStyles';

	let fetchData;

	// fetch the commits from our API
	$: {
		fetchData = (async () => {
			const response = await fetch('https://api.quranwbw.com/v1/repo/commits');
			const data = await response.json();
			return data.data;
		})();
	}

	__currentPage.set('changelogs');
</script>

<PageMeta title={'Changelogs'} />

<div class="">
	<div class="my-6 space-y-4 pb-4 border-b-2 dark:border-slate-700">
		<h1 class="text-2xl">Changelogs</h1>
		<div class="text-sm">
			This page contains all the commits made to the Quranwbw.com's <a href="https://github.com/marwan/quranwbw-svelte" target="_blank" class={linkElement}>GitHub repo</a>.

			<br /><br />
			<a href="https://github.com/marwan/quranwbw-svelte/commits/main/" target="_blank" class={linkElement}>https://github.com/marwan/quranwbw-svelte/commits/main</a>
		</div>
	</div>

	{#await fetchData}
		<Spinner />
	{:then fetchData}
		<div class="text-sm">
			{#each Object.entries(fetchData) as [key, value]}
				<div class="py-6 space-y-2 border-b dark:border-slate-700">
					<div class="space-y-2">
						<div><a href={value.html_url} target="_blank" class={linkElement}>{value.commit.message}</a></div>
						<div>
							<img class="rounded-full inline-flex w-5 h-5" src={value.author.avatar_url} alt={value.author.login} />
							{value.author.login} commited {timeAgo(value.commit.committer.date)} <span class="hidden md:inline-block">({value.sha.substring(0, 7)})</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
