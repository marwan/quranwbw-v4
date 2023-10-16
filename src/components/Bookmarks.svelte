<script>
  import Selectors from "./Selectors.svelte";
  import DisplayVerses from "./DisplayVerses.svelte";
  import { currentPage, wordType } from "../lib/stores";

  let fetchData;

  let userSettings = JSON.parse(localStorage.getItem("userSettings"));
  let userBookmarks = userSettings["userBookmarks"];

  // fetch verses whenever there's a change
  $: {
    if (userBookmarks.length != 0) {
      fetchData = (async () => {
        const api_url = `https://api.quranwbw.com/v1/verses?verses=${userBookmarks.toString()}&word_type=${$wordType}&verse_translation=1,15`;
        const response = await fetch(api_url);
        const data = await response.json();
        return data.data.verses;
      })();
    }
  }

  currentPage.set("bookmarks");
</script>

<svelte:head>
  <title>Bookmarks - QuranWBW.com</title>
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
