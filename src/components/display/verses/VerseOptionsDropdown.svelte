<script>
	export let page;

	import Dropdown from '$ui/FlowbiteSvelte/dropdown/Dropdown.svelte';
	import DropdownItem from '$ui/FlowbiteSvelte/dropdown/DropdownItem.svelte';
	import { showAudioModal } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { selectableDisplays } from '$data/options';
	import { __userSettings, __verseKey, __notesModalVisible, __tafsirModalVisible, __verseTranslationModalVisible, __currentPage, __displayType } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { term } from '$utils/terminologies';

	const dropdownItemClasses = 'font-normal rounded-3xl hover:bg-blackkk/5';
	let dropdownOpen = false;

	// We need to manually add and/or remove z-index from the verse options dropdown because it becomes transparent due to our themes which we achieve via CSS filters
	// We remove z-index from all button blocks, and add it to the button block of the verse for which the dropdown was opened
	$: updateZIndex($__verseKey);

	function updateZIndex(verseKey) {
		try {
			if (dropdownOpen) {
				document.querySelectorAll('.verseButtons').forEach((element) => {
					element.classList.remove('z-10');
				});
				document.getElementById(verseKey).firstChild.classList.add('z-10');
			}
		} catch (error) {
			// console.error('Error updating z-index:', error);
		}
	}

	// Update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	// Open share menu
	function shareVerse() {
		const [chapter, verse] = $__verseKey.split(':').map(Number);

		if (navigator.share) {
			navigator.share({
				title: `${quranMetaData[chapter].transliteration}, ${term('verse')} ${verse}`,
				url: `https://quranwbw.com/${chapter}/${verse}`
			});
		}
	}
</script>

<Dropdown bind:open={dropdownOpen} class="px-2 mr-2 my-2 w-max text-left font-sans theme-grayyyscale">
	<div class="py-2 px-4 text-xs font-semibold text-left">{term('verse')} {$__verseKey}</div>

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
		{userBookmarks.includes($__verseKey) ? `Unbookmark  ${term('verse')}` : `Bookmark ${term('verse')}`}
	</DropdownItem>

	<!-- verse notes button -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			__notesModalVisible.set(true);
			dropdownOpen = false;
		}}
	>
		{term('verse')} Notes
	</DropdownItem>

	<!-- verse translation button - only show on Mushaf page or on continuous display -->
	{#if selectableDisplays[$__displayType].continuous}
		<DropdownItem
			class={dropdownItemClasses}
			on:click={() => {
				__verseTranslationModalVisible.set(true);
				dropdownOpen = false;
			}}
		>
			{term('verse')}
			Translation
		</DropdownItem>
	{/if}

	<!-- tafsir button -->
	<DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			__tafsirModalVisible.set(true);
			dropdownOpen = false;
		}}
	>
		{term('verse')}
		{term('tafsir')}
	</DropdownItem>

	<!-- mode change buttons -->
	{#if $__currentPage === 'chapter'}
		<DropdownItem class={dropdownItemClasses} href="/page/{page}">Mushaf Mode</DropdownItem>
	{:else if $__currentPage === 'mushaf'}
		<DropdownItem class={dropdownItemClasses} href="/{$__verseKey.split(':')[0]}/{$__verseKey.split(':')[1]}">{term('chapter')} Mode</DropdownItem>
	{/if}

	<!-- verse morphology button -->
	<DropdownItem class={dropdownItemClasses} href="/morphology/{$__verseKey}">{term('verse')} Morphology</DropdownItem>

	<!-- share verse button -->
	<DropdownItem class={dropdownItemClasses} on:click={() => shareVerse()}>Share {term('verse')}</DropdownItem>
</Dropdown>
