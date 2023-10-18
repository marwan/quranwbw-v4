<script>
  // props from router
  export let chapter, startVerse, endVerse;

  import Selectors from "../components/Selectors.svelte";
  import DisplayChapterVerses from "../components/DisplayChapterVerses.svelte";
  import { parseURL } from "../lib/parseURL";
  import { websiteTitle, apiEndpoint } from "../lib/websiteSettings";
  import { quranMetaData } from "../lib/quranMeta";
  import { currentPageStore, chapterNumberStore, chapterDataStore, wordTypeStore, displayTypeStore, pageURLStore } from "../lib/stores";

  let maxVersesThreshold = 10;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(chapter);

    let chapterTotalVerses = quranMetaData[$chapterNumberStore].verses;

    // get the starting and ending verses to load data from API
    (startVerse = parseURL()[0]), (endVerse = parseURL()[1]);
    // (startVerse = 1), (endVerse = chapterTotalVerses);

    fetchData = (async () => {
      // const api_url = `${apiEndpoint}/verses?verses=${$chapterNumberStore}:${startVerse},${$chapterNumberStore}:${endVerse}&word_type=${$wordTypeStore}&verse_translation=1,15&between=true`;
      const api_url = `${apiEndpoint}/verses?verses=${$chapterNumberStore}:1,${$chapterNumberStore}:${chapterTotalVerses}&word_type=${$wordTypeStore}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      chapterDataStore.set(data.data.verses);
      return data.data.verses;
    })();

    // since we have loaded the data from API above, we'll just re-assign startVerse to 1 and endVerse to max threshold if no specific verse was opted for
    // that is, when the complete chapter data was fetched, this is done to only show some verses to avoid huge loading times
    if (startVerse === 1 && endVerse === chapterTotalVerses) {
      (startVerse = 1), (endVerse = chapterTotalVerses > maxVersesThreshold ? maxVersesThreshold : chapterTotalVerses);
    }

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
  {:then}
    <div>
      <DisplayChapterVerses {startVerse} {endVerse} />
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
