<script>
  export let key, value;

  import VersesTranslations from "../VersesTranslations.svelte";
  import { wordTypeStore } from "../../../utils/stores";
</script>

<div id={key} class="grid grid-cols-2 gap-x-8 py-8 border-b">
  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap order-last">
    {#each { length: value.meta.words } as _, word}
      <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.arabic.split("|")[word]}</span>
    {/each}

    <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.end}</span>
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
