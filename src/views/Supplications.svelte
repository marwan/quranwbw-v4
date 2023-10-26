<script>
  import DisplayIndividualVerses from "$verses/DisplayIndividualVerses.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteTitle, apiEndpoint } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore } from "$utils/stores";

  const supplicationVerses = "2:127,2:128,2:201,2:250,2:286,3:8,3:9,3:16,3:53,3:147,3:191,3:192,3:193,3:194,5:83,5:114,7:23,7:47,7:89,7:126,10:85,10:86,14:38,14:40,14:41,17:24,18:10,18:14,20:45,21:83,21:87,23:109,23:118,25:65,25:66,25:74,28:24,40:7,40:8,40:9,46:15,59:10,60:4,60:5,66:8";

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiURL =
        apiEndpoint +
        new URLSearchParams({
          verses: supplicationVerses,
          word_type: $wordTypeStore,
          word_translation: $wordTranslationStore,
          verse_translation: $verseTranslationsStore.toString(),
        });

      const response = await fetch(apiURL);
      const data = await response.json();
      return data.data.verses;
    })();

    // logging these for now to re-run the block on URL change
    console.log($displayTypeStore, $wordTranslationStore, $verseTranslationsStore);
  }

  currentPageStore.set("supplications");
</script>

<svelte:head>
  <title>Supplications From Quran - {websiteTitle}</title>
</svelte:head>

<div class="">
  {#await fetchData}
    <Spinner />
  {:then chapterData}
    <div>
      {#each Object.entries(chapterData) as [key, value]}
        <DisplayIndividualVerses {key} {value} />
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
