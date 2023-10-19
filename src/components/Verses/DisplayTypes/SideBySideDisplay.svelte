<script>
  export let key, value;

  import { wordTypeStore } from "../../../lib/stores";
  import { selectableVerseTranslations } from "../../../lib/options";
</script>

<div id={key} class="flex flex-row-reverse justify-between py-8 space-x-4 border-b">
  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    {#each { length: value.meta.words } as _, word}
      <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.arabic.split("|")[word]}</span>
    {/each}

    <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.end}</span>
  </div>

  <!-- verse translations and transliterations -->
  <div class="flex flex-col space-y-4 text-lg leading-normal">
    {#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
      <div class="flex flex-col">
        <span>{verseTranslation}</span>
        <span class="text-sm">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
      </div>
    {/each}
  </div>
</div>
