<script>
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteTitle, apiEndpoint } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore, wordTranslationStore, verseTranslationsStore } from "$utils/stores";

  let fetchData, fetchWordsData;

  let wordID;

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiURL =
        apiEndpoint +
        new URLSearchParams({
          verses: "1:7",
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
      const response = await fetch(`https://api.quranwbw.com/v1/words?words=${wordID}`);
      const data = await response.json();
      return data.data;
    })();
  }

  currentPageStore.set("words");
</script>

<svelte:head>
  <title>Words - {websiteTitle}</title>
</svelte:head>

<div class="my-6">
  {#await fetchData}
    <Spinner />
  {:then fetchData}
    <div style="direction: rtl;" class="arabicText leading-normal text-4xl arabic-font-{$wordTypeStore}">
      {#each Object.entries(fetchData) as [key, value]}
        {#each { length: value.meta.words } as _, word}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <span class="p-2 px-1" on:click={() => (wordID = `${value.meta.chapter}:${value.meta.verse}:${word + 1}`)}>{value.words.arabic.split("|")[word]} </span>
        {/each}
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>

<div class="my-8">
  {#await fetchWordsData}
    <Spinner />
  {:then fetchWordsData}
    {#each Object.entries(fetchWordsData) as [key, value]}
      {JSON.stringify(fetchWordsData)}
    {/each}
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
