<script>
  import Selectors from "../components/Selectors.svelte";
  import DisplayVerses from "../components/DisplayVerses.svelte";
  import { websiteTitle, apiEndpoint } from "../lib/websiteSettings";
  import { currentPageStore, wordTypeStore, displayTypeStore } from "../lib/stores";

  let userSettings = JSON.parse(localStorage.getItem("userSettings"));
  let userBookmarks = userSettings["userBookmarks"];

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    if (userBookmarks.length != 0) {
      fetchData = (async () => {
        const api_url = `${apiEndpoint}/verses?verses=${userBookmarks.toString()}&word_type=${$wordTypeStore}&verse_translation=1,15`;
        const response = await fetch(api_url);
        const data = await response.json();
        return data.data.verses;
      })();
    }

    // logging these for now to re-run the block on URL change
    console.log($displayTypeStore);
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
  {/if}
</div>
