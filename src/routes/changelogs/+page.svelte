<script>
	import PageHead from '$misc/PageHead.svelte';
	import { __currentPage, __websiteTheme, __changelogModalVisible } from '$utils/stores';
	import { websiteChangelogs } from '$data/changelogs';

	$: if ($__currentPage) __changelogModalVisible.set(false);

	__currentPage.set('changelogs');
</script>

<PageHead title={'Changelogs'} />

<div id="changelog-list" class="flex flex-col space-y-6 text-sm">
	<div class="text-sm">
		{#each Object.entries(websiteChangelogs) as [key, changelog]}
			<div class="py-6 space-y-2 border-b {window.theme('border')}">
				<div id="changelog-title" class="font-medium text-lg">
					<span>{changelog.title}</span>

					{#if changelog.date !== null}
						<span class="opacity-70">({changelog.date})</span>
					{/if}
				</div>
				<div id="changelog-description" class="flex flex-col space-y-4">
					{#each changelog.description as description}
						<span>{@html description}</span>
					{/each}
				</div>

				{#if changelog.updates !== undefined}
					<div id="changelog-updates">
						<ul class="list-disc ml-5 space-y-2 pt-2">
							{#each changelog.updates as update}
								<li>{@html update}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
