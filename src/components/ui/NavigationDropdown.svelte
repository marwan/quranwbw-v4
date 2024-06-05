<script>
	import ExternalLink from '$svgs/ExternalLink.svelte';
	import { __settingsDrawerHidden, __tajweedRulesModalVisible, __tokenModalVisible } from '$utils/stores';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

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
			link: '/quiz/guess-the-word'
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

<Dropdown class="px-2 mr-2 my-2 w-[180px] max-w-xs max-h-52 md:max-h-64 overflow-y-scroll" bind:open={dropdownOpen}>
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
		<a href={link.link}>
			<DropdownItem class={dropdownItemClasses}>{link.title}</DropdownItem>
		</a>
	{/each}

	<!-- external links -->
	<a href="https://legacy.quranwbw.com/" target="_blank">
		<DropdownItem class="{dropdownItemClasses} flex flex-row items-center justify-between">
			Legacy Website
			<ExternalLink size={3} />
		</DropdownItem>
	</a>
</Dropdown>
