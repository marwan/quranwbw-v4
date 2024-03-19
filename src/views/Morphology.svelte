<script>
  export let key;

  import { Link } from "svelte-routing";
  import Spinner from "$svgs/Spinner.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import { websiteTitle, apiEndpoint } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore, wordTranslationStore, verseTranslationsStore, morphologyKey } from "$utils/stores";

  let fetchData, fetchWordsData;

  let chapter, verse, word;

  $: {
    chapter = +key.split(":")[0];
    verse = +key.split(":")[1];
    word = +key.split(":")[2];

    if (isNaN(word)) word = 1;

    morphologyKey.set(`${chapter}:${verse}:${word}`);
  }

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiURL =
        apiEndpoint +
        new URLSearchParams({
          verses: `${chapter}:${verse}`,
          word_type: $wordTypeStore,
          word_translation: $wordTranslationStore,
          verse_translation: $verseTranslationsStore.toString(),
        });

      const response = await fetch(apiURL);
      const data = await response.json();
      return data.data.verses;
    })();
  }

  // fetch words
  $: {
    fetchWordsData = (async () => {
      const response = await fetch(`https://api.quranwbw.com/v1/words?words=${$morphologyKey}`);
      const data = await response.json();
      return data.data;
    })();
  }

  currentPageStore.set("morphology");
</script>

<svelte:head>
  <title>Morphology - {websiteTitle}</title>
</svelte:head>

<div class="my-8">
  {#await fetchData}
    <Spinner />
  {:then fetchData}
    <div style="direction: rtl;" class="flex flex-wrap">
      {#each Object.entries(fetchData) as [key, value]}
        <VersesWords {key} {value} />
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>

<div class="my-14">
  {#await fetchWordsData}
    <Spinner />
  {:then fetchWordsData}
    {#if Object.keys(fetchWordsData[0].morphology.root.words_with_same_root).length > 0}
      <div class="flex flex-col space-y-8">
        <div id="different-verbs">
          <div class="mx-auto text-center">
            <div class="relative grid gap-8 grid-cols-2 row-gap-5 mb-8 md:row-gap-8 md:grid-cols-6">
              {#each Object.entries(fetchWordsData[0].morphology.verbs) as [key, value]}
                <div class="flex flex-col py-5 duration-300 transform bg-white border rounded-lg shadow-sm text-center hover:-translate-y-2">
                  <div class="flex items-center justify-center mb-2">
                    <p id="verb-1" class="text-xl md:text-2xl pb-4 leading-5 arabic-font-{$wordTypeStore}">{value}</p>
                  </div>
                  <p class="text-xs text-gray-900">{key}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div id="words-with-same-root" class="relative overflow-x-auto sm:rounded-lg grayscale">
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
              {#each Object.entries(fetchWordsData[0].morphology.root.words_with_same_root) as [key, value]}
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
    {:else}
      <div class="text-center my-8 text-xl opacity-60">Root data for this word is not available.</div>
    {/if}
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
