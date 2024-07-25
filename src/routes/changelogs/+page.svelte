<script>
	import PageHead from '$misc/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage, __websiteTheme } from '$utils/stores';
	import { timeAgo } from '$utils/timeAgo';
	import { linkClasses } from '$data/commonClasses';

	let fetchCommitsData;

	// fetch the commits from our API
	$: {
		fetchCommitsData = (async () => {
			const response = await fetch(`${apiEndpoint}/repo/commits`);
			const data = await response.json();
			return data.data;
		})();
	}

	$: userAvatarClasses = `rounded-full inline-flex w-5 h-5 ${[2, 3, 4].includes($__websiteTheme) && 'invert'}`;

	__currentPage.set('changelogs');
</script>

<PageHead title={'Changelogs'} />

<div class="flex flex-col space-y-6 text-sm theme">
	<!-- commits -->
	<div id="commits">
		<div class="mt-6 mb-2 space-y-4 pb-4 border-b-2 border-black/10">
			<h1 class="text-2xl">Commits</h1>
			<div class="text-sm">
				The following list contains the latest 100 commits made to the QuranWBW.com's <a href="https://github.com/marwan/quranwbw-v4" target="_blank" class={linkClasses}>GitHub repository</a>.
			</div>
		</div>
		<div id="commits-list">
			{#await fetchCommitsData}
				<Spinner />
			{:then fetchCommitsData}
				<div class="text-sm">
					{#each Object.entries(fetchCommitsData) as [key, value]}
						<div class="py-6 space-y-2 border-b border-black/10">
							<div class="space-y-2">
								<div><a href={value.html_url} target="_blank" class="font-semibold">{value.commit.message}</a></div>
								<div>
									<img class={userAvatarClasses} src={value.author.avatar_url} alt={value.author.login} />
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
