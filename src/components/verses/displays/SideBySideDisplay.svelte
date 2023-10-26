<script>
  export let key, value;

  import VersesWords from "$verses/VersesWords.svelte";
  import VersesTranslations from "$verses/VersesTranslations.svelte";
</script>

<div id={key} class="grid grid-cols-2 gap-x-8 py-8 border-b">
  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap order-last">
    <VersesWords {value} />
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
