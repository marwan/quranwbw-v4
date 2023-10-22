<script>
  export let key, value;

  import { wordTypeStore } from "../../../utils/stores";
  import { pageNumberKeys } from "../../../utils/quranMeta";

  const arabicWordStyles = `arabic-font-${$wordTypeStore} inline-block text-4xl leading-normal p-2 group-hover:bg-gray-200`;

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.indexOf(key) != -1}
  <div class="flex flex-col justify-center mx-auto w-32 mt-12 mb-6 border px-4 py-2 text-sm rounded-lg">Page {value.meta.page}</div>
{/if}

<div id={key} class="inline py-2 group">
  {#each { length: value.meta.words } as _, word}
    <div class="inline-flex flex-col p-3">
      <span class={arabicWordStyles}>{arabicSplit[word]}</span>
      <div class="flex flex-col text-sm">
        <span class="leading-normal">{transliterationSplit[word]}</span>
        <span class="leading-normal">{translationSplit[word]}</span>
      </div>
    </div>
  {/each}
  <span class={arabicWordStyles}>{value.words.end}</span>
</div>
