<script>
	export let key;

	const chapter = +key.split(':')[0];
	const verse = +key.split(':')[1];

	import { Link } from 'svelte-routing';
	import { showAudioModal } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __userSettings, __audioSettings, __verseKey } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { toggleModal } from '$utils/toggleModal';
	import { getNotes } from '$utils/userNotes';
	import { downloadVerseImage } from '$utils/downloadVerseImage';
	import { Tooltip, Dropdown, DropdownItem } from 'flowbite-svelte';

	// icons
	import Bookmark from '$svgs/Bookmark.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';
	import Book from '$svgs/Book.svelte';
	import Photo from '$svgs/Photo.svelte';
	import Notes from '$svgs/Notes.svelte';
	import Play from '$svgs/Play.svelte';
	import Pause from '$svgs/Pause.svelte';
	import ShareOutline from '$svgs/ShareOutline.svelte';
	import DotsVertical from '$svgs/DotsVertical.svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const buttonClasses = 'inline-flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-150 rounded-lg focus:shadow-outline bg-[#ebebeb] hover:bg-gray-200 print:hidden dark:bg-slate-800 dark:hover:bg-slate-700';

	let dropdownOpen = false;

	$: {
		try {
			// remove z-index from all button blocks and to button block of that specific verse
			if (dropdownOpen === true) {
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
		toggleModal('notes-modal', 'show');
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

<div class="verseButtons flex flex-row space-x-2 z-10 text-gray-400 text-xs theme-grayscale">
	<Link to={$__currentPage === 'chapter' ? './#' : `/${chapter}/${verse}`} class={buttonClasses} data-html2canvas-ignore>{key}</Link>
	<Tooltip type="light" placement="right">Verse {key}</Tooltip>

	<!-- verses option dropdown -->
	<button id="verse-{key}" class={buttonClasses}>
		<DotsVertical />
	</button>

	<Dropdown bind:open={dropdownOpen}>
		<!-- play verse button -->
		<DropdownItem
			on:click={() => {
				showAudioModal(key);
				dropdownOpen = false;
			}}
		>
			<div class="flex flex-row items-center">
				<svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
				<span class="text-xs pl-2">{$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? 'Stop Playing' : 'Play Verse'}</span>
			</div>
		</DropdownItem>

		<!-- bookmark/unbookmark button -->
		<DropdownItem on:click={() => updateSettings({ type: 'userBookmarks', key })}>
			<div class="flex flex-row items-center">
				<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
				<span class="text-xs pl-2">{userBookmarks.includes(key) ? 'Remove Bookmark' : 'Bookmark Verse'}</span>
			</div>
		</DropdownItem>

		<!-- verse notes button -->
		<DropdownItem
			on:click={() => {
				showNotesModal();
				dropdownOpen = false;
			}}
		>
			<div class="flex flex-row items-center">
				<Notes />
				<span class="text-xs pl-2">Verse Notes</span>
			</div>
		</DropdownItem>

		<!-- verse morphology button -->
		<DropdownItem>
			<Link to="/morphology/{chapter}:{verse}">
				<div class="flex flex-row items-center">
					<Book />
					<span class="text-xs pl-2">Verse Morphology</span>
				</div>
			</Link>
		</DropdownItem>

		<!-- share verse button -->
		<DropdownItem on:click={() => shareVerse()}>
			<div class="flex flex-row items-center">
				<ShareOutline />
				<span class="text-xs pl-2">Share Verse</span>
			</div>
		</DropdownItem>

		<!-- Verse screenshot button -->
		<DropdownItem on:click={() => downloadVerseImage(key)}>
			<div class="flex flex-row items-center">
				<Photo />
				<span class="text-xs pl-2">Verse Screenshot</span>
			</div>
		</DropdownItem>
	</Dropdown>
</div>
