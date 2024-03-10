<script>
  export let value;
  import { userSettingsStore } from "$utils/stores";
  import { selectableVerseTranslations } from "$data/options";
  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
</script>

{#if value.translations != undefined}
  <div class="verseTranslationText flex flex-col space-y-4 leading-normal {fontSizes.verseTranslationText}" data-fontSize={fontSizes.verseTranslationText}>
    {#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
      <div class="flex flex-col">
        <span>{verseTranslation}</span>
        <span class="text-gray-400">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
      </div>
    {/each}
  </div>
{/if}
