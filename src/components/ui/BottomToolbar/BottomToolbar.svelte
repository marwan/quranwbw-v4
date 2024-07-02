<script>
	import LeftNavigationButton from '$ui/BottomToolbar/LeftNavigationButton.svelte';
	import RightNavigationButton from '$ui/BottomToolbar/RightNavigationButton.svelte';
	import DisplayChangeButton from '$ui/BottomToolbar/DisplayChangeButton.svelte';
	import AudioButton from '$ui/BottomToolbar/AudioButton.svelte';
	import SettingsButton from '$ui/BottomToolbar/SettingsButton.svelte';
	import ChapterModeButton from '$ui/BottomToolbar/ChapterModeButton.svelte';
	import { __currentPage, __bottomToolbarVisible } from '$utils/stores';
</script>

<div class="{['chapter', 'page'].includes($__currentPage) ? 'block' : 'hidden'} print:hidden">
	<div class="{$__bottomToolbarVisible ? 'block' : 'hidden'} fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-sm -translate-x-1/2 bg-white border border-black/10 rounded-full bottom-4 left-1/2 theme">
		<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
			<LeftNavigationButton />

			{#if $__currentPage === 'chapter'}
				<DisplayChangeButton />
			{:else}
				<ChapterModeButton />
			{/if}

			<AudioButton />
			<SettingsButton />
			<RightNavigationButton />
		</div>
	</div>
</div>
