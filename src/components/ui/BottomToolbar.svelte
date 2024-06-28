<script>
	import PlaySolid from '$svgs/PlaySolid.svelte';
	import Pause from '$svgs/Pause.svelte';
	import ChevronLeft from '$svgs/ChevronLeft.svelte';
	import ChevronRight from '$svgs/ChevronRight.svelte';
	import Settings from '$svgs/Settings.svelte';
	import Eye from '$svgs/Eye.svelte';
	import Plus from '$svgs/Plus.svelte';
	import Minus from '$svgs/Minus.svelte';
	import Cross from '$svgs/Cross.svelte';
	import ScrollDown from '$svgs/ScrollDown.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { __audioSettings } from '$utils/stores';
	import { __chapterNumber, __displayType, __currentPage, __bottomToolbarVisible, __settingsDrawerHidden, __autoScrollSpeed, __firstVerseOnPage } from '$utils/stores';
	import { playVerseAudio, setVersesToPlay, resetAudioSettings } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { disabledClasses } from '$data/commonClasses';
	import { updateSettings } from '$utils/updateSettings';
	// import { taphold } from 'svelte-taphold';

	const holdInterval = 100;

	let scrollModeEnabled = false;
	let scrollEnabled = false;

	// quick play from first verse of page till the max chapter verses
	function audioHandler() {
		if ($__audioSettings.isPlaying) {
			resetAudioSettings({ location: 'end' });
		} else {
			setVersesToPlay({ allVersesOnPage: true });

			playVerseAudio({
				key: `${window.versesToPlayArray[0]}`,
				timesToRepeat: 1,
				language: 'arabic'
			});
		}
	}

	// ====================================
	// scroll stuff
	// const scrollSpeeds = {
	// 	0: 'x5',
	// 	10: 'x4',
	// 	20: 'x3',
	// 	30: 'x2',
	// 	40: 'x1'
	// };

	// // start/stop scroll
	// $: {
	// 	if (scrollEnabled) {
	// 		pageScroll($__autoScrollSpeed);
	// 	} else {
	// 		clearAllIntervals();
	// 	}
	// }

	// function pageScroll(speed) {
	// 	window.scrollBy(0, 1);
	// 	setTimeout(`pageScroll(${speed})`, speed);
	// }

	// // need this to re-run the function
	// window.pageScroll = pageScroll;

	// function clearAllIntervals() {
	// 	for (let i = 1; i < 99999; i++) window.clearInterval(i);
	// }

	// function updateScrollSpeed(action) {
	// 	if (scrollEnabled) {
	// 		// stop all scrolls
	// 		clearAllIntervals();

	// 		// milliseconds
	// 		const minSpeed = 40;
	// 		const maxSpeed = 0;

	// 		const interval = 10; // minimum change
	// 		let updatedSpeed;

	// 		// decreasing the scroll speed by adding time
	// 		if (action === 'decrease') {
	// 			updatedSpeed = $__autoScrollSpeed + interval > minSpeed ? minSpeed : $__autoScrollSpeed + interval;
	// 		}

	// 		// increasing the scroll speed by subtracting time
	// 		else if (action === 'increase') {
	// 			updatedSpeed = $__autoScrollSpeed - interval < maxSpeed ? maxSpeed : $__autoScrollSpeed - interval;
	// 		}

	// 		// update value in store
	// 		updateSettings({ type: 'autoScrollSpeed', value: updatedSpeed });

	// 		// scroll the page with new speed
	// 		pageScroll(updatedSpeed);
	// 	}
	// }
</script>

