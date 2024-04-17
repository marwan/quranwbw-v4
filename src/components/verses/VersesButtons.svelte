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

	const buttonClasses = 'inline-flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-150 rounded-3xl focus:shadow-outline bg-[#ebebeb] hover:bg-gray-200 print:hidden dark:bg-slate-800 dark:hover:bg-slate-700';

	let verseDropdownVisible = false;

	// hide all other dropdown and show the current one
	function verseDropdownToggle() {
		document.querySelectorAll('.verse-dropdown').forEach((element) => {
			element.classList.remove('block');
			element.classList.add('hidden');
		});

		verseDropdownVisible = !verseDropdownVisible;
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

	<!-- <button on:click={() => updateSettings({ type: 'userBookmarks', key })} class={buttonClasses}>
		<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
	</button>
	<button on:click={() => showAudioModal(key)} class={buttonClasses}>
		<svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
	</button> -->

	<!-- <button on:click={() => showNotesModal()} class={buttonClasses}> notes </button> -->

	<!-- verses option dropdown -->
	<div class="relative inline-block text-left" data-html2canvas-ignore>
		<button data-dropdown-toggle="dropdown" class={buttonClasses} on:click={() => verseDropdownToggle()}>
			<DotsVertical />
		</button>

		<div class="{verseDropdownVisible === true ? 'block' : 'hidden'} verse-dropdown absolute z-10 mt-2 min-w-max origin-top-right bg-white divide-y divide-gray-100 rounded-3xl shadow w-44 dark:bg-gray-700">
			<div class="py-2 space-y-4">
				<ul class=" text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
					<!-- play verse button -->
					<li>
						<button on:click={() => showAudioModal(key)} class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
								<span class="text-xs pl-2">{$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? 'Stop Playing' : 'Play Verse'}</span>
							</div>
						</button>
					</li>

					<!-- bookmark/unbookmark button -->
					<li>
						<button on:click={() => updateSettings({ type: 'userBookmarks', key })} class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
								<span class="text-xs pl-2">{userBookmarks.includes(key) ? 'Remove Bookmark' : 'Bookmark Verse'}</span>
							</div>
						</button>
					</li>

					<!-- verse notes button -->
					<li>
						<button on:click={() => showNotesModal()} class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<Notes />
								<span class="text-xs pl-2">Verse Notes</span>
							</div>
						</button>
					</li>

					<!-- verse morphology button -->
					<li>
						<Link to="/morphology/{chapter}:{verse}" class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<Book />
								<span class="text-xs pl-2">Verse Morphology</span>
							</div>
						</Link>
					</li>

					<!-- share verse button -->
					<li>
						<button on:click={() => shareVerse()} class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<ShareOutline />
								<span class="text-xs pl-2">Share Verse</span>
							</div>
						</button>
					</li>

					<!-- Verse screenshot button -->
					<li>
						<button on:click={() => downloadVerseImage(key)} class="block px-4 py-2 w-full text-left hover:bg-gray-100">
							<div class="flex flex-row items-center">
								<Photo />
								<span class="text-xs pl-2">Verse Screenshot</span>
							</div>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
