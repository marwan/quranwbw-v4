<script>
  export let key, value, line;

  import { navigate } from "svelte-routing";

  import { displayOptions } from "$data/options";
  import { supplicationsFromQuran } from "$data/quranMeta";
  import { __currentPage, __wordType, __displayType, __websiteTheme, __userSettings, __audioSettings, __wordTranslationEnabled, __wordTransliterationEnabled, __morphologyKey, __tajweedEnabled } from "$utils/stores";
  import { wordAudioController } from "$utils/audioController";

  const chapter = key.split(":")[0];
  const verse = key.split(":")[1];

  const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
  const timestampSplit = value.words.timestamp.split("|");

  // handle what happens when a word is clicked depending on page type
  function wordClickController(chapter, verse, word) {
    if ($__currentPage === "morphology") {
      const wordKey = `${chapter}:${verse}:${word + 1}`;
      __morphologyKey.set(wordKey);
      navigate(`/morphology/${wordKey}`, { replace: true });
    } else {
      wordAudioController({ chapter, verse, word });
    }
  }

  $: wordClasses = `rounded-lg hover:cursor-pointer hover:bg-[#ebebeb] dark:hover:bg-slate-800 ${displayOptions[`${$__displayType}`].layout === "wbw" ? "p-3" : "p-1"}`;

  $: displayIsContinuous = displayOptions[`${$__displayType}`].continuous;
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
  {#if $__currentPage != "page" || ($__currentPage === "page" && +value.words.line.split("|")[word] === line)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id={`${chapter}:${verse}:${word + 1}`} on:click={() => wordClickController(chapter, verse, word)} class="word {$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses} {$__audioSettings.playingWordKey === `${chapter}:${verse}:${word + 1}` || $__morphologyKey === `${chapter}:${verse}:${word + 1}` ? 'bg-[#ebebeb] dark:bg-slate-800' : ''}" style={$__currentPage === "supplications" && word + 1 < supplicationsFromQuran[key] && "opacity: 30%;"} data-timestamp={timestampSplit[word]}>
      <span class="{`arabicText leading-normal arabic-font-${$__wordType} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
        <!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
        {#if $__wordType === 1 || $__wordType === 3}
          {arabicSplit[word]}
          <!-- 2: Uthmanic Hafs Mushaf -->
        {:else if $__wordType === 2}
          <span class="p{value.meta.page} {$__tajweedEnabled === true ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">{arabicSplit[word]}</span>
        {/if}
      </span>

      <!-- word translation and transliteration -->
      {#if $__displayType === 1 || $__displayType === 3}
        <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText} {displayIsContinuous === true && 'direction-ltr'}" data-fontSize={fontSizes.wordTranslationText}>
          <span class="leading-normal {$__wordTransliterationEnabled === true ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
          <span class="leading-normal {$__wordTranslationEnabled === true ? 'block' : 'hidden'}">{translationSplit[word]}</span>
        </div>
      {/if}
    </div>
  {/if}
{/each}

<!-- end icon -->
{#if $__currentPage != "page" || ($__currentPage === "page" && value.words.end_line === line)}
  <div class="{$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses}">
    <span class="{`arabicText leading-normal arabic-font-${$__wordType} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
      <!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
      {#if $__wordType === 1 || $__wordType === 3}
        {value.words.end}
        <!-- 2: Uthmanic Hafs Mushaf -->
      {:else if $__wordType === 2}
        <span class="p{value.meta.page} {$__tajweedEnabled === true ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">{value.words.end}</span>
      {/if}
    </span>
  </div>
{/if}
