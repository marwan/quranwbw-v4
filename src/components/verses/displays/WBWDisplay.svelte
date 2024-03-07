<script>
  export let key, value;

  import { inview } from "svelte-inview";

  import VersesButtons from "$verses/VersesButtons.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import VersesTranslations from "$verses/VersesTranslations.svelte";
  import { updateSettings } from "$utils/updateSettings";
</script>

<div
  id={key}
  data-page={value.meta.page}
  data-juz={value.meta.juz}
  class="verse flex flex-col py-8 space-y-8 border-b"
  use:inview
  on:inview_enter={(event) => {
    updateSettings({ type: "lastRead", value: `${event.target.id}` });
  }}
>
  <VersesButtons {key} />

  <!-- words -->
  <div class="flex flex-row-reverse flex-wrap">
    <VersesWords {key} {value} />
  </div>

  <!-- verse translations and transliterations -->
  <VersesTranslations {value} />
</div>
