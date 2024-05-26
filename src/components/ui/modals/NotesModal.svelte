<script>
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __verseKey, __notesData, __userNotes, __notesModalVisible } from '$utils/stores';
	import { buttonElement } from '$data/commonStyles';
	import { timeAgo } from '$utils/timeAgo';
	import { Modal } from 'flowbite-svelte';
	import { updateSettings } from '$utils/updateSettings';

	let verseNote, noteModifiedAt;

	$: chapter = $__verseKey.split(':')[0];

	$: {
		// by default make them null
		(verseNote = null), (noteModifiedAt = null);

		// if a note for the current key exists, update the variables
		if ($__userNotes.hasOwnProperty($__verseKey)) {
			verseNote = $__userNotes[$__verseKey].note;
			noteModifiedAt = timeAgo($__userNotes[$__verseKey].modified_at);
		}

		if (noteModifiedAt === undefined) noteModifiedAt = 'just now';
	}

	function updateNotesHandler() {
		const notesValue = document.getElementById('notes-value').value;
		updateSettings({ type: 'userNotes', key: $__verseKey, value: notesValue });
	}
</script>

<Modal id="notesModal" bind:open={$__notesModalVisible} size="xs" class="rounded-3xl theme-grayscale" bodyClass="p-6" center outsideclose>
	<!-- Modal content -->
	<h3 id="notes-modal-title" class="mb-8 text-xl font-medium text-gray-900 daaark:text-white">{quranMetaData[chapter].transliteration}, {$__verseKey}</h3>
	<textarea id="notes-value" rows="8" value={verseNote} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-3xl border border-gray-300 focus:ring-gray-500 focus:border-gray-500" placeholder="Write your thoughts here..."></textarea>

	{#if noteModifiedAt !== null}
		<div id="notes-last-modified" class="text-xs mt-4">Last modified: {noteModifiedAt}</div>
	{/if}

	<button id="notes-submit-button" on:click={() => updateNotesHandler()} class="w-full mr-2 mt-6 {buttonElement}">
		<span>Update Note</span>
	</button>
</Modal>
