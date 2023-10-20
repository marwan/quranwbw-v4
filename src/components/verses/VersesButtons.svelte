<script>
  export let key;

  import { userSettingsStore } from "../../utils/stores";
  import { updateBookmarks } from "../../utils/updateBookmarks";

  // update userBookmarks whenever the userSettingsStore changes
  $: userBookmarks = JSON.parse($userSettingsStore)["userBookmarks"];
</script>

<div class="flex flex-row space-x-8">
  <span>({key})</span>
  <button on:click={updateBookmarks} data-key={key} class="px-4 text-sm rounded-lg">{userBookmarks.includes(key) ? "Unbookmark" : "Bookmark"}</button>
</div>
