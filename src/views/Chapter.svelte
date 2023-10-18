<script>
  import Selectors from "../components/Selectors.svelte";
  import DisplayVerses from "../components/DisplayVerses.svelte";
  import { parseURL } from "../lib/parseURL";
  import { websiteTitle, apiEndpoint } from "../lib/websiteSettings";
  import { quranMetaData } from "../lib/quranMeta";

  import { currentPageStore, chapterNumberStore, wordTypeStore, displayTypeStore, pageURLStore } from "../lib/stores";

  // props from router
  export let chapter, startVerse, endVerse;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(chapter);

    // get the starting and ending verses
    (startVerse = parseURL()[0]), (endVerse = parseURL()[1]);

    fetchData = (async () => {
      const api_url = `${apiEndpoint}/verses?verses=${$chapterNumberStore}:${startVerse},${$chapterNumberStore}:${endVerse}&word_type=${$wordTypeStore}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      return data.data.verses;
    })();

    // logging these for now to re-run the block on URL change
    console.log($pageURLStore, $displayTypeStore);
  }

  currentPageStore.set("chapter");
</script>

<svelte:head>
  <title>{quranMetaData[$chapterNumberStore].transliteration} - {websiteTitle}</title>
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
