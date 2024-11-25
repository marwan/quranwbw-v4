<script>
	import LeftNavigationButton from '$ui/BottomToolbar/LeftNavigationButton.svelte';
	import RightNavigationButton from '$ui/BottomToolbar/RightNavigationButton.svelte';
	import DisplayChangeButton from '$ui/BottomToolbar/DisplayChangeButton.svelte';
	import AudioButton from '$ui/BottomToolbar/AudioButton.svelte';
	import SettingsButton from '$ui/BottomToolbar/SettingsButton.svelte';
	import MushafMinimalMode from '$ui/BottomToolbar/MushafMinimalMode.svelte';
	import MenuBold from '$svgs/MenuBold.svelte';
	import Search2Bold from '$svgs/Search2Bold.svelte';
	import SupplicationBold from '$svgs/SupplicationBold.svelte';
	import MorphologyBold from '$svgs/MorphologyBold.svelte';
	import BookBold from '$svgs/BookBold.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { term } from '$utils/terminologies';
	import { __currentPage, __siteNavigationModalVisible, __quranNavigationModalVisible, __lastRead } from '$utils/stores';
</script>

{#if $__currentPage === 'home'}
	<button class="opacity-70 inline-flex flex-col items-center rounded-s-full justify-center px-5 hover:bg-lightGray group" on:click={() => __quranNavigationModalVisible.set(true)}>
		<Search2Bold size={5} />
		<span class="sr-only">Search</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Search</Tooltip>

	<a href={`/${term('supplications').toLowerCase()}`} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
		<SupplicationBold size={5} />
		<span class="sr-only">Supplication</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">{term('supplications')}</Tooltip>

	<div class="flex items-center justify-center">
		<a href={$__lastRead.hasOwnProperty('page') ? `/page/${$__lastRead.page}` : '/page/1'} class="inline-flex flex-col items-center justify-center w-12 h-12 bg-black/15 rounded-full group focus:ring-2 focus:ring-gray-300 focus:outline-none">
			<span class="opacity-70"><BookBold size={6} /></span>
			<span class="sr-only">Mushaf</span>
		</a>
	</div>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Mushaf</Tooltip>

	<a href="/morphology/1:1" class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
		<MorphologyBold size={5} />
		<span class="sr-only">Morphology</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Morphology</Tooltip>

	<button class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group" on:click={() => __siteNavigationModalVisible.set(true)}>
		<MenuBold size={5} />
		<span class="sr-only">Menu</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Menu</Tooltip>
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
