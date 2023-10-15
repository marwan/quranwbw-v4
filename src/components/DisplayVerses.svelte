<script>
  export let key, value;

  import { wordType, userSettingsStore } from "../lib/stores";
  import { updateBookmarks } from "../lib/updateBookmarks";

  // update userBookmarksStore whenever the userSettingsStore changes
  let userBookmarksStore;

  $: {
    userBookmarksStore = JSON.parse($userSettingsStore)["userBookmarks"];
  }
</script>

<div id={key} class="flex flex-col py-8 border-b">
  <div class="flex flex-row space-x-8">
    <span>({key})</span>
    <button data-key={key} class="px-4" on:click={updateBookmarks}>{userBookmarksStore.includes(key) ? "Unbookmark" : "Bookmark"}</button>
  </div>
  <p class="arabic-font-{$wordType} text-4xl leading-normal py-8">{value.words.arabic.replace(/\|/g, " ")} {value.words.end}</p>
  <div class="flex flex-col space-y-4 text-lg leading-normal">
    <p>{value.translations["1"]}</p>
    <p>{value.translations["15"]}</p>
  </div>
</div>
