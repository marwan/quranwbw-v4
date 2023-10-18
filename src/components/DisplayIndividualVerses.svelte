<!-- component to load verses for supplications and bookmarks -->
<script>
  export let key, value;

  import WBWVerseDisplay from "./VerseDisplays/WBWVerseDisplay.svelte";
  import NormalVerseDisplay from "./VerseDisplays/NormalVerseDisplay.svelte";

  import { displayTypeStore } from "../lib/stores";
</script>

<svelte:component this={$displayTypeStore === 0 ? WBWVerseDisplay : NormalVerseDisplay} {key} {value} />
