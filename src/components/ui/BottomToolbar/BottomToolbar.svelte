<script>
	import LeftNavigationButton from '$ui/BottomToolbar/LeftNavigationButton.svelte';
	import RightNavigationButton from '$ui/BottomToolbar/RightNavigationButton.svelte';
	import DisplayChangeButton from '$ui/BottomToolbar/DisplayChangeButton.svelte';
	import AudioButton from '$ui/BottomToolbar/AudioButton.svelte';
	import SettingsButton from '$ui/BottomToolbar/SettingsButton.svelte';
	import MushafMinimalMode from '$ui/BottomToolbar/MushafMinimalMode.svelte';
	// import ChapterModeButton from '$ui/BottomToolbar/ChapterModeButton.svelte';
	import { __currentPage, __bottomToolbarVisible } from '$utils/stores';
</script>

<div id="bottom-toolbar" class="print:hidden {['chapter', 'page'].includes($__currentPage) ? 'block' : 'hidden'}">
	<div class="fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-sm -translate-x-1/2 bg-white border border-black/10 rounded-full bottom-4 left-1/2 theme {$__bottomToolbarVisible ? 'block' : 'hidden'}">
		<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
			<LeftNavigationButton />
			<DisplayChangeButton />
			<AudioButton />

			{#if $__currentPage === 'page'}
				<MushafMinimalMode />
			{:else}
				<SettingsButton />
			{/if}

			<RightNavigationButton />
		</div>
	</div>
</div>
