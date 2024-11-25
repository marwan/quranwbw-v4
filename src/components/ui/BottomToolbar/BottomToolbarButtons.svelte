<script>
	import LeftNavigationButton from '$ui/BottomToolbar/LeftNavigationButton.svelte';
	import RightNavigationButton from '$ui/BottomToolbar/RightNavigationButton.svelte';
	import DisplayChangeButton from '$ui/BottomToolbar/DisplayChangeButton.svelte';
	import AudioButton from '$ui/BottomToolbar/AudioButton.svelte';
	import SettingsButton from '$ui/BottomToolbar/SettingsButton.svelte';
	import MushafMinimalMode from '$ui/BottomToolbar/MushafMinimalMode.svelte';
	import Menu from '$svgs/Menu.svelte';
	import Search2 from '$svgs/Search2.svelte';
	import Supplication from '$svgs/Supplication.svelte';
	import Morphology from '$svgs/Morphology.svelte';
	import Book from '$svgs/Book.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { term } from '$utils/terminologies';
	import { __currentPage, __siteNavigationModalVisible, __quranNavigationModalVisible, __lastRead } from '$utils/stores';
</script>

{#if $__currentPage === 'home'}
	<button class="opacity-70 inline-flex flex-col items-center rounded-s-full justify-center px-5 hover:bg-lightGray group" on:click={() => __quranNavigationModalVisible.set(true)}>
		<Search2 size={4} />
		<span class="sr-only">Search</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Search</Tooltip>

	<a href={`/${term('supplications').toLowerCase()}`} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
		<Supplication size={4} />
		<span class="sr-only">Supplication</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">{term('supplications')}</Tooltip>

	<button class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group" on:click={() => __siteNavigationModalVisible.set(true)}>
		<Menu size={3.5} />
		<span class="sr-only">Menu</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Menu</Tooltip>

	<a href="/morphology/1:1" class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
		<Morphology size={4} />
		<span class="sr-only">Morphology</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Morphology</Tooltip>

	<a href={$__lastRead.hasOwnProperty('page') ? `/page/${$__lastRead.page}` : '/page/1'} class="opacity-70 inline-flex flex-col items-center rounded-e-full justify-center px-5 hover:bg-lightGray group">
		<Book size={4} />
		<span class="sr-only">Mushaf</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Mushaf</Tooltip>
{:else}
	<LeftNavigationButton />
	<DisplayChangeButton />
	<AudioButton />
	{#if $__currentPage === 'page'}
		<MushafMinimalMode />
	{:else}
		<SettingsButton />
	{/if}
	<RightNavigationButton />
{/if}
