<script>
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { currentPageStore, wordTypeStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";

  updateSettings({ type: "displayType", value: 4 });

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    fetchData = (async () => {
      const apiURL = "https://api.quranwbw.com/v1/page?page=1&word_type=1&word_translation=1";
      const response = await fetch(apiURL);
      const data = await response.json();
      localStorage.setItem("pageData", JSON.stringify(data.data.verses));
      return data.data.verses;
    })();
  }

  currentPageStore.set("page");
</script>

<div class="text-center mt-8 text-xl">
  {#await fetchData}
    <Spinner />
  {:then}
    {#each Array.from(Array(15 + 1).keys()).slice(1) as line}
      <div class="line {line} arabic-font-{$wordTypeStore}">
        {#each Object.entries(JSON.parse(localStorage.getItem("pageData"))) as [key, value]}
          <!-- <span>{value.words.arabic.split("|")[word]}</span> -->
          <VersesWords {key} {value} {line} />
        {/each}
      </div>
    {/each}
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
