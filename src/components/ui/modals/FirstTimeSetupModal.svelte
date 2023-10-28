<script>
  import ChapterVerses from "$verses/ChapterVerses.svelte";
  import { currentPageStore, chapterDataStore, wordTypeStore, displayTypeStore } from "$utils/stores";
  import { displayOptions } from "$data/options";
  import { updateSettings } from "$utils/updateSettings";
  import { toggleModal } from "$utils/toggleModal";

  // show the setup modal on first visit except on the home page
  $: {
    if ($currentPageStore === "chapter") {
      const userSettings = JSON.parse(localStorage.getItem("userSettings"));

      // if the setup was not already done
      if (userSettings.firstTimeSetupCompleted === false) {
        toggleModal("firstTimeSetupModal", "show");

        // set firstTimeSetupCompleted to true
        updateSettings({ type: "firstTimeSetupCompleted", value: true });
      }
    }
  }
</script>

<!-- Modal toggle -->
<!-- <button on:click={() => toggleModal("firstTimeSetupModal", "show")} class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800" type="button"> Toggle modal </button> -->

<!-- Main modal -->
<div id="firstTimeSetupModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
  <div class="relative w-full max-w-2xl max-h-full sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
    <!-- Modal content -->
    <div class="max-h-full overflow-hidden flex flex-col bg-white rounded-lg shadow daark:bg-gray-700">
      <!-- Modal header -->
      <div class="flex items-start justify-between p-4 border-b rounded-t daark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 daark:text-white">First Time Setup</h3>
        <button on:click={() => toggleModal("firstTimeSetupModal", "hide")} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center daark:hover:bg-gray-600 daark:hover:text-white">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-6 overflow-y-auto">
        <p>If it's your first time visiting QuranWBW.com, we suggest you set the font and display type as per your preference. These options, including many more, can be changed later from the settings.</p>

        <!-- selectors -->
        <div class="flex flex-row space-x-6">
          <div class="flex flex-col">
            <label for="quran-font-list" class="block mb-2 text-sm font-medium text-gray-900">Quran Font</label>
            <select id="quran-font-list" on:change={(event) => updateSettings({ type: "wordType", value: Number(event.target.value) })} bind:value={$wordTypeStore} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-blue-500 daaark:focus:border-blue-500">
              <option value={1}>Uthmani</option>
              <option value={2}>IndoPak</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label for="display-style-list" class="block mb-2 text-sm font-medium text-gray-900">Display Style</label>
            <select id="display-style-list" bind:value={$displayTypeStore} on:change={(event) => updateSettings({ type: "displayType", value: Number(event.target.selectedIndex) + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-blue-500 daaark:focus:border-blue-500">
              {#each Object.entries(displayOptions) as [id, displayOption]}
                <option value={displayOption.displayID}>{displayOption.displayName}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- example verse -->
        {#key $chapterDataStore}
          {#if $chapterDataStore !== null}
            <div class="flex flex-col pt-8 space-y-4">
              <span class="text-center text-xs">Example Verse:</span>
              <div style="zoom: 60%; {displayOptions[`${$displayTypeStore}`].continuous === true ? 'text-align: center; direction: rtl;' : ''}">
                <ChapterVerses startVerse={1} endVerse={1} isExampleVerse={true} />
              </div>
            </div>
          {/if}
        {/key}
      </div>
      <!-- Modal footer -->
      <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b daark:border-gray-600">
        <button on:click={() => toggleModal("firstTimeSetupModal", "hide")} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800">Close</button>
      </div>
    </div>
  </div>
</div>
