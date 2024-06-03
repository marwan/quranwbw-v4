<script>
	export let key, value;

	const chapter = +key.split(':')[0];
	const verse = +key.split(':')[1];

	import { quickPlayAudio } from '$utils/audioController';
	import { __currentPage, __userSettings, __audioSettings, __verseKey } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import VersesOptionsDropdown from '$verses/VersesOptionsDropdown.svelte';
	import { Tooltip } from 'flowbite-svelte';

	// icons
	import Bookmark from '$svgs/Bookmark.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';
	import Play from '$svgs/Play.svelte';
	import Pause from '$svgs/Pause.svelte';
	import DotsHorizontal from '$svgs/DotsHorizontal.svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const buttonClasses = 'inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-3xl focus:shadow-outline hover:bg-lightGray print:hidden';

	let dropdownOpen = false;

	$: {
		try {
			// remove z-index from all button blocks and to button block of that specific verse
			if (dropdownOpen) {
				document.querySelectorAll('.verseButtons').forEach((element) => {
					element.classList.remove('z-10');
				});

				document.getElementsByClassName('verseButtons')[key.split(':')[1]].classList.add('z-10');
			}
		} catch (error) {
			// error
		}
	}
</script>

<div class="verseButtons flex flex-row space-x-2 z-10 theme-grayscale">
	<a href={$__currentPage === 'chapter' ? `#${chapter}:${verse}` : `/${chapter}/${verse}`} class="{buttonClasses} font-semibold" data-html2canvas-ignore>
		<div class="opacity-70">{key}</div>
	</a>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Verse {key}</Tooltip>

	<!-- play verse button -->
	<button on:click={() => quickPlayAudio(chapter, verse, verse)} class={buttonClasses} aria-label="Play">
		<div class="opacity-70">
			<svelte:component this={$__audioSettings.isPlaying && $__audioSettings.playingKey === key ? Pause : Play} size={3.5} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Play</Tooltip>

	<!-- bookmark/unbookmark button -->
	<button on:click={() => updateSettings({ type: 'userBookmarks', key, set: true })} class={buttonClasses} aria-label="Bookmark">
		<div class="opacity-70">
			<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} size={3.5} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Bookmark</Tooltip>

	<!-- verses option dropdown -->
	<button class={buttonClasses} aria-label="Options" on:click={() => __verseKey.set(key)}>
		<div class="opacity-70">
			<DotsHorizontal size={6} />
		</div>
	</button>
	<VersesOptionsDropdown page={value.meta.page} />
</div>
