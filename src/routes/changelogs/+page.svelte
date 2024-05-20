<script>
	import PageHead from '$components/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage } from '$utils/stores';
	import { timeAgo } from '$utils/timeAgo';
	import { buttonElement, linkElement, labelPillElement } from '$data/commonStyles';

	let fetchCommitsData, fetchIssuesData;

	// fetch the commits from our API
	$: {
		fetchCommitsData = (async () => {
			const response = await fetch('https://api.quranwbw.com/v1/repo/commits');
			const data = await response.json();
			return data.data;
		})();
	}

	// fetch the issues from our API
	$: {
		fetchIssuesData = (async () => {
			const response = await fetch('https://api.quranwbw.com/v1/repo/issues');
			const data = await response.json();
			return data.data;
		})();
	}

	__currentPage.set('changelogs');
</script>

<PageHead title={'Changelogs'} />

<div class="flex flex-col space-y-6 text-sm">
	<div class="flex flex-row space-x-4 items-center mt-6">
		<span>Go to:</span>
		<a href="#issues" class={buttonElement}>Issues</a>
		<a href="#commits" class={buttonElement}>Commits</a>
	</div>

	<!-- issues -->
	<div id="issues">
		<div class="mt-6 mb-2 space-y-4 pb-4 border-b-2">
			<h1 class="text-2xl">Issues</h1>
			<div class="text-sm">
				The following list contains all the issues currently active on the Quranwbw.com's <a href="https://github.com/marwan/quranwbw-v4" target="_blank" class={linkElement}>GitHub repo</a>.
			</div>
		</div>
		<div id="issues-list">
			{#await fetchIssuesData}
				<Spinner />
			{:then fetchIssuesData}
				<div class="text-sm">
					{#each Object.entries(fetchIssuesData) as [key, value]}
						<div class="py-6 space-y-2 border-b">
							<div class="space-y-2">
								<a href={value.html_url} target="_blank" class={linkElement}>Issue #{value.number}: {value.title}</a>

								<!-- labels -->
								<div class="inline-flex ml-2 space-x-2">
									{#each Object.entries(value.labels) as [id, label]}
										<span class={labelPillElement}>{label.name}</span>
									{/each}
								</div>
								<div>
									<img class="rounded-full inline-flex w-5 h-5" src={value.user.avatar_url} alt={value.user.login} />
									{value.user.login} opened {timeAgo(value.created_at)} (#{value.number})
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:catch error}
				<p>{errorLoadingDataMessage}</p>
			{/await}
		</div>
	</div>

	<!-- commits -->
	<div id="commits">
		<div class="mt-6 mb-2 space-y-4 pb-4 border-b-2">
			<h1 class="text-2xl">Commits</h1>
			<div class="text-sm">
				The following list contains the latest 100 commits made to the Quranwbw.com's <a href="https://github.com/marwan/quranwbw-v4" target="_blank" class={linkElement}>GitHub repo</a>.
			</div>
		</div>
		<div id="commits-list">
			{#await fetchCommitsData}
				<Spinner />
			{:then fetchCommitsData}
				<div class="text-sm">
					{#each Object.entries(fetchCommitsData) as [key, value]}
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
	</div>
</div>
