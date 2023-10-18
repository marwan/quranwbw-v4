<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWVerseDisplay from "./displayTypes/WBWVerseDisplay.svelte";
  import NormalVerseDisplay from "./displayTypes/NormalVerseDisplay.svelte";

  import { displayTypeStore } from "../../lib/stores";
</script>

<svelte:component this={$displayTypeStore === 0 ? WBWVerseDisplay : NormalVerseDisplay} {key} {value} />
