<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWDisplay from "./displays/WBWDisplay.svelte";
  import NormalDisplay from "./displays/NormalDisplay.svelte";

  import { displayTypeStore } from "../../lib/stores";
</script>

<svelte:component this={$displayTypeStore === 0 ? WBWDisplay : NormalDisplay} {key} {value} />
