<script>
  // props from router
  export let chapter, startVerse, endVerse;

  import Selectors from "../components/Selectors.svelte";
  import DisplayChapterVerses from "../components/Verses/DisplayChapterVerses.svelte";
  import { parseURL } from "../lib/parseURL";
  import { websiteTitle, apiEndpoint } from "../lib/websiteSettings";
  import { quranMetaData } from "../lib/quranMeta";
  import { currentPageStore, chapterNumberStore, chapterDataStore, wordTypeStore, displayTypeStore, pageURLStore } from "../lib/stores";

  // max verses to load if total verses in chapter are more than this
  let maxVersesThreshold = 10;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(chapter);

    const chapterTotalVerses = quranMetaData[$chapterNumberStore].verses;

    fetchData = (async () => {
      const api_url = `${apiEndpoint}/verses?verses=${$chapterNumberStore}:1,${$chapterNumberStore}:${chapterTotalVerses}&word_type=${$wordTypeStore}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      chapterDataStore.set(data.data.verses);
      return data.data.verses;
    })();

    // getting start and end range incase we need to load specific verses
    (startVerse = parseURL()[0]), (endVerse = parseURL()[1]);

    // Note: the below is only executed when start is 1 and end is total chapter verses, that is, user did not opt for a specific range
    // if there were no specific range opted for, then start with 1 till threshold
    // else we just skip this check and load as per URL parameters
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

<div>
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
