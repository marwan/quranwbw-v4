<script>
	import ExternalLink from '$svgs/ExternalLink.svelte';
	import Dropdown from '$ui/flowbite-svelte/dropdown/Dropdown.svelte';
	import DropdownItem from '$ui/flowbite-svelte/dropdown/DropdownItem.svelte';
	import { __settingsDrawerHidden, __tajweedRulesModalVisible, __tokenModalVisible } from '$utils/stores';

	let dropdownOpen = false;

	const internalLinks = [
		{
			title: 'Supplications',
			link: '/supplications'
		},
		{
			title: 'Bookmarks',
			link: '/bookmarks'
		},
		{
			title: 'Search',
			link: '/search'
		},
		{
			title: 'Morphology',
			link: '/morphology/1:1'
		},
		{
			title: 'Guess The Word',
			link: '/games/guess-the-word'
		},
		{
			title: 'FAQs',
			link: '/faq'
		},
		{
			title: 'About',
			link: '/about'
		},
		{
			title: 'Changelogs',
			link: '/changelogs'
		}
	];

	const dropdownItemClasses = 'font-normal rounded-3xl';
</script>

<Dropdown class="px-2 mr-2 my-2 w-[180px] max-w-xs max-h-64 overflow-y-scroll theme-grayscale" bind:open={dropdownOpen}>
	<!-- drawers / modals -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			__settingsDrawerHidden.set(false);
			dropdownOpen = false;
		}}>Settings</DropdownItem
	>
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			// toggleModal('tajweed-rules-modal', 'show');
			__tajweedRulesModalVisible.set(true);
			dropdownOpen = false;
		}}>Tajweed Rules</DropdownItem
	>
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			// toggleModal('token-modal', 'show');
			__tokenModalVisible.set(true);
			dropdownOpen = false;
		}}>Token Login</DropdownItem
	>
	<!-- <DropdownItem class={dropdownItemClasses} on:click={() => toggleModal('downloadModal', 'show')}>Download Data</DropdownItem> -->

	<!-- internal links -->
	{#each Object.entries(internalLinks) as [id, link]}
		<DropdownItem class={dropdownItemClasses} href={link.link}>{link.title}</DropdownItem>
	{/each}

	<!-- external links -->
	<DropdownItem class="{dropdownItemClasses} flex flex-row items-center justify-between" href="https://legacy.quranwbw.com/" target="_blank">
		Legacy Website
		<ExternalLink size={3} />
	</DropdownItem>
</Dropdown>
