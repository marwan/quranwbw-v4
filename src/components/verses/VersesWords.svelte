<script>
  export let key, value;

  import { displayOptions } from "$data/options";
  import { supplicationsFromQuran } from "$data/quranMeta";
  import { currentPageStore, wordTypeStore, displayTypeStore, userSettingsStore, audioSettingsStore, wordTranslationEnabledStore, wordTransliterationEnabledStore } from "$utils/stores";
  import { wordAudioController } from "$utils/audioController";

  const chapter = key.split(":")[0];
  const verse = key.split(":")[1];

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;

  const wordClasses = "rounded-lg hover:cursor-pointer hover:bg-[#ebebeb] dark:hover:bg-slate-800";

  const tajweedWordsURL = "https://static.qurancdn.com/images/w/rq-color";
  const tajweedEndURL = "https://static.qurancdn.com/images/w/common";

  // classes for each display types
  const layoutClasses = {
    1: `arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText}`,
    2: `arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText} p-2 px-1`,
    3: `arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText} inline-block p-2 group-hover:bg-[#ebebeb]`,
    4: `arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText} inline-block p-2 group-hover:bg-[#ebebeb]`,
    5: `arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText} p-2 px-1`,
  };

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
  const timestampSplit = value.words.timestamp.split("|");

  const currentLayoutClasses = layoutClasses[`${$displayTypeStore}`];
</script>

<!-- word by word layout -->
{#if displayOptions[`${$displayTypeStore}`].layout === "wbw"}
  {#each { length: value.meta.words } as _, word}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id={`${chapter}:${verse}:${word + 1}`} on:click={() => wordAudioController({ chapter, verse, word })} class="word {$displayTypeStore === 1 ? 'text-center flex flex-col p-3' : 'inline-flex flex-col p-3'} {wordClasses} {$audioSettingsStore.playingWordKey === `${chapter}:${verse}:${word + 1}` ? 'bg-[#ebebeb]' : ''}" style={$currentPageStore === "supplications" && word + 1 < supplicationsFromQuran[key] ? "opacity: 30%;" : ""} data-timestamp={timestampSplit[word]}>
      <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>
        <!-- 1: Uthmani Hafs, 2: Naskh Nastaleeq IndoPak -->
        {#if $wordTypeStore === 1 || $wordTypeStore === 2}
          {arabicSplit[word]}
          <!-- 3: Uthmani Tajweed -->
        {:else if $wordTypeStore === 3}
          <img class="mx-auto max-h-16 md:max-h-20" alt={arabicSplit[word]} src="{tajweedWordsURL}/{value.meta.chapter}/{value.meta.verse}/{word + 1}.png?v=1" />
          <!-- 4: KFGQPC Tajweed v4 -->
        {:else if $wordTypeStore === 4}
          <span class="p{value.meta.page}">{arabicSplit[word]}</span>
        {/if}
      </span>

      <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
        <span class="leading-normal {$wordTransliterationEnabledStore === true ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
        <span class="leading-normal {$wordTranslationEnabledStore === true ? 'block' : 'hidden'}">{translationSplit[word]}</span>
      </div>
    </div>
  {/each}

  <!-- end icon -->
  <div class="{$displayTypeStore === 1 ? 'text-center flex flex-col p-3' : 'inline-flex flex-col p-3'} {wordClasses}">
    <span class={currentLayoutClasses} data-fontSize={fontSizes.arabicText}>
      {#if $wordTypeStore === 1 || $wordTypeStore === 2}
        {value.words.end}
        <!-- 3: Uthmani Tajweed -->
      {:else if $wordTypeStore === 3}
        <img class="mx-auto max-h-16 md:max-h-20" alt={verse} src="{tajweedEndURL}/{verse}.png?v=1" />
        <!-- 4: KFGQPC Tajweed v4 -->
      {:else if $wordTypeStore === 4}
        <span class="p{value.meta.page}">{value.words.end}</span>
      {/if}
    </span>
  </div>

  <!-- normal layout -->
{:else if displayOptions[`${$displayTypeStore}`].layout === "normal"}
  <div class={$displayTypeStore === 4 ? "inline" : "flex flex-row-reverse flex-wrap"}>
    {#each { length: value.meta.words } as _, word}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span id={`${chapter}:${verse}:${word + 1}`} on:click={() => wordAudioController({ chapter, verse, word })} class="word {currentLayoutClasses} {wordClasses} {$audioSettingsStore.playingWordKey === `${chapter}:${verse}:${word + 1}` ? 'bg-[#ebebeb]' : ''}" data-fontSize={fontSizes.arabicText} data-timestamp={timestampSplit[word]}>
        <!-- 1: Uthmani Hafs, 2: Naskh Nastaleeq IndoPak -->
        {#if $wordTypeStore === 1 || $wordTypeStore === 2}
          {arabicSplit[word]}
          <!-- 3: Uthmani Tajweed -->
        {:else if $wordTypeStore === 3}
          <img class="mx-auto max-h-16 md:max-h-20" alt={arabicSplit[word]} src="{tajweedWordsURL}/{value.meta.chapter}/{value.meta.verse}/{word + 1}.png?v=1" />
          <!-- 4: KFGQPC Tajweed v4 -->
        {:else if $wordTypeStore === 4}
          <span class="p{value.meta.page}">{arabicSplit[word]}</span>
        {/if}
      </span>
    {/each}

    <!-- end icon -->
    <span class="{currentLayoutClasses} {wordClasses}" data-fontSize={fontSizes.arabicText}>
      {#if $wordTypeStore === 1 || $wordTypeStore === 2}
        {value.words.end}
        <!-- 3: Uthmani Tajweed -->
      {:else if $wordTypeStore === 3}
        <img class="mx-auto max-h-16 md:max-h-20" alt={verse} src="{tajweedEndURL}/{verse}.png?v=1" />
        <!-- 4: KFGQPC Tajweed v4 -->
      {:else if $wordTypeStore === 4}
        <span class="p{value.meta.page}">{value.words.end}</span>
      {/if}
    </span>
  </div>
{/if}
