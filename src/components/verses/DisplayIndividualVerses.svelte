<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWDisplay from "$displays/WBWDisplay.svelte";
  import NormalDisplay from "$displays/NormalDisplay.svelte";

  import { updateSettings } from "$utils/updateSettings";
  import { displayTypeStore } from "$utils/stores";

  // set the display back to type 1
  updateSettings({ type: "displayType", value: 1 });
</script>

<svelte:component this={$displayTypeStore === 1 ? WBWDisplay : NormalDisplay} {key} {value} />
