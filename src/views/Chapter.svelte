<script>
  import Selectors from "../components/Selectors.svelte";
  import DisplayVerses from "../components/DisplayVerses.svelte";
  import { currentPageStore, chapterNumberStore, wordTypeStore, pageURLStore } from "../lib/stores";
  import { urlParse } from "../lib/urlParse";
  import { quranMetaData } from "../lib/quranMeta";

  // props from router
  export let chapter, startVerse, endVerse;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(chapter);

    // get the starting and ending verses
    (startVerse = urlParse($chapterNumberStore)[0]), (endVerse = urlParse($chapterNumberStore)[1]);

    fetchData = (async () => {
      const api_url = `https://api.quranwbw.com/v1/verses?verses=${$chapterNumberStore}:${startVerse},${$chapterNumberStore}:${endVerse}&word_type=${$wordTypeStore}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      return data.data.verses;
    })();

    // logging it for now to re-run the block on URL change
    console.log($pageURLStore);
  }

  currentPageStore.set("chapter");
</script>

<svelte:head>
  <title>{quranMetaData[$chapterNumberStore].transliteration} - QuranWBW.com</title>
</svelte:head>

<div class="">
  <Selectors />

  {#await fetchData}
    <div class="flex items-center justify-center pt-28">loading...</div>
  {:then chapterData}
    <div>
      {#each Object.entries(chapterData) as [key, value]}
        <DisplayVerses {key} {value} />
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
