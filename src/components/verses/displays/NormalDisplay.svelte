<script>
  export let key, value;

  import VersesButtons from "../VersesButtons.svelte";
  import VersesTranslations from "../VersesTranslations.svelte";
  import { wordTypeStore } from "../../../utils/stores";
</script>

<div id={key} class="flex flex-col py-8 space-y-8 border-b">
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    {#each { length: value.meta.words } as _, word}
      <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.arabic.split("|")[word]}</span>
    {/each}

    <span class="arabic-font-{$wordTypeStore} text-4xl leading-normal py-2 pl-2">{value.words.end}</span>
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
