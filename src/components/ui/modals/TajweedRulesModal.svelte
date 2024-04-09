<script>
  import { toggleModal } from "$utils/toggleModal";
  import { buttonElement, linkElement } from "$utils/commonStyles";
  import { tajweedRulings } from "$data/quranMeta";
  import { __websiteTheme } from "$utils/stores";
</script>

<!-- Main modal -->
<div id="tajweed-rules-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
  <div class="relative w-full max-w-2xl max-h-full sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
    <!-- Modal content -->
    <div class="max-h-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 grayscale">Tajweed Rules</h3>
        <button id="tajweed-modal-close-button" on:click={() => toggleModal("tajweed-rules-modal", "hide")} type="button" class="text-gray-400 bg-transparent hover:bg-[#ebebeb] hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center grayscale">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-6 overflow-y-auto">
        <p>The Tajweed rules allows the reciter to emphasize the accent, phonetics, rhythm and temper of the Quranic recitation. To get more information on Tajweed and importance of it <a href="https://www.getquranic.com/a-quick-guide-to-tajweed/" target="_blank" class={linkElement}>click here.</a></p>

        <div>
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 grayscale">
              <tr>
                <th scope="col" class="px-6 py-3"> Rule/Icon </th>
                <th scope="col" class="px-6 py-3"> Description </th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(tajweedRulings) as [id, ruling]}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="px-6 py-4 tajweed-rules text-2xl theme-palette-tajweed font-filter"> {ruling.code} </td>
                  <td class="px-6 py-4 grayscale"> {ruling.description} </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <!-- Modal footer -->
      <div class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button on:click={() => toggleModal("tajweed-rules-modal", "hide")} type="button" class={buttonElement}>Close</button>
      </div>
    </div>
  </div>
</div>
