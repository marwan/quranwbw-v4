<script>
  import Selectors from "../components/Selectors.svelte";
  import DisplayVerses from "../components/DisplayVerses.svelte";
  import { currentPageStore, wordTypeStore } from "../lib/stores";

  let fetchData;

  let supplicationVerses = "2:127,2:128,2:201,2:250,2:286,3:8,3:9,3:16,3:53,3:147,3:191,3:192,3:193,3:194,5:83,5:114,7:23,7:47,7:89,7:126,10:85,10:86,14:38,14:40,14:41,17:24,18:10,18:14,20:45,21:83,21:87,23:109,23:118,25:65,25:66,25:74,28:24,40:7,40:8,40:9,46:15,59:10,60:4,60:5,66:8";

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const api_url = `https://api.quranwbw.com/v1/verses?verses=${supplicationVerses}&word_type=${$wordTypeStore}&verse_translation=1,15`;
      const response = await fetch(api_url);
      const data = await response.json();
      return data.data.verses;
    })();
  }

  currentPageStore.set("supplications");
</script>

<svelte:head>
  <title>Supplications From Quran - QuranWBW.com</title>
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
