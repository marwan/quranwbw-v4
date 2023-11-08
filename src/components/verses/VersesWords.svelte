<script>
  export let key, value;

  import { displayOptions } from "$data/options";
  import { supplicationsFromQuran } from "$data/quranMeta";
  import { currentPageStore, wordTypeStore, displayTypeStore, userSettingsStore } from "$utils/stores";
  import { playAudio } from "$utils/audioController";

  const chapter = key.split(":")[0];
  const verse = key.split(":")[1];

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;

  const wordClasses = "rounded-md hover:cursor-pointer hover:bg-[#ebebeb] daaark:hover:bg-slate-800";

  // classes for each display types
  const layoutClasses = {
    1: `arabicText arabic-font-${$wordTypeStore} leading-normal ${fontSizes.arabicText}`,
    2: `arabicText arabic-font-${$wordTypeStore} leading-normal py-2 pl-2 ${fontSizes.arabicText}`,
    3: `arabicText arabic-font-${$wordTypeStore} inline-block leading-normal p-2 group-hover:bg-[#ebebeb] ${fontSizes.arabicText}`,
    4: `arabicText arabic-font-${$wordTypeStore} inline-block leading-normal p-2 group-hover:bg-[#ebebeb] ${fontSizes.arabicText}`,
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={() => playAudio({ type: "word", chapter, verse, word: word + 1 })} class="{$displayTypeStore === 1 ? 'text-center flex flex-col p-3' : 'inline-flex flex-col p-3'} {wordClasses}" style={$currentPageStore === "supplications" && word + 1 < supplicationsFromQuran[key] ? "opacity: 30%;" : ""}>
      <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
      <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
        <span class="leading-normal">{transliterationSplit[word]}</span>
        <span class="leading-normal">{translationSplit[word]}</span>
      </div>
    </div>
  {/each}

  <!-- end icon -->
  <div class="{$displayTypeStore === 1 ? 'text-center flex flex-col p-3' : 'inline-flex flex-col p-3'} {wordClasses}">
    <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
  </div>

  <!-- normal layout -->
{:else if displayOptions[`${$displayTypeStore}`].layout === "normal"}
  <div class={$displayTypeStore === 4 ? "inline" : "flex flex-row-reverse flex-wrap"}>
    {#each { length: value.meta.words } as _, word}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span on:click={() => playAudio({ type: "word", chapter, verse, word: word + 1 })} class="{currentLayoutClasses} {wordClasses}" data-fontSize={fontSizes.arabicText}>{arabicSplit[word]}</span>
    {/each}

    <!-- end icon -->
    <span class="{currentLayoutClasses} {wordClasses}" data-fontSize={fontSizes.arabicText}>{value.words.end}</span>
  </div>
{/if}
