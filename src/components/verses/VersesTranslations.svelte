<script>
  export let value;
  import { __userSettings, __verseTranslations } from "$utils/stores";
  import { selectableVerseTranslations } from "$data/options";
  const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
</script>

{#if value.translations != undefined}
  <div class="verseTranslationText flex flex-col space-y-4 leading-normal grayscale {fontSizes.verseTranslationText}" data-fontSize={fontSizes.verseTranslationText}>
    {#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
      <div class="flex flex-col">
        <span>{@html verseTranslation}</span>
        {#if $__verseTranslations.length > 1}
          <span class="text-gray-500">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
        {/if}
      </div>
    {/each}
  </div>
{/if}
