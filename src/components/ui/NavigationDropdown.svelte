<script>
	import { Link } from 'svelte-routing';
	import { __settingsDrawerHidden, __tajweedRulesModalVisible, __tokenModalVisible } from '$utils/stores';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	// icons
	import ExternalLink from '$svgs/ExternalLink.svelte';

	let dropdownOpen = false;

	const internalLinks = {
		1: {
			title: 'Supplications',
			link: '/supplications'
		},
		2: {
			title: 'Bookmarks',
			link: '/bookmarks'
		},
		3: {
			title: 'Search',
			link: '/search'
		},
		4: {
			title: 'Morphology',
			link: '/morphology/1:1'
		},
		5: {
			title: 'FAQs',
			link: '/faq'
		},
		6: {
			title: 'About',
			link: '/about'
		},
		7: {
			title: 'Changelogs',
			link: '/changelogs'
		}
	};

	const dropdownItemClasses = 'font-normal rounded-3xl';
</script>

<Dropdown class="px-2 mr-2 my-2 w-[180px] max-w-xs max-h-52 md:max-h-64 overflow-y-scroll" bind:open={dropdownOpen}>
	<!-- drawers / modals -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			$__settingsDrawerHidden = false;
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
	<!-- <DropdownItem class={dropdownItemClasses} on:click={() => toggleModal('download-modal', 'show')}>Download Data</DropdownItem> -->

	<!-- internal links -->
	{#each Object.entries(internalLinks) as [id, link]}
		<Link to={link.link}>
			<DropdownItem class={dropdownItemClasses}>{link.title}</DropdownItem>
		</Link>
	{/each}

	<!-- external links -->
	<a href="https://legacy.quranwbw.com/" target="_blank">
		<DropdownItem class="{dropdownItemClasses} flex flex-row items-center justify-between">
			Legacy Website
			<ExternalLink />
		</DropdownItem>
	</a>
</Dropdown>
