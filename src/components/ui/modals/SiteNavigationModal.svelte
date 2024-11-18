<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Settings2 from '$svgs/Settings2.svelte';
	import TajweedRules from '$svgs/TajweedRules.svelte';
	import Supplication from '$svgs/Supplication.svelte';
	import Bookmark from '$svgs/Bookmark.svelte';
	import Search2 from '$svgs/Search2.svelte';
	import Morphology from '$svgs/Morphology.svelte';
	import Puzzle from '$svgs/Puzzle.svelte';
	import About from '$svgs/About.svelte';
	import Changelogs from '$svgs/Changelogs.svelte';
	import LegacySite from '$svgs/LegacySite.svelte';

	import { __siteNavigationModalVisible, __settingsDrawerHidden, __tajweedRulesModalVisible, __tokenModalVisible, __currentPage } from '$utils/stores';
	import { term } from '$utils/terminologies';

	const linkClasses = 'w-full flex flex-row space-x-2 py-4 px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl items-center cursor-pointer theme-grayscale';

	const internalLinks = [
		{
			title: term('supplications'),
			link: `/${term('supplications').toLowerCase()}`,
			icon: Supplication
		},
		{
			title: 'Bookmarks',
			link: '/bookmarks',
			icon: Bookmark
		},
		{
			title: 'Search',
			link: '/search',
			icon: Search2
		},
		{
			title: 'Morphology',
			link: '/morphology/1:1',
			icon: Morphology
		},
		{
			title: 'Guess The Word',
			link: '/games/guess-the-word',
			icon: Puzzle
		},
		{
			title: 'About',
			link: '/about',
			icon: About
		},
		{
			title: 'Changelogs',
			link: '/changelogs',
			icon: Changelogs
		}
	];

	// hide the modal when page changes
	$: if ($__currentPage) __siteNavigationModalVisible.set(false);
</script>

<Modal id="siteNavigationModal" bind:open={$__siteNavigationModalVisible} size="xs" class="rounded-3xl text-black theme" bodyClass="p-6" center outsideclose>
	<div class="flex flex-col space-y-4">
		<!-- modals / popups -->
		<div class="flex flex-col space-y-2">
			<div class="font-semibold">Navigate</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-1 overflow-y-scroll max-h-80">
				<!-- settings modal -->
				<button
					on:click={() => {
						__siteNavigationModalVisible.set(false);
						__settingsDrawerHidden.set(false);
					}}
					class={linkClasses}
				>
					<Settings2 size={5} />
					<span class="text-sm">Settings</span>
				</button>

				<!-- tajweed rules modal -->
				<button
					on:click={() => {
						__siteNavigationModalVisible.set(false);
						__tajweedRulesModalVisible.set(false);
					}}
					class={linkClasses}
				>
					<TajweedRules size={5} />
					<span class="text-sm">{term('tajweed')} Rules</span>
				</button>

				{#each Object.entries(internalLinks) as [id, link]}
					<a href={link.link} class={linkClasses}>
						<svelte:component this={link.icon} size={5} />
						<span class="text-sm">{link.title}</span>
					</a>
				{/each}

				<!-- legacy site link -->
				<a href="https://v3.quranwbw.com/" target="_blank" class={linkClasses}>
					<LegacySite size={5} />
					<span class="text-sm">Legacy Website</span>
				</a>
			</div>
		</div>
	</div>
</Modal>
