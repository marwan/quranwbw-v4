<script>
  import DisplayIndividualVerses from "../components/verses/DisplayIndividualVerses.svelte";
  import Spinner from "../components/Spinner.svelte";
  import { websiteTitle, apiEndpoint } from "../utils/websiteSettings";
  import { currentPageStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore } from "../utils/stores";

  let userSettings = JSON.parse(localStorage.getItem("userSettings"));
  let userBookmarks = userSettings["userBookmarks"];

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    if (userBookmarks.length != 0) {
      fetchData = (async () => {
        const apiURL =
          apiEndpoint +
          new URLSearchParams({
            verses: userBookmarks.toString(),
            word_type: $wordTypeStore,
            word_translation: $wordTranslationStore,
            verse_translation: $verseTranslationsStore.toString(),
          });

        const response = await fetch(apiURL);
        const data = await response.json();
        return data.data.verses;
      })();
    }

    // logging these for now to re-run the block on URL change
    console.log($displayTypeStore, $wordTranslationStore, $verseTranslationsStore);
  }

  currentPageStore.set("bookmarks");
</script>

<svelte:head>
  <title>Bookmarks - {websiteTitle}</title>
</svelte:head>

<div class="">
  {#if userBookmarks.length === 0}
    <div class="flex items-center justify-center pt-28">You currently do not have any bookmarked verses.</div>
  {:else}
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
  {/if}
</div>
