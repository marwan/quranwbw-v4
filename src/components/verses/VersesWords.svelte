<script>
  export let key, value;

  import { displayOptions } from "$data/options";
  import { supplicationsFromQuran } from "$data/quranMeta";
  import { currentPageStore, wordTypeStore, displayTypeStore, websiteThemeStore, userSettingsStore, audioSettingsStore, wordTranslationEnabledStore, wordTransliterationEnabledStore } from "$utils/stores";
  import { wordAudioController } from "$utils/audioController";

  const chapter = key.split(":")[0];
  const verse = key.split(":")[1];

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;

  const tajweedWordsURL = "https://static.qurancdn.com/images/w/rq-color";
  const tajweedEndURL = "https://static.qurancdn.com/images/w/common";

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
  const timestampSplit = value.words.timestamp.split("|");

  const wordClasses = `rounded-lg hover:cursor-pointer hover:bg-[#ebebeb] dark:hover:bg-slate-800 ${displayOptions[`${$displayTypeStore}`].layout === "wbw" ? "p-3" : "p-2"}`;

  let displayIsContinuous;

  $: displayIsContinuous = displayOptions[`${$displayTypeStore}`].continuous;
</script>

<!-- word by word layout -->
{#each { length: value.meta.words } as _, word}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id={`${chapter}:${verse}:${word + 1}`} on:click={() => wordAudioController({ chapter, verse, word })} class="word {$displayTypeStore === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses} {$audioSettingsStore.playingWordKey === `${chapter}:${verse}:${word + 1}` && 'bg-[#ebebeb] dark:bg-slate-800'}" style={$currentPageStore === "supplications" && word + 1 < supplicationsFromQuran[key] && "opacity: 30%;"} data-timestamp={timestampSplit[word]}>
    <span class="{`arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
      <!-- 1: Uthmani Hafs, 2: Naskh Nastaleeq IndoPak -->
      {#if $wordTypeStore === 1 || $wordTypeStore === 2}
        {arabicSplit[word]}
        <!-- 3: Uthmani Tajweed -->
      {:else if $wordTypeStore === 3}
        <img class="mx-auto max-h-16 md:max-h-20" alt={arabicSplit[word]} src="{tajweedWordsURL}/{value.meta.chapter}/{value.meta.verse}/{word + 1}.png?v=1" />
        <!-- 4: KFGQPC Tajweed v4 -->
      {:else if $wordTypeStore === 4}
        <span class="p{value.meta.page} {$websiteThemeStore === 2 && 'v4dark'}">{arabicSplit[word]}</span>
      {/if}
    </span>

    <!-- word translation and transliteration -->
    {#if $displayTypeStore === 1 || $displayTypeStore === 3}
      <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
        <span class="leading-normal {$wordTransliterationEnabledStore === true ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
        <span class="leading-normal {$wordTranslationEnabledStore === true ? 'block' : 'hidden'}">{translationSplit[word]}</span>
      </div>
    {/if}
  </div>
{/each}

<!-- end icon -->
<div class="{$displayTypeStore === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses}">
  <span class="{`arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
    {#if $wordTypeStore === 1 || $wordTypeStore === 2}
      {value.words.end}
      <!-- 3: Uthmani Tajweed -->
    {:else if $wordTypeStore === 3}
      <img class="mx-auto max-h-16 md:max-h-20" alt={verse} src="{tajweedEndURL}/{verse}.png?v=1" />
      <!-- 4: KFGQPC Tajweed v4 -->
    {:else if $wordTypeStore === 4}
      <span class="p{value.meta.page} {$websiteThemeStore === 2 && 'v4dark'}">{value.words.end}</span>
    {/if}
  </span>
</div>
