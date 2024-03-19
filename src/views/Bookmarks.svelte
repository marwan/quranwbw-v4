<script>
  import IndividualVerses from "$verses/IndividualVerses.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteURL, apiEndpoint } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore, displayTypeStore, wordTranslationStore, verseTranslationsStore } from "$utils/stores";

  const userSettings = JSON.parse(localStorage.getItem("userSettings"));
  const userBookmarks = userSettings["userBookmarks"];

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
  <title>Bookmarks - {websiteURL}</title>
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
          <IndividualVerses {key} {value} />
        {/each}
      </div>
    {:catch error}
      <p>{error}</p>
    {/await}
  {/if}
</div>
