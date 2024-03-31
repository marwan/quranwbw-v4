<script>
  export let wordData, tableType;

  import { Link } from "svelte-routing";
  import { __wordType } from "$utils/stores";
  import { buttonElement } from "$utils/commonStyles";

  const tableTitles = {
    1: { title: "Words in Quran having same root", error: "Root data for this word is not available." },
    2: { title: "Exact words in Quran", error: "Exact word data for this word is not available." },
  };

  const params = new URLSearchParams(window.location.search);
  const loadAll = params.get("load_all") === "true";
  const totalAvailableWords = Object.keys(wordData).length;
  let lastWordToLoad = loadAll === true ? totalAvailableWords : totalAvailableWords > 10 ? 10 : totalAvailableWords;

  function updateLastWordToLoad() {
    lastWordToLoad = lastWordToLoad + 50;
    if (lastWordToLoad > totalAvailableWords) {
      lastWordToLoad = totalAvailableWords;
    }
  }
</script>

{#if totalAvailableWords > 0}
  <div class="flex flex-col">
    <div class="relative space-y-6 sm:rounded-lg grayscale">
      <h1 class="text-md md:text-2xl text-center opacity-70">{tableTitles[tableType].title} ({totalAvailableWords})</h1>
      <div class="max-h-80 overflow-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3"> # </th>
              <th scope="col" class="px-6 py-3"> Word </th>
              <th scope="col" class="px-6 py-3"> Translation </th>
              <th scope="col" class="px-6 py-3"> Transliteration </th>
              <th scope="col" class="px-6 py-3"> Verse </th>
              <th scope="col" class="px-6 py-3"> Word </th>
            </tr>
          </thead>
          <tbody>
            {#each Array.from(Array(lastWordToLoad + 1).keys()).slice(1) as word}
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4"> {word} </td>
                <td class="px-6 py-4 arabic-font-{$__wordType} text-xl md:text-2xl"> {wordData[word - 1].arabic} </td>
                <td class="px-6 py-4"> {wordData[word - 1].translation} </td>
                <td class="px-6 py-4"> {wordData[word - 1].transliteration} </td>
                <td class="px-6 py-4"> <Link to="/{wordData[word - 1].key.split(':')[0]}/{wordData[word - 1].key.split(':')[1]}">{wordData[word - 1].key.split(":")[0]}:{wordData[word - 1].key.split(":")[1]}</Link> </td>
                <td class="px-6 py-4"> <Link to="/morphology/{wordData[word - 1].key}">{wordData[word - 1].key}</Link> </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- button to load more words -->
      {#if totalAvailableWords > 10}
        <div class="text-center text-xs {lastWordToLoad === totalAvailableWords && 'hidden'}">
          <button on:click={() => updateLastWordToLoad()} class={buttonElement}>Load more...</button>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="text-center my-8 text-sm opacity-70">{tableTitles[tableType].error}</div>
{/if}
