<script>
  export let value;

  import { selectableVerseTranslations } from "../../utils/options";
</script>

{#if value.translations != undefined}
  <div class="flex flex-col space-y-4 text-lg leading-normal">
    {#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
      <div class="flex flex-col">
        <span>{verseTranslation}</span>
        <span class="text-sm">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
      </div>
    {/each}
  </div>
{/if}
