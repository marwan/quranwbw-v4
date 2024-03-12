<script>
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteTitle } from "$utils/websiteSettings";
  import { currentPageStore } from "$utils/stores";
  import { timeAgo } from "$utils/timeAgo";
  import { linkElement } from "$utils/commonStyles";

  let fetchData;

  // fetch the commits from our API
  $: {
    fetchData = (async () => {
      const response = await fetch("https://api.quranwbw.com/v1/repo/commits");
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
        <div class="py-6 space-y-2 border-b daark:border-slate-700">
          <div class="space-y-2">
            <div class="truncate"><a href={value.html_url} target="_blank" class={linkElement}>{value.commit.message}</a></div>
            <div>
              <img class="rounded-full inline-flex w-5 h-5" src={value.author.avatar_url} alt={value.author.login} />
              {value.author.login} commited {timeAgo(value.commit.committer.date)} <span class="hidden md:inline-block">({value.sha.substring(0, 7)})</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
