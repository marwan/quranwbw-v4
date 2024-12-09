<script>
	export let page;

	import Dropdown from '$ui/FlowbiteSvelte/dropdown/Dropdown.svelte';
	import DropdownItem from '$ui/FlowbiteSvelte/dropdown/DropdownItem.svelte';
	import Play from '$svgs/Play.svelte';
	import Bookmark from '$svgs/Bookmark.svelte';
	import BookmarkFilled from '$svgs/BookmarkFilled.svelte';
	import Notes from '$svgs/Notes.svelte';
	import NotesFilled from '$svgs/NotesFilled.svelte';
	import Tafsir from '$svgs/Tafsir.svelte';
	import VerseTranslation from '$svgs/VerseTranslation.svelte';
	import ChapterMode from '$svgs/ChapterMode.svelte';
	import Book from '$svgs/Book.svelte';
	import Juz from '$svgs/Juz.svelte';
	import Morphology from '$svgs/Morphology.svelte';
	import Share from '$svgs/Share.svelte';
	import { showAudioModal } from '$utils/audioController';
	import { quranMetaData } from '$data/quranMeta';
	import { selectableDisplays } from '$data/options';
	import { __userSettings, __verseKey, __notesModalVisible, __tafsirModalVisible, __verseTranslationModalVisible, __currentPage, __displayType, __userNotes } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { term } from '$utils/terminologies';
	import { staticEndpoint } from '$data/websiteSettings';
	import { sineIn } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	// Transition parameters for drawer
	const transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	const dropdownItemClasses = `flex flex-row items-center space-x-2 font-normal rounded-3xl ${window.theme('hover')}`;
	let dropdownOpen = false;
	let moreOptionsEnabled = true;
	let verseKeyData;

	// Update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	// Load verse key data externally to reduce bundle size
	$: {
		if (dropdownOpen) {
			verseKeyData = (async () => {
				// getting indexes file
				const response = await fetch(`${staticEndpoint}/v4/meta/verseKeyData.json?version=2`);
				const data = await response.json();
				return data;
			})();
		}
	}

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

<Dropdown bind:open={dropdownOpen} class="px-2 mr-2 my-2 w-max text-left font-sans direction-ltr">
	<div class="py-2 px-4 text-xs font-semibold text-left">{term('verse')} {$__verseKey}</div>

	{#if moreOptionsEnabled}
		<!-- play verse button -->
		<DropdownItem
			class={dropdownItemClasses}
			on:click={() => {
				showAudioModal($__verseKey);
				dropdownOpen = false;
			}}
		>
			<Play />
			<span>Advanced Play</span>
		</DropdownItem>

		<!-- bookmark button -->
		<DropdownItem class={dropdownItemClasses} on:click={() => updateSettings({ type: 'userBookmarks', key: $__verseKey, set: true })}>
			<svelte:component this={userBookmarks.includes($__verseKey) ? BookmarkFilled : Bookmark} />
			<span>{userBookmarks.includes($__verseKey) ? `Unbookmark  ${term('verse')}` : `Bookmark ${term('verse')}`}</span>
		</DropdownItem>

		<!-- verse notes button -->
		<DropdownItem
			class={dropdownItemClasses}
			on:click={() => {
				__notesModalVisible.set(true);
				dropdownOpen = false;
			}}
		>
			<svelte:component this={$__userNotes.hasOwnProperty($__verseKey) ? NotesFilled : Notes} />
			<span>{term('verse')} Notes</span>
		</DropdownItem>
	{/if}

	<!-- more options button -->
	<!-- <DropdownItem
		class={dropdownItemClasses}
		on:click={() => {
			moreOptionsEnabled = !moreOptionsEnabled;
		}}
	>
		{#if !moreOptionsEnabled}
			<span>More Options</span>
		{:else}
			<span>Go Back</span>
		{/if}
	</DropdownItem> -->

	{#if moreOptionsEnabled}
		<div transition:fly={{ duration: 150, x: 0, easing: sineIn }}>
			<!-- verse translation button - only show on Mushaf page or on continuous display -->
			{#if selectableDisplays[$__displayType].continuous}
				<DropdownItem
					class={dropdownItemClasses}
					on:click={() => {
						__verseTranslationModalVisible.set(true);
						dropdownOpen = false;
					}}
				>
					<VerseTranslation />
					<span>{term('verse')} Translation</span>
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
				<Tafsir />
				<span>{term('verse')} {term('tafsir')}</span>
			</DropdownItem>

			<!-- mode change buttons -->
			{#if $__currentPage === 'mushaf'}
				<DropdownItem class={dropdownItemClasses} href="/{$__verseKey.split(':')[0]}/{$__verseKey.split(':')[1]}">
					<ChapterMode />
					<span>{term('chapter')} Mode</span>
				</DropdownItem>
			{:else}
				<DropdownItem class={dropdownItemClasses} href="/page/{page}">
					<Book />
					<span>Mushaf Mode</span>
				</DropdownItem>
			{/if}

			<!-- only show results of key-pages if we have loaded the data -->
			{#await verseKeyData}
				<!-- ... -->
			{:then data}
				<DropdownItem class={dropdownItemClasses} href="/juz/{data[$__verseKey].juz}?startKey={$__verseKey}">
					<Juz />
					<span>Juz Mode</span>
				</DropdownItem>
			{/await}

			<!-- verse morphology button -->
			<DropdownItem class={dropdownItemClasses} href="/morphology/{$__verseKey}">
				<Morphology />
				<span>{term('verse')} Morphology</span>
			</DropdownItem>

			<!-- share verse button -->
			<DropdownItem class={dropdownItemClasses} on:click={() => shareVerse()}>
				<Share />
				<span>Share {term('verse')}</span>
			</DropdownItem>
		</div>
	{/if}
</Dropdown>
