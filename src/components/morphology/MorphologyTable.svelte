<script>
  export let wordData, tableType;

  import { Link } from "svelte-routing";
  import { wordTypeStore } from "$utils/stores";

  const tableTitles = {
    1: { title: "Words in Quran having same root", error: "Root data for this word is not available." },
    2: { title: "Exact words in Quran", error: "Exact word data for this word is not available." },
  };
</script>

{#if Object.keys(wordData).length > 0}
  <div class="flex flex-col">
    <div class="relative space-y-6 sm:rounded-lg grayscale">
      <h1 class="text-md md:text-2xl text-center opacity-70">{tableTitles[tableType].title} ({Object.keys(wordData).length})</h1>
      <div class="max-h-64 overflow-auto">
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
            {#each Object.entries(wordData) as [key, value]}
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4"> {+key + 1} </td>
                <td class="px-6 py-4 arabic-font-{$wordTypeStore} text-xl md:text-2xl"> {value.arabic} </td>
                <td class="px-6 py-4"> {value.translation} </td>
                <td class="px-6 py-4"> {value.transliteration} </td>
                <td class="px-6 py-4"> <Link to="/{value.key.split(':')[0]}/{value.key.split(':')[1]}">{value.key.split(":")[0]}:{value.key.split(":")[1]}</Link> </td>
                <td class="px-6 py-4"> <Link to="/morphology/{value.key}" on:click={() => (key = value.key)}>{value.key}</Link> </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{:else}
  <div class="text-center my-8 text-sm opacity-70">{tableTitles[tableType].error}</div>
{/if}
