<script>
  import PageMeta from "$components/PageMeta.svelte";
  import IndividualVerses from "$verses/IndividualVerses.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteURL, apiEndpoint } from "$data/websiteSettings";
  import { __currentPage, __wordType, __displayType, __wordTranslation, __verseTranslations } from "$utils/stores";

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
            word_type: $__wordType,
            word_translation: $__wordTranslation,
            verse_translation: $__verseTranslations.toString(),
          });

        const response = await fetch(apiURL);
        const data = await response.json();
        return data.data.verses;
      })();
    }

    // logging these for now to re-run the block on URL change
    console.log($__displayType, $__wordTranslation, $__verseTranslations);
  }

  __currentPage.set("bookmarks");
</script>

<PageMeta title={"Bookmarks"} />

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
