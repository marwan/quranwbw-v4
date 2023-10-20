<script>
  export let key, value;

  import { wordTypeStore } from "../../../utils/stores";
  import { pageNumberKeys } from "../../../utils/quranMeta";

  let pageNumber,
    isFirstOfPage = false;

  // if the current key is the first verse of a page
  if (pageNumberKeys.indexOf(key) != -1) {
    pageNumber = pageNumberKeys.indexOf(key);
    isFirstOfPage = true;
  }
</script>

{#if isFirstOfPage === true}
  <div class="flex flex-col justify-center mx-auto w-32 mt-12 mb-6 border px-4 py-2 text-sm rounded-lg">Page {pageNumber}</div>
{/if}

<div id={key} class="inline py-2">
  {#each { length: value.meta.words } as _, word}
    <!-- <div class="inline-flex flex-col p-3"> -->
    <span class="arabic-font-{$wordTypeStore} inline-block text-4xl leading-normal p-2">{value.words.arabic.split("|")[word]}</span>
    <!-- <div class="flex flex-col text-sm">
        <span class="leading-normal">{value.words.transliteration.split("|")[word]}</span>
        <span class="leading-normal">{value.words.translation.split("|")[word]}</span>
      </div> -->
    <!-- </div> -->
  {/each}
  <span class="arabic-font-{$wordTypeStore} inline-block text-4xl leading-normal p-2">{value.words.end}</span>
</div>
