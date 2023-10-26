<script>
  export let key, value;

  import VersesWords from "$verses/VersesWords.svelte";
  import { pageNumberKeys } from "$data/quranMeta";
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.indexOf(key) != -1}
  <div class="flex flex-col justify-center mx-auto w-32 mt-12 mb-6 border px-4 py-2 text-sm rounded-lg">Page {value.meta.page}</div>
{/if}

<div id={key} class="inline py-2 group">
  <VersesWords {value} />
</div>
