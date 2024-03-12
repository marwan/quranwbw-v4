<script>
  export let key;

  const chapter = +key.split(":")[0];
  const verse = +key.split(":")[1];

  import { Link } from "svelte-routing";
  import { showAudioModal } from "$utils/audioController";
  import { currentPageStore, userSettingsStore, audioSettingsStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";

  // icons
  import Bookmark from "$svgs/Bookmark.svelte";
  import Bookmarked from "$svgs/Bookmarked.svelte";
  import Play from "$svgs/Play.svelte";
  import Pause from "$svgs/Pause.svelte";

  // update userBookmarks whenever the userSettingsStore changes
  $: userBookmarks = JSON.parse($userSettingsStore).userBookmarks;

  const buttonClasses = "inline-flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-150 rounded-lg focus:shadow-outline bg-[#ebebeb] hover:bg-gray-200 print:hidden daark:bg-slate-800 daark:hover:bg-slate-700";
</script>

<div class="verseButtons flex flex-row space-x-4 text-gray-400 text-xs">
  <Link to={$currentPageStore === "chapter" ? "./#" : `/${chapter}/${verse}`} class={buttonClasses}>{key}</Link>

  <button on:click={() => updateSettings({ type: "userBookmarks", key })} class={buttonClasses}>
    <svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
  </button>
  <button on:click={() => showAudioModal(key)} class={buttonClasses}>
    <svelte:component this={$audioSettingsStore.isPlaying === true && $audioSettingsStore.playingKey === key ? Pause : Play} />
  </button>
</div>
