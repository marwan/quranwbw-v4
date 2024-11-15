<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Menu from '$svgs/Menu.svelte';
	import Settings from '$svgs/Settings.svelte';
	import Supplication from '$svgs/Supplication.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';
	import Search from '$svgs/Search.svelte';
	import Morphology from '$svgs/Morphology.svelte';

	import { __siteNavigationModalVisible } from '$utils/stores';
	import { term } from '$utils/terminologies';

	const linkClasses = 'w-full flex flex-row space-x-2 py-4 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl items-center cursor-pointer';

	const internalLinks = [
		{
			title: term('supplications'),
			link: `/${term('supplications').toLowerCase()}`,
			icon: Supplication
		},
		{
			title: 'Bookmarks',
			link: '/bookmarks',
			icon: Bookmarked
		},
		{
			title: 'Search',
			link: '/search',
			icon: Search
		},
		{
			title: 'Morphology',
			link: '/morphology/1:1',
			icon: Morphology
		},
		{
			title: 'Guess The Word',
			link: '/games/guess-the-word',
			icon: Settings
		},
		{
			title: 'About',
			link: '/about',
			icon: Settings
		},
		{
			title: 'Changelogs',
			link: '/changelogs',
			icon: Settings
		}
	];
</script>

<Modal id="siteNavigationModal" bind:open={$__siteNavigationModalVisible} size="xs" class="rounded-3xl theme" bodyClass="p-6" center outsideclose>
	<div class="flex flex-col space-y-4">
		<!-- modals / popups -->
		<div class="flex flex-col space-y-2">
			<div class="font-semibold">Navigate</div>
			<div class="grid grid-cols-1 gap-1">
				<!-- {#each { length: 5 } as _, link}
					<div class={linkClasses}>
						<Settings size={5} />
						<div class="text-sm">Setting {link}</div>
					</div>
				{/each} -->

				{#each Object.entries(internalLinks) as [id, link]}
					<div class={linkClasses}>
						<svelte:component this={link.icon} size={5} />
						<a href={link.link} class="text-sm">{link.title}</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Modal>
