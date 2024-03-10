<script>
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteTitle } from "$utils/websiteSettings";
  import { currentPageStore } from "$utils/stores";
  import { linkElement } from "$utils/commonStyles";

  let fetchData;

  // fetch the commits from our API
  $: {
    fetchData = (async () => {
      const response = await fetch("https://api.quranwbw.com/v1/commits");
      const data = await response.json();
      return data.data;
    })();
  }

  currentPageStore.set("changelogs");
</script>

<svelte:head>
  <title>Changelogs - {websiteTitle}</title>
</svelte:head>

<div class="">
  <div class="my-6 space-y-4 pb-4 border-b-2">
    <h1 class="text-2xl">Changelogs</h1>
    <div class="text-sm">This page contains all the commits made to the Quranwbw.com's <a href="https://github.com/marwan/quranwbw-svelte" target="_blank" class={linkElement}>source code on GitHub</a>. However, the changes made to the database or the API will not be reflected here.</div>
  </div>

  {#await fetchData}
    <Spinner />
  {:then fetchData}
    <div class="text-sm">
      {#each Object.entries(fetchData) as [key, value]}
        <div class="py-6 space-y-2 border-b">
          <div>
            <span class="opacity-100 underline decoration-dotted">{value.commit.committer.date.substring(0, 10)}:</span>
            <span> {value.commit.message}</span>
          </div>
          <div class="truncate"><a href={value.html_url} target="_blank" class={linkElement}>{value.html_url}</a></div>
        </div>
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
