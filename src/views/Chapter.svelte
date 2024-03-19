<script>
  // props from router
  export let chapter, startVerse, endVerse;

  import { onMount } from "svelte";
  import ChapterVerses from "$verses/ChapterVerses.svelte";
  import Bismillah from "$svgs/Bismillah.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { parseURL } from "$utils/parseURL";
  import { websiteURL, apiEndpoint } from "$utils/websiteSettings";
  import { quranMetaData } from "$data/quranMeta";
  import { currentPageStore, chapterNumberStore, chapterDataStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore, lastReadStore, pageURLStore } from "$utils/stores";

  // max verses to load if total verses in chapter are more than this
  const maxVersesThreshold = 10;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumberStore.set(+chapter);

    const chapterTotalVerses = quranMetaData[$chapterNumberStore].verses;

    // QuranWBW.com always loads the complete chapter data rather than verses on demand (like Quran.com)
    // though the initial loading time might be higher, but for the subsequent visits it will be lower and we get some benefits like:
    // - the whole chapter and all its verses can be viewed without ever making another request to the API (eg: /2 or /2/255) unless there'a a change in settings
    // - offline capabilities
    // Other option would be to load the few initial verses on page load and then the complete data for faster loading times, might think about it later.
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

  // scroll events
  onMount(() => {
    document.addEventListener("scroll", function (e) {
      try {
        // auto-load the next set of verses when the user almost reaches the bottom
        if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 2000) {
          document.querySelector("#loadNextVersesButton > button").click();
        }
      } catch (error) {
        // we know the error... but can make this better.
        console.log(error);
      }
    });
  });

  currentPageStore.set("chapter");
</script>

<svelte:head>
  <title>{quranMetaData[$chapterNumberStore].transliteration} ({$chapterNumberStore}) - {websiteURL}</title>
</svelte:head>

<div>
  {#await fetchData}
    <Spinner />
  {:then}
    <!-- show Bismillah if chapter is not 1st or 9th -->
    {#if ![1, 9].includes($chapterNumberStore)}
      <Bismillah />
    {/if}

    <!-- need custom stylings if display type is 3 or 4 - continuous -->
    <div style={[3, 4].includes($displayTypeStore) && "text-align: center; direction: rtl;"}>
      <ChapterVerses {startVerse} {endVerse} />
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
