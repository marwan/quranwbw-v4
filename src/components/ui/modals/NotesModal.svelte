<script>
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __verseKey, __notesData, __userNotes, __notesModalVisible } from '$utils/stores';
	import { buttonElement } from '$data/commonStyles';
	import { updateNotes } from '$utils/userNotes';
	import { timeAgo } from '$utils/timeAgo';
	import { Modal } from 'flowbite-svelte';

	$: chapter = $__verseKey.split(':')[0];
	$: verse = $__verseKey.split(':')[1];

	let verseNote, noteModifiedAt;

	// reset this value everytime the verseKey updates
	$: {
		(verseNote = ''), (noteModifiedAt = '');
		console.log($__verseKey, verse);
	}

	// populate data
	$: {
		// if ($__notesData !== null) {
		//   for (const [key, value] of Object.entries($__notesData.data)) {
		//     if (value.verse_key === $__verseKey) {
		//       verseNote = value.user_notes;
		//       noteModifiedAt = timeAgo(value.modified_at);
		//     }
		//   }
		// }
		// loop through the user notes
		// for (const [key, value] of Object.entries($__userNotes)) {
		//   if (key === $__verseKey) {
		//     verseNote = value.note;
		//     noteModifiedAt = timeAgo(value.modified_on);
		//   }
		// }
	}

	$: {
		try {
			verseNote = $__userNotes[$__verseKey].note;
			noteModifiedAt = timeAgo($__userNotes[$__verseKey].modified_at);
		} catch (error) {}
	}

	$: if (noteModifiedAt === undefined) noteModifiedAt = 'just now';

	function updateNotesHandler() {
		const notesValue = document.getElementById('notes-value').value;

		updateNotes($__verseKey, notesValue);

		// if (notesValue !== "") {
		//   updateNotes($__verseKey, notesValue);
		//   noteModifiedAt = "just now";
		// }
	}
</script>

<Modal id="notesModal" bind:open={$__notesModalVisible} size="xs" class="rounded-3xl theme-grayscale" bodyClass="p-6" center outsideclose>
	<!-- Modal content -->
	<h3 id="notes-modal-title" class="mb-8 text-xl font-medium text-gray-900 daaark:text-white">{quranMetaData[chapter].transliteration}, {$__verseKey}</h3>
	<div class="">
		<textarea id="notes-value" rows="8" value={verseNote} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-3xl border border-gray-300 focus:ring-gray-500 focus:border-gray-500 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-gray-500 daaark:focus:border-gray-500" placeholder="Write your thoughts here..."></textarea>
	</div>

	{#if noteModifiedAt !== ''}
		<div id="notes-last-modified" class="text-xs">Last modified: {noteModifiedAt}</div>
	{/if}

	<button id="notes-submit-button" on:click={() => updateNotesHandler()} class="w-full mr-2 mt-6 {buttonElement}">
		<span>Update Note</span>
	</button>
</Modal>