<div class={['chapter'].includes($__currentPage) ? 'block' : 'hidden'}>
	<div class="{$__bottomToolbarVisible ? 'block' : 'hidden'} fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-sm -translate-x-1/2 bg-white border border-black/10 rounded-full bottom-4 left-1/2 theme">
		<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
			<!-- Previous Chapter -->
			<a href="/{$__chapterNumber - 1}" class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-lightGray group opacity-70 {$__chapterNumber === 1 && disabledClasses}">
				<ChevronLeft />
				<span class="sr-only">Previous {$__currentPage}</span>
			</a>
			<!-- <Tooltip arrow={false} type="light">Previous {$__currentPage}</Tooltip> -->

			<!-- normal / non-scroll mode -->
			{#if !scrollModeEnabled}
				<!-- 2nd icon -->
				<button type="button" title="Change Display" on:click={() => updateSettings({ type: 'displayType', value: $__displayType === 5 ? 1 : $__displayType + 1 })} class="opacity-70 inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray group {$__currentPage === 'page' && disabledClasses}">
					<Eye />
					<span class="sr-only">Display Type</span>
				</button>
				<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Display Type</Tooltip>

				<!-- scroll button (temp) -->
				<!-- <button
					type="button"
					title="Auto Scroll"
					on:click={() => {
						scrollEnabled = !scrollEnabled;
						scrollModeEnabled = !scrollModeEnabled;
					}}
					class="inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray {$__currentPage === 'page' && disabledClasses}"
				>
					<svelte:component this={!scrollEnabled ? ScrollDown : Cross} size={6} />
					<span class="sr-only">Scroll</span>
				</button>
				<Tooltip arrow={false} type="light" class="hidden md:block font-filter">Auto Scroll</Tooltip> -->

				<!-- 3rd icon -->
				<!-- play/pause button -->
				<div class="flex items-center justify-center">
					<button type="button" title={$__audioSettings.isPlaying ? 'Pause' : 'Play'} on:click={() => audioHandler()} class="inline-flex flex-col items-center justify-center w-10 h-10 font-medium bg-black/15 rounded-full group focus:ring-2 focus:ring-gray-300 focus:outline-none">
						<span class="opacity-70"><svelte:component this={$__audioSettings.isPlaying ? Pause : PlaySolid} /></span>
						<span class="sr-only">{$__audioSettings.isPlaying ? 'Pause' : 'Play'}</span>

						<!-- show badge when a verse is playing -->
						{#if $__audioSettings.isPlaying && $__audioSettings.audioType === 'verse'}
							<div class="absolute inline-flex items-center justify-center z-30 text-xs px-2 text-white bg-gray-500 border-2 border-white rounded-3xl -top-3 theme-grayscale">{$__audioSettings.playingKey}</div>
						{/if}
					</button>
				</div>
				<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">{$__audioSettings.isPlaying ? 'Pause' : 'Play'}</Tooltip>

				<!-- 4th icon -->
				<button type="button" title="Settings" on:click={() => ($__settingsDrawerHidden = false)} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
					<Settings />
					<span class="sr-only">Settings</span>
				</button>
				<Tooltip arrow={false} type="light" class="hidden md:block font-filter font-normal">Settings</Tooltip>
			{/if}

			<!-- ====================================================================== -->
			<!-- scroll mode -->
			<!-- {#if scrollModeEnabled}
				<button on:click={() => updateScrollSpeed('decrease')} type="button" title="Decrease Speed" class="{scrollEnabled === false && disabledClasses} inline-flex flex-col items-center justify-center px-5 relative inline-flex items-center hover:bg-lightGray group {$__currentPage === 'page' && disabledClasses}">
					<Minus size={5} />
				</button>

				<div class="flex items-center justify-center">
					<button
						on:click={() => {
							scrollEnabled = !scrollEnabled;
							scrollModeEnabled = !scrollModeEnabled;
						}}
						type="button"
						title={!scrollEnabled ? 'Start Scroll' : 'Stop Scroll'}
						class="inline-flex flex-col items-center justify-center w-10 h-10 font-medium bg-lightGray hover:bg-lightGray rounded-full group focus:ring-2 focus:ring-gray-300 focus:outline-none"
					>
						<svelte:component this={!scrollEnabled ? ScrollDown : Cross} size={6} />
						<span class="sr-only">Scroll</span>

						{#if scrollEnabled}
							<div class="absolute inline-flex items-center justify-center z-30 text-xs px-2 text-white bg-gray-500 border-2 border-white rounded-md -top-3 dark:border-gray-900">{scrollSpeeds[$__autoScrollSpeed]}</div>
						{/if}
					</button>
				</div>

				<button on:click={() => updateScrollSpeed('increase')} type="button" title="Increase Speed" class="{scrollEnabled === false && disabledClasses} inline-flex flex-col items-center justify-center px-5 hover:bg-lightGray group">
					<Plus size={5} />
				</button>
			{/if} -->

			<!-- Next Chapter -->
			<a href="/{$__chapterNumber + 1}" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-lightGray group opacity-70 {$__chapterNumber === 114 && disabledClasses}">
				<ChevronRight />
				<span class="sr-only">Next {$__currentPage}</span>
			</a>
			<!-- <Tooltip arrow={false} type="light">Next {$__currentPage}</Tooltip> -->
		</div>
	</div>
</div>
