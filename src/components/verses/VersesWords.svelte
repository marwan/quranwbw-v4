<script>
  export let value;

  import { displayOptions } from "$data/options";
  import { wordTypeStore, displayTypeStore, userSettingsStore } from "$utils/stores";

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;

  // classes for each display types
  const layoutClasses = {
    1: `arabicText arabic-font-${$wordTypeStore} leading-normal ${fontSizes.arabicText}`,
    2: `arabicText arabic-font-${$wordTypeStore} leading-normal py-2 pl-2 ${fontSizes.arabicText}`,
    3: `arabicText arabic-font-${$wordTypeStore} inline-block leading-normal p-2 group-hover:bg-gray-200 ${fontSizes.arabicText}`,
    4: `arabicText arabic-font-${$wordTypeStore} inline-block leading-normal p-2 group-hover:bg-gray-200 ${fontSizes.arabicText}`,
    5: `arabicText arabic-font-${$wordTypeStore} leading-normal py-2 pl-2 ${fontSizes.arabicText}`,
  };

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");

  const currentLayoutClasses = layoutClasses[`${$displayTypeStore}`];
</script>

<!-- word by word layout -->
{#if displayOptions[`${$displayTypeStore}`].layout === "wbw"}
  {#each { length: value.meta.words } as _, word}
    <div class={$displayTypeStore === 1 ? "text-center flex flex-col p-3" : "inline-flex flex-col p-3"}>
      <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
      <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
        <span class="leading-normal">{transliterationSplit[word]}</span>
        <span class="leading-normal">{translationSplit[word]}</span>
      </div>
    </div>
  {/each}

  <!-- end icon -->
  <div class={$displayTypeStore === 1 ? "text-center flex flex-col p-3" : "inline-flex flex-col p-3"}>
    <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
  </div>

  <!-- normal layout -->
{:else if displayOptions[`${$displayTypeStore}`].layout === "normal"}
  <div class={$displayTypeStore === 4 ? "inline" : "flex flex-row-reverse flex-wrap"}>
    {#each { length: value.meta.words } as _, word}
      <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
    {/each}

    <!-- end icon -->
    <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
  </div>
{/if}
