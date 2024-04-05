<script>
  import { quranMetaData } from "$data/quranMeta";
  import { __currentPage, __chapterNumber, __audioSettings, __verseKey, __notesData, __userNotes } from "$utils/stores";
  import { buttonElement } from "$utils/commonStyles";
  import { toggleModal } from "$utils/toggleModal";
  import { updateNotes } from "$utils/userNotes";
  import { timeAgo } from "$utils/timeAgo";

  $: chapter = $__verseKey.split(":")[0];
  $: verse = $__verseKey.split(":")[1];

  let verseNote, noteModifiedAt;

  // reset this value everytime the verseKey updates
  $: {
    (verseNote = ""), (noteModifiedAt = "");
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

  function updateNotesHandler() {
    const notesValue = document.getElementById("notes-value").value;

    updateNotes($__verseKey, notesValue);
    noteModifiedAt = "just now";

    // if (notesValue !== "") {
    //   updateNotes($__verseKey, notesValue);
    //   noteModifiedAt = "just now";
    // }
  }
</script>

<!-- Notes modal -->
<div id="notes-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
  <div class="relative w-full max-w-md max-h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow daaark:bg-gray-700">
      <button type="button" on:click={() => toggleModal("notes-modal", "hide")} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center daaark:hover:bg-gray-600 daaark:hover:text-white" data-modal-hide="notes-modal">
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <div class="px-6 py-6 space-y-8 lg:px-8">
        <h3 id="notes-modal-title" class="mb-8 text-xl font-medium text-gray-900 daaark:text-white">{quranMetaData[chapter].transliteration}, {$__verseKey}</h3>
        <div class="">
          <textarea id="notes-value" rows="8" value={verseNote} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-blue-500 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-gray-500 daaark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
        </div>

        {#if noteModifiedAt !== ""}
          <div id="notes-last-modified" class="text-xs">Last modified: {noteModifiedAt}</div>
        {/if}

        <button id="notes-submit-button" on:click={() => updateNotesHandler()} class="w-full mr-2 mt-6 {buttonElement}">
          <svg class="w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17v1a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2M6 1v4a1 1 0 0 1-1 1H1m13.14.772 2.745 2.746M18.1 5.612a2.086 2.086 0 0 1 0 2.953l-6.65 6.646-3.693.739.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z" />
          </svg>
          <span>Update Note</span>
        </button>
      </div>
    </div>
  </div>
</div>
