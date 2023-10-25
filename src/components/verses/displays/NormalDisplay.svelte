<script>
  export let key, value;

  import VersesButtons from "../VersesButtons.svelte";
  import VersesTranslations from "../VersesTranslations.svelte";
  import { wordTypeStore, userSettingsStore } from "../../../utils/stores";

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
  const arabicWordStyles = `arabicText arabic-font-${$wordTypeStore} leading-normal py-2 pl-2 ${fontSizes.arabicText}`;

  const arabicSplit = value.words.arabic.split("|");
</script>

<div id={key} class="flex flex-col py-8 space-y-8 border-b">
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    {#each { length: value.meta.words } as _, word}
      <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
    {/each}

    <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
