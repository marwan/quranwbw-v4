<script>
  export let key;

  import { userSettingsStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";

  // icons
  import Bookmark from "$svgs/Bookmark.svelte";
  import Bookmarked from "$svgs/Bookmarked.svelte";

  // update userBookmarks whenever the userSettingsStore changes
  $: userBookmarks = JSON.parse($userSettingsStore).userBookmarks;

  const buttonStyles = "inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 rounded-lg focus:shadow-outline hover:bg-white print:hidden";
</script>

<div class="flex flex-row space-x-4 text-gray-400">
  <button class={buttonStyles}>{key}</button>
  <button on:click={() => updateSettings({ type: "userBookmarks", key })} class={buttonStyles}>
    <svelte:component this={userBookmarks.includes(key) === true ? Bookmarked : Bookmark} />
  </button>
</div>
