<script>
  export let key, value;

  import VersesButtons from "../VersesButtons.svelte";
  import VersesTranslations from "../VersesTranslations.svelte";
  import { wordTypeStore } from "../../../utils/stores";
</script>

<div id={key} data-page={value.meta.page} class="flex flex-col py-8 space-y-8 border-b">
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    {#each { length: value.meta.words } as _, word}
      <div class="flex flex-col p-3 text-center">
        <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal">{value.words.arabic.split("|")[word]}</span>
        <div class="flex flex-col text-sm">
          <span class="leading-normal">{value.words.transliteration.split("|")[word]}</span>
          <span class="leading-normal">{value.words.translation.split("|")[word]}</span>
        </div>
      </div>
    {/each}

    <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal p-3">{value.words.end}</span>
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
