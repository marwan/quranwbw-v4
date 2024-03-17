<script>
  export let page;

  import { Link } from "svelte-routing";
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { currentPageStore, wordTypeStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";

  updateSettings({ type: "displayType", value: 4 });

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiHost = "http://localhost:7500";
      // const apiHost = "https://api.quranwbw.com";
      const apiURL = `${apiHost}/v1/page?page=${page}&word_type=${$wordTypeStore}&word_translation=1`;
      const response = await fetch(apiURL);
      const data = await response.json();
      localStorage.setItem("pageData", JSON.stringify(data.data.verses));
      return data.data.verses;
    })();
  }

  currentPageStore.set("page");
</script>

<div class="flex flex-row space-x-8 my-8 justify-center">
  <Link to="/page/{+page - 1}">Previous Page</Link>
  <Link to="/page/{+page + 1}">Next Page</Link>
</div>

<div class="text-center mt-8 text-xl">
  {#await fetchData}
    <Spinner />
  {:then}
    <div style="max-width: 80%;" class="mx-auto">
      {#each Array.from(Array(15 + 1).keys()).slice(1) as line}
        <div class="line {line} arabic-font-{$wordTypeStore} {+page > 2 ? 'flex justify-between' : ''}">
          {#each Object.entries(JSON.parse(localStorage.getItem("pageData"))) as [key, value]}
            <VersesWords {key} {value} {line} />
          {/each}
        </div>
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
