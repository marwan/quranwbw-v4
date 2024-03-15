<script>
  export let key, value;

  import { inview } from "svelte-inview";

  import VersesWords from "$verses/VersesWords.svelte";
  import { pageNumberKeys } from "$data/quranMeta";
  import { updateSettings } from "$utils/updateSettings";
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.includes(key)}
  <div class="flex flex-col justify-center mx-auto w-32 mt-12 mb-6 py-2 px-4 text-sm cursor-pointer rounded-lg bg-[#ebebeb] dark:bg-slate-800">Page {value.meta.page}</div>
{/if}

<div
  id={key}
  data-words={value.meta.words}
  data-page={value.meta.page}
  data-juz={value.meta.juz}
  use:inview
  on:inview_enter={(event) => {
    updateSettings({ type: "lastRead", value: `${event.target.id}` });
  }}
  class="inline py-2 group"
>
  <VersesWords {key} {value} />
</div>
