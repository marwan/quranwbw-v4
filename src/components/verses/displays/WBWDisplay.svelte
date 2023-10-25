<script>
  export let key, value;

  import VersesButtons from "../VersesButtons.svelte";
  import VersesTranslations from "../VersesTranslations.svelte";
  import { wordTypeStore, userSettingsStore } from "../../../utils/stores";

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
  const arabicWordStyles = `arabicText arabic-font-${$wordTypeStore} leading-normal ${fontSizes.arabicText}`;

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
</script>

<div id={key} data-page={value.meta.page} class="flex flex-col py-8 space-y-8 border-b">
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    {#each { length: value.meta.words } as _, word}
      <div class="flex flex-col p-3 text-center">
        <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
        <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
          <span class="leading-normal">{transliterationSplit[word]}</span>
          <span class="leading-normal">{translationSplit[word]}</span>
        </div>
      </div>
    {/each}

    <div class="flex flex-col p-3 text-center">
      <span class={arabicWordStyles} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
    </div>
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
