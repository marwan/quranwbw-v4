<script>
	export let key, value;

	const chapter = +key.split(':')[0];
	const verse = +key.split(':')[1];

	import { Link } from 'svelte-routing';
	import { showAudioModal, quickPlayAudio } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __userSettings, __audioSettings, __verseKey } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { toggleModal } from '$utils/toggleModal';
	import { getNotes } from '$utils/userNotes';
	// import { downloadVerseImage } from '$utils/downloadVerseImage';
	import { Tooltip, Dropdown, DropdownItem } from 'flowbite-svelte';

	// icons
	import Bookmark from '$svgs/Bookmark.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';
	import Book from '$svgs/Book.svelte';
	import Notes from '$svgs/Notes.svelte';
	import Play from '$svgs/Play.svelte';
	import Pause from '$svgs/Pause.svelte';
	import ShareOutline from '$svgs/ShareOutline.svelte';
	import DotsHorizontal from '$svgs/DotsHorizontal.svelte';
	// import DotsVertical from '$svgs/DotsVertical.svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const buttonClasses = 'inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-3xl focus:shadow-outline hover:bg-[#ebebeb] print:hidden';

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

<div class="verseButtons flex flex-row space-x-2 z-10 text-xs theme-grayscale">
	<Link to={$__currentPage === 'chapter' ? './#' : `/${chapter}/${verse}`} class="{buttonClasses} font-bold" data-html2canvas-ignore>
		<div class="opacity-50">{key}</div>
	</Link>
	<Tooltip type="light" placement="right" class="z-30">Verse {key}</Tooltip>

	<!-- play verse button -->
	<button on:click={() => quickPlayAudio(chapter, verse, verse)} class={buttonClasses}>
		<div class="opacity-50">
			<svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30">Play</Tooltip>

	<!-- bookmark/unbookmark button -->
	<button on:click={() => updateSettings({ type: 'userBookmarks', key })} class={buttonClasses}>
		<div class="opacity-50">
			<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
		</div>
	</button>
	<Tooltip type="light" placement="right" class="z-30">Bookmark</Tooltip>

	<!-- verses option dropdown -->
	<button id="verse-{key}" class={buttonClasses}>
		<div class="opacity-50">
			<DotsHorizontal />
		</div>
	</button>

	<Dropdown bind:open={dropdownOpen} class="rounded-3xl">
		<!-- play verse button -->
		<DropdownItem
			on:click={() => {
				showAudioModal(key);
				dropdownOpen = false;
			}}
		>
			<div class="flex flex-row items-center">
				<div class="opacity-50">
					<svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
				</div>
				<span class="text-xs pl-2">Advanced Play</span>
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

		<!-- verse page button -->
		<DropdownItem>
			<Link to="/page/{value.meta.page}">
				<div class="flex flex-row items-center">
					<Book />
					<span class="text-xs pl-2">Go to Page {value.meta.page}</span>
				</div>
			</Link>
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
		<!-- <DropdownItem on:click={() => downloadVerseImage(key)}>
			<div class="flex flex-row items-center">
				<Photo />
				<span class="text-xs pl-2">Verse Screenshot</span>
			</div>
		</DropdownItem> -->
	</Dropdown>
</div>
