<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __verseKey, __notesData, __userNotes, __notesModalVisible } from '$utils/stores';
	import { buttonClasses, buttonOutlineClasses } from '$data/commonClasses';
	import { timeAgo } from '$utils/timeAgo';
	import { updateSettings } from '$utils/updateSettings';
	import { getModalTransition } from '$utils/getModalTransition';

	let verseNote, noteModifiedAt;

	$: chapter = $__verseKey.split(':')[0];

	$: {
		// by default make them null
		(verseNote = null), (noteModifiedAt = null);

		// if a note for the current key exists, update the variables
		if ($__userNotes.hasOwnProperty($__verseKey)) {
			verseNote = $__userNotes[$__verseKey].note;
			noteModifiedAt = timeAgo($__userNotes[$__verseKey].modified_at);

			// logging to re-run the block
			console.log($__notesModalVisible);
		}

		if (noteModifiedAt === undefined) noteModifiedAt = 'just now';
	}

	function updateNote() {
		const notesValue = document.getElementById('notes-value').value;
		updateSettings({ type: 'userNotes', key: $__verseKey, value: notesValue, set: true });
	}

	function resetNote() {
		verseNote = '';
		updateSettings({ type: 'userNotes', key: $__verseKey, value: '', set: true });
	}
</script>

<Modal id="notesModal" bind:open={$__notesModalVisible} transitionParams={getModalTransition('bottom')} size="xs" class="!rounded-b-none md:!rounded-3xl theme" bodyClass="p-6" position="bottom" center outsideclose>
	<!-- Modal content -->
	<h3 id="notes-modal-title" class="mb-8 text-xl font-medium text-black">{quranMetaData[chapter].transliteration}, {$__verseKey}</h3>
	<textarea id="notes-value" rows="8" value={verseNote} class="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-3xl border border-black/10 focus:ring-gray-500 focus:border-gray-500 placeholder-black theme-grayscale" placeholder="Write your thoughts here..."></textarea>

	{#if noteModifiedAt !== null}
		<div id="notes-last-modified" class="text-xs mt-4 theme-grayscale">Modified {noteModifiedAt}.</div>
	{/if}

	<div class="flex flex-row space-x-2">
		<button on:click={() => updateNote()} class="w-full mr-2 mt-6 {buttonClasses}">Update</button>
		<button on:click={() => resetNote()} class="w-full mr-2 mt-6 {buttonOutlineClasses}">Reset</button>
	</div>
</Modal>

<style>
	#notes-value {
		resize: none;
	}
</style>
