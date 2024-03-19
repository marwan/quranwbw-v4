<script>
  import IndividualVerses from "$verses/IndividualVerses.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteURL, apiEndpoint } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore } from "$utils/stores";
  import { getSupplicationKeys } from "$utils/getSupplicationKeys";

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiURL =
        apiEndpoint +
        new URLSearchParams({
          verses: getSupplicationKeys(),
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
  <title>Supplications From Quran - {websiteURL}</title>
</svelte:head>

<div>
  {#await fetchData}
    <Spinner />
  {:then chapterData}
    <div>
      {#each Object.entries(chapterData) as [key, value]}
        <IndividualVerses {key} {value} />
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
