<script>
  export let key, value;

  import VersesButtons from "$verses/VersesButtons.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import VersesTranslations from "$verses/VersesTranslations.svelte";
</script>

<div id={key} class="flex flex-col py-8 space-y-8 border-b">
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    <VersesWords {value} />
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
