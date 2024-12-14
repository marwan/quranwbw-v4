<script>
	import LeftNavigationButton from '$ui/BottomToolbar/LeftNavigationButton.svelte';
	import RightNavigationButton from '$ui/BottomToolbar/RightNavigationButton.svelte';
	import DisplayChangeButton from '$ui/BottomToolbar/DisplayChangeButton.svelte';
	import AudioButton from '$ui/BottomToolbar/AudioButton.svelte';
	import SettingsButton from '$ui/BottomToolbar/SettingsButton.svelte';
	import MushafMinimalMode from '$ui/BottomToolbar/MushafMinimalMode.svelte';
	import Menu from '$svgs/Menu.svelte';
	import Search2Bold from '$svgs/Search2Bold.svelte';
	import SupplicationBold from '$svgs/SupplicationBold.svelte';
	import MorphologyBold from '$svgs/MorphologyBold.svelte';
	import BookFilled from '$svgs/BookFilled.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import { term } from '$utils/terminologies';
	import { __currentPage, __siteNavigationModalVisible, __quranNavigationModalVisible, __lastRead } from '$utils/stores';
</script>

{#if $__currentPage === 'home'}
	<button class="inline-flex flex-col items-center rounded-s-full justify-center px-5 group {window.theme('hover')}" on:click={() => __quranNavigationModalVisible.set(true)}>
		<Search2Bold size={4} />
		<span class="sr-only">Search</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-normal">Search</Tooltip>

	<a href={`/${term('supplications').toLowerCase()}`} class="inline-flex flex-col items-center justify-center px-5 group {window.theme('hover')}">
		<SupplicationBold size={4} />
		<span class="sr-only">Supplication</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-normal">{term('supplications')}</Tooltip>

	<div class="flex items-center justify-center">
		<a href={$__lastRead.hasOwnProperty('page') ? `/page/${$__lastRead.page}` : '/page/1'} class="inline-flex flex-col items-center justify-center w-12 h-12 rounded-full group {window.theme('input')} {window.theme('bgSecondaryDark')}">
			<span><BookFilled size={5} /></span>
			<span class="sr-only">Mushaf</span>
		</a>
	</div>
	<Tooltip arrow={false} type="light" class="hidden md:block font-normal">Mushaf</Tooltip>

	<a href="/morphology/1:1" class="inline-flex flex-col items-center justify-center px-5 group {window.theme('hover')}">
		<MorphologyBold size={4} />
		<span class="sr-only">Morphology</span>
	</a>
	<Tooltip arrow={false} type="light" class="hidden md:block font-normal">Morphology</Tooltip>

	<button class="inline-flex flex-col items-center rounded-e-full justify-center px-5 group {window.theme('hover')}" on:click={() => __siteNavigationModalVisible.set(true)}>
		<Menu size={4} />
		<span class="sr-only">Menu</span>
	</button>
	<Tooltip arrow={false} type="light" class="hidden md:block font-normal">Menu</Tooltip>
{:else}
	<LeftNavigationButton />
	<DisplayChangeButton />
	<AudioButton />
	{#if $__currentPage === 'mushaf'}
		<MushafMinimalMode />
	{:else}
		<SettingsButton />
	{/if}
	<RightNavigationButton />
{/if}
