<script>
	export let page;

	import { showAudioModal } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { __userSettings, __verseKey, __notesModalVisible } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	const dropdownItemClasses = 'font-normal rounded-3xl';

	let dropdownOpen = false;

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

<Dropdown bind:open={dropdownOpen} class="px-2 mr-2 my-2 w-fit font-sans">
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
		{userBookmarks.includes($__verseKey) ? 'Unbookmark' : 'Bookmark'}
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
	<DropdownItem class={dropdownItemClasses}>
		<a href="/page/{page}">Go to Page {page}</a>
	</DropdownItem>

	<!-- verse morphology button -->
	<DropdownItem class={dropdownItemClasses}>
		<a href="/morphology/{$__verseKey}">Verse Morphology</a>
	</DropdownItem>

	<!-- share verse button -->
	<DropdownItem class={dropdownItemClasses} on:click={() => shareVerse()}>Share Verse</DropdownItem>
</Dropdown>
