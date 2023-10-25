<script>
  export let key;

  import { userSettingsStore } from "../../utils/stores";
  import { updateBookmarks } from "../../utils/updateBookmarks";

  // icons
  import Bookmark from "../svgs/Bookmark.svelte";
  import Bookmarked from "../svgs/Bookmarked.svelte";

  // update userBookmarks whenever the userSettingsStore changes
  $: userBookmarks = JSON.parse($userSettingsStore)["userBookmarks"];
</script>

<div class="flex flex-row space-x-8">
  <button class="text-sm p-3 border-none">{key}</button>
  <button on:click={updateBookmarks} data-key={key} class="text-sm p-3 border-none">
    {#if userBookmarks.includes(key)}
      <Bookmarked />
    {:else}
      <Bookmark />
    {/if}
  </button>
</div>
