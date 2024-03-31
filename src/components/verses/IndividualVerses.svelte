<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWDisplay from "$displays/WBWDisplay.svelte";
  import NormalDisplay from "$displays/NormalDisplay.svelte";

  import { updateSettings } from "$utils/updateSettings";
  import { __displayType } from "$utils/stores";

  // set the display back to type 1, in case it was 3, 4 or 5
  if ($__displayType > 2) {
    updateSettings({ type: "displayType", value: 1 });
  }
</script>

<svelte:component this={$__displayType === 1 ? WBWDisplay : NormalDisplay} {key} {value} />
