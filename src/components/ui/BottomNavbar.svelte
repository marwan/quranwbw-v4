<script>
	import { Link } from 'svelte-routing';
	import { __audioSettings } from '$utils/stores';
	import { __chapterNumber, __pageNumber, __displayType, __currentPage, __bottomNavbarVisible, __settingsDrawerHidden } from '$utils/stores';
	import { quickPlayAudio } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { disabledElement } from '$data/commonStyles';
	import { updateSettings } from '$utils/updateSettings';
	import { Tooltip } from 'flowbite-svelte';

	// icons
	import PlaySolid from '$svgs/PlaySolid.svelte';
	import Pause from '$svgs/Pause.svelte';
	import ChevronLeft from '$svgs/ChevronLeft.svelte';
	import ChevronRight from '$svgs/ChevronRight.svelte';
	import Settings from '$svgs/Settings.svelte';
	import Eye from '$svgs/Eye.svelte';

	// quick play from first verse of page till the max chapter verses
	function audioHandler() {
		quickPlayAudio($__chapterNumber, +document.getElementsByClassName('verse')[0].id.split(':')[1], quranMetaData[$__chapterNumber].verses);
	}

	let previousNavigation, nextNavigation;
	let previousNavigationDisabled = false,
		nextNavigationDisabled = false;

	// there has to be a better way...
	$: {
		(previousNavigationDisabled = false), (nextNavigationDisabled = false);

		if ($__currentPage === 'chapter') {
			(previousNavigation = $__chapterNumber - 1), (nextNavigation = $__chapterNumber + 1);
			if ($__chapterNumber === 1) previousNavigationDisabled = true;
			if ($__chapterNumber === 114) nextNavigationDisabled = true;
		} else {
			(previousNavigation = `page/${$__pageNumber + 1}`), (nextNavigation = `page/${$__pageNumber - 1}`);
			if ($__pageNumber === 1) nextNavigationDisabled = true;
			if ($__pageNumber === 604) previousNavigationDisabled = true;
		}
	}
</script>

<div class={$__currentPage === 'chapter' || $__currentPage === 'page' ? 'block' : 'hidden'}>
	<div class="{$__bottomNavbarVisible === true ? 'block' : 'hidden'} fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-sm -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 theme-grayscale">
		<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
			<!-- Previous Chapter -->
			<Link to="/{previousNavigation}" class="{previousNavigationDisabled === true && disabledElement} inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-[#ebebeb] dark:hover:bg-[#ebebeb] group">
				<ChevronLeft />
				<span class="sr-only">Previous {$__currentPage}</span>
			</Link>
			<!-- <Tooltip type="light">Previous {$__currentPage}</Tooltip> -->

			<!-- 2nd icon -->
			<button type="button" title="Change Display" on:click={() => updateSettings({ type: 'displayType', value: $__displayType === 5 ? 1 : $__displayType + 1 })} class="opacity-70 inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-[#ebebeb] dark:hover:bg-[#ebebeb] group {$__currentPage === 'page' && disabledElement}">
				<Eye />
				<span class="sr-only">Display Type</span>
			</button>
			<Tooltip type="light">Display Type</Tooltip>

			<!-- 3rd icon -->
			<!-- play/pause button -->
			<div class="flex items-center justify-center">
				<button type="button" title="Play/Pause" on:click={() => audioHandler()} class="inline-flex flex-col items-center justify-center w-10 h-10 font-medium bg-[#ebebeb] hover:bg-[#ebebeb] rounded-full group focus:ring-2 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-800">
					<svelte:component this={$__audioSettings.isPlaying === true ? Pause : PlaySolid} />

					<span class="sr-only">Play/Pause</span>

					<!-- show badge when a verse is playing -->
					{#if $__audioSettings.isPlaying === true && $__audioSettings.audioType === 'verse'}
						<div class="absolute inline-flex items-center justify-center z-30 text-xs px-2 text-white bg-gray-500 border-2 border-white rounded-md -top-3 dark:border-gray-900">{$__audioSettings.playingKey}</div>
					{/if}
				</button>
			</div>
			<Tooltip type="light">Play/Pause</Tooltip>

			<!-- 4th icon -->
			<button type="button" title="Settings" on:click={() => ($__settingsDrawerHidden = false)} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-[#ebebeb] dark:hover:bg-[#ebebeb] group">
				<Settings />
				<span class="sr-only">Settings</span>
			</button>
			<Tooltip type="light">Settings</Tooltip>

			<!-- Next Chapter -->
			<Link to="/{nextNavigation}" class="{nextNavigationDisabled === true && disabledElement} inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-[#ebebeb] dark:hover:bg-[#ebebeb] group">
				<ChevronRight />
				<span class="sr-only">Next {$__currentPage}</span>
			</Link>
			<!-- <Tooltip type="light">Next {$__currentPage}</Tooltip> -->
		</div>
	</div>
</div>
