<script>
  import Selectors from "./Selectors.svelte";
  import DisplayVerses from "./DisplayVerses.svelte";
  import { currentPage, chapterNumber, wordType, pageURL } from "../lib/stores";
  import { urlParse } from "../lib/urlParse";
  import { quranMetaData } from "../lib/quranMeta";

  // props from router
  export let chapter, startVerse, endVerse;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumber.set(chapter);

    // get the starting and ending verses
    (startVerse = urlParse($chapterNumber)[0]), (endVerse = urlParse($chapterNumber)[1]);

    fetchData = (async () => {
      const api_url = `https://api.quranwbw.com/v1/verses?verses=${$chapterNumber}:${startVerse},${$chapterNumber}:${endVerse}&word_type=${$wordType}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      return data.data.verses;
    })();

    // logging it for now to re-run the block on URL change
    console.log($pageURL);
  }

  currentPage.set("chapter");
</script>

<svelte:head>
  <title>{quranMetaData[$chapterNumber].transliteration} - QuranWBW.com</title>
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
