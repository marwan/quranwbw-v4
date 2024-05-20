<script>
	export let key, value;

	const chapter = +key.split(':')[0];
	const verse = +key.split(':')[1];

	import { showAudioModal, quickPlayAudio } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __userSettings, __audioSettings, __verseKey, __notesModalVisible } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { getNotes } from '$utils/userNotes';
	// import { downloadVerseImage } from '$utils/downloadVerseImage';
	import { Tooltip, Dropdown, DropdownItem } from 'flowbite-svelte';

	// icons
	import Bookmark from '$svgs/Bookmark.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';
	import Play from '$svgs/Play.svelte';
	import Pause from '$svgs/Pause.svelte';
	import DotsHorizontal from '$svgs/DotsHorizontal.svelte';
	// import DotsVertical from '$svgs/DotsVertical.svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const dropdownItemClasses = 'font-normal rounded-3xl';
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

	// handle notes modal click
	function showNotesModal() {
		__verseKey.set(key);
		getNotes(key);
		__notesModalVisible.set(true);
	}

	// open share menu
	function shareVerse() {
		if (navigator.share) {
			navigator
				.share({
					title: `${quranMetaData[chapter].transliteration}, Verse ${verse}`,
					url: `https://quranwbw.com/${chapter}/${verse}`
				})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error));
		}
	}
</script>

<div class="verseButtons flex flex-row space-x-2 z-10 text-xs theme-grayscale">
	<a href={$__currentPage === 'chapter' ? './#' : `/${chapter}/${verse}`} class="{buttonClasses} font-bold" data-html2canvas-ignore>
		<div class="opacity-50">{key}</div>
	</a>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Verse {key}</Tooltip>

	<!-- play verse button -->
	<button on:click={() => quickPlayAudio(chapter, verse, verse)} class={buttonClasses}>
		<div class="opacity-50">
			<svelte:component this={$__audioSettings.isPlaying && $__audioSettings.playingKey === key ? Pause : Play} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Play</Tooltip>

	<!-- bookmark/unbookmark button -->
	<button on:click={() => updateSettings({ type: 'userBookmarks', key })} class={buttonClasses}>
		<div class="opacity-50">
			<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30 hidden md:block font-filter">Bookmark</Tooltip>

	<!-- verses option dropdown -->
	<button id="verse-{key}" class={buttonClasses}>
		<div class="opacity-50">
			<DotsHorizontal />
		</div>
	</button>

	<Dropdown bind:open={dropdownOpen} class="px-2 mr-2 my-2 w-fit">
		<!-- play verse button -->
		<DropdownItem
			class={dropdownItemClasses}
			on:click={() => {
				showAudioModal(key);
				dropdownOpen = false;
			}}
		>
			Advanced Play
		</DropdownItem>

		<!-- verse notes button -->
		<DropdownItem
			class={dropdownItemClasses}
			on:click={() => {
				showNotesModal();
				dropdownOpen = false;
			}}
		>
			Verse Notes
		</DropdownItem>

		<!-- verse page button -->
		<DropdownItem class={dropdownItemClasses}>
			<a href="/page/{value.meta.page}">
				Go to Page {value.meta.page}
			</a>
		</DropdownItem>

		<!-- verse morphology button -->
		<DropdownItem class={dropdownItemClasses}>
			<a href="/morphology/{chapter}:{verse}">Verse Morphology</a>
		</DropdownItem>

		<!-- share verse button -->
		<DropdownItem class={dropdownItemClasses} on:click={() => shareVerse()}>Share Verse</DropdownItem>

		<!-- Verse screenshot button -->
		<!-- <DropdownItem on:click={() => downloadVerseImage(key)}>
			<div class="flex flex-row items-center">
				<Photo />
				<span class="text-xs pl-2">Verse Screenshot</span>
			</div>
		</DropdownItem> -->
	</Dropdown>
</div>
