<script>
	export let page;

	import Dropdown from '$ui/flowbite-svelte/dropdown/Dropdown.svelte';
	import DropdownItem from '$ui/flowbite-svelte/dropdown/DropdownItem.svelte';
	import { showAudioModal } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { __userSettings, __verseKey, __notesModalVisible } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const dropdownItemClasses = 'font-normal rounded-3xl hover:bg-black/5';

	let dropdownOpen = false;

	// we need to manually add and/or remove z-index from the verse options dropdown because it becomes transparent due to our themes which we achieve via CSS filters
	// we remove z-index from all button blocks, and add it to button block of verse for which the dropdown was opened
	$: {
		try {
			if (dropdownOpen) {
				document.querySelectorAll('.verseButtons').forEach((element) => {
					element.classList.remove('z-10');
				});

				// for some reason, applying z-index directly by selecting the .verseButtons of the verseKey doesn't work, so have to do this check...
				const verse = +$__verseKey.split(':')[1];

				if (verse === 1) {
					document.getElementsByClassName('verseButtons')[verse].classList.add('z-10');
				} else {
					document.getElementById($__verseKey).firstChild.classList.add('z-10');
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// open share menu
	function shareVerse() {
		const chapter = +$__verseKey.split(':')[0];
		const verse = +$__verseKey.split(':')[1];

		if (navigator.share) {
			navigator.share({
				title: `${quranMetaData[chapter].transliteration}, Verse ${verse}`,
				url: `https://quranwbw.com/${chapter}/${verse}`
			});
		}
	}
</script>

<Dropdown bind:open={dropdownOpen} class="px-2 mr-2 my-2 w-max text-left font-sans theme-grayscale">
	<div class="py-2 px-4 text-xs font-semibold text-left">Verse {$__verseKey}</div>

	<!-- play verse button -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			showAudioModal($__verseKey);
			dropdownOpen = false;
		}}
	>
		Advanced Play
	</DropdownItem>

	<!-- bookmark button -->
	<DropdownItem class={dropdownItemClasses} on:click={() => updateSettings({ type: 'userBookmarks', key: $__verseKey, set: true })}>
		{userBookmarks.includes($__verseKey) ? 'Unbookmark  Verse' : 'Bookmark Verse'}
	</DropdownItem>

	<!-- verse notes button -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			__notesModalVisible.set(true);
			dropdownOpen = false;
		}}
	>
		Verse Notes
	</DropdownItem>

	<!-- verse page button -->
	<DropdownItem class={dropdownItemClasses} href="/page/{page}">Go to Mushaf Page {page}</DropdownItem>

	<!-- verse morphology button -->
	<DropdownItem class={dropdownItemClasses} href="/morphology/{$__verseKey}">Verse Morphology</DropdownItem>

	<!-- share verse button -->
	<DropdownItem class={dropdownItemClasses} on:click={() => shareVerse()}>Share Verse</DropdownItem>
</Dropdown>
