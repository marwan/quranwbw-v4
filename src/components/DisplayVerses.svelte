<script>
  export let key, value;

  import WBWVerseDisplay from "../components/VerseDisplays/WBWVerseDisplay.svelte";
  import NormalVerseDisplay from "../components/VerseDisplays/NormalVerseDisplay.svelte";

  import { displayTypeStore } from "../lib/stores";
</script>

<svelte:component this={$displayTypeStore === 0 ? WBWVerseDisplay : NormalVerseDisplay} {key} {value} />
