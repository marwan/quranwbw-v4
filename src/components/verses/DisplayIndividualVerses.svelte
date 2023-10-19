<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWDisplay from "./DisplayTypes/WBWDisplay.svelte";
  import NormalDisplay from "./DisplayTypes/NormalDisplay.svelte";

  import { displayTypeStore } from "../../lib/stores";
</script>

<svelte:component this={$displayTypeStore === 0 ? WBWDisplay : NormalDisplay} {key} {value} />
