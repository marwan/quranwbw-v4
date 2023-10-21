<script>
  // props from router
  export let chapter, startVerse, endVerse;

  import { onMount } from "svelte";
  import Selectors from "../components/Selectors.svelte";
  import DisplayChapterVerses from "../components/verses/DisplayChapterVerses.svelte";
  import { parseURL } from "../utils/parseURL";
  import { websiteTitle, apiEndpoint } from "../utils/websiteSettings";
  import { quranMetaData } from "../utils/quranMeta";
  import { currentPageStore, chapterNumberStore, chapterDataStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore, pageURLStore } from "../utils/stores";

  // max verses to load if total verses in chapter are more than this
  let maxVersesThreshold = 10;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(chapter);

    const chapterTotalVerses = quranMetaData[$chapterNumberStore].verses;

    fetchData = (async () => {
      const apiURL =
        apiEndpoint +
        new URLSearchParams({
          verses: `${$chapterNumberStore}:1,${$chapterNumberStore}:${chapterTotalVerses}`,
          word_type: $wordTypeStore,
          word_translation: $wordTranslationStore,
          verse_translation: $verseTranslationsStore.toString(),
          between: true,
        });

      const response = await fetch(apiURL);
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
    console.log($pageURLStore, $displayTypeStore, $wordTranslationStore, $verseTranslationsStore);
  }

  // auto-load the next set of verses when the user almost reaches the bottom
  onMount(() => {
    try {
      document.addEventListener("scroll", function (e) {
        if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 2000) {
          // document.querySelector("#loadNextVersesButton > button").click();
        }
      });
    } catch (error) {
      // we know the error... but can make this better.
    }
  });

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
    <!-- need custom stylings if display type is continuous -->
    <div style={$displayTypeStore === 3 ? "text-align: center; direction: rtl;" : ""}>
      <DisplayChapterVerses {startVerse} {endVerse} />
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
