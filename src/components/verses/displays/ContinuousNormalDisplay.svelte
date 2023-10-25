<script>
  export let key, value;

  import { wordTypeStore, userSettingsStore } from "../../../utils/stores";
  import { pageNumberKeys } from "../../../utils/quranMeta";

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
  const arabicWordStyles = `arabicText arabic-font-${$wordTypeStore} inline-block leading-normal p-2 group-hover:bg-gray-200 ${fontSizes.arabicText}`;

  const arabicSplit = value.words.arabic.split("|");
</script>

<!-- if the current key is the first verse of a page  -->
{#if pageNumberKeys.indexOf(key) != -1}
  <div class="flex flex-col justify-center mx-auto w-32 mt-12 mb-6 border px-4 py-2 text-sm rounded-lg">Page {value.meta.page}</div>
{/if}

<div id={key} class="inline py-2 group">
  {#each { length: value.meta.words } as _, word}
    <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
  {/each}
  <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
</div>
