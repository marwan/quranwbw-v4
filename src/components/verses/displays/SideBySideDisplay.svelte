<script>
  export let key, value;

  import VersesButtons from "$verses/VersesButtons.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import VersesTranslations from "$verses/VersesTranslations.svelte";
</script>

<div class="flex flex-col py-8 border-b space-y-8">
  <VersesButtons {key} />

  <div id={key} class="grid grid-cols-2 gap-x-8">
    <!-- words -->
    <div class="flex flex-row-reverse flex-wrap order-last">
      <VersesWords {key} {value} />
    </div>

    <!-- verse translations and transliterations -->
    <VersesTranslations {value} />
  </div>
</div>
