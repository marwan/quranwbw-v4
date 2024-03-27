<script>
  import { Link } from "svelte-routing";
  import { audioSettingsStore } from "$utils/stores";
  import { chapterNumberStore, displayTypeStore, currentPageStore, bottomNavbarVisibleStore } from "$utils/stores";
  import { resetAudioSettings, showAudioModal, playAudio } from "$utils/audioController";
  import { quranMetaData } from "$data/quranMeta";
  import { disabledElement } from "$utils/commonStyles";
  import { updateSettings } from "$utils/updateSettings";

  // icons
  // import Play from "$svgs/Play.svelte";
  import PlaySolid from "$svgs/PlaySolid.svelte";
  import Pause from "$svgs/Pause.svelte";
  import ChevronLeft from "$svgs/ChevronLeft.svelte";
  import ChevronRight from "$svgs/ChevronRight.svelte";
  import Settings from "$svgs/Settings.svelte";
  import Eye from "$svgs/Eye.svelte";

  function audioController() {
    if ($audioSettingsStore.isPlaying === true) {
      resetAudioSettings();
    } else {
      playAudio({
        type: "verse",
        chapter: $chapterNumberStore,
        verse: 1,
        firstToPlay: 1,
        lastToPlay: quranMetaData[$chapterNumberStore].verses,
        timesToRepeat: 1,
        delay: 0,
      });
    }
  }
</script>

<div class={$currentPageStore === "chapter" ? "block" : "hidden"}>
  <div class="{$bottomNavbarVisibleStore === true ? 'block' : 'hidden'} fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-md -translate-x-1/2 bg-white backdrop-filter backdrop-blur-lg bg-opacity-50 border border-gray-200 rounded-full bottom-4 left-1/2 grayscale">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
      <!-- Previous Chapter -->
      <Link to="/{$chapterNumberStore - 1}" class="{$chapterNumberStore === 1 && disabledElement} inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-200 dark:hover:bg-gray-800 group">
        <ChevronLeft />
        <span class="sr-only">Previous Chapter</span>
      </Link>

      <!-- 2nd icon -->
      <button type="button" on:click={() => updateSettings({ type: "displayType", value: $displayTypeStore === 5 ? 1 : $displayTypeStore + 1 })} class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-gray-200 dark:hover:bg-gray-800 group">
        <Eye />
        <span class="sr-only">Display Type</span>
      </button>

      <!-- 3rd icon -->
      <!-- play/pause button -->
      <div class="flex items-center justify-center">
        <button type="button" on:click={() => audioController()} class="inline-flex items-center justify-center w-10 h-10 font-medium bg-[#ebebeb] hover:bg-gray-200 rounded-full group focus:ring-2 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
          <svelte:component this={$audioSettingsStore.isPlaying === true ? Pause : PlaySolid} />
          <span class="sr-only">Play/Pause</span>
        </button>
      </div>

      <!-- 4th icon -->
      <button type="button" data-drawer-target="settings-drawer" data-drawer-show="settings-drawer" data-drawer-placement="right" aria-controls="settings-drawer" class="opacity-70 inline-flex flex-col items-center justify-center px-5 hover:bg-gray-200 dark:hover:bg-gray-800 group">
        <Settings />
        <span class="sr-only">Settings</span>
      </button>

      <!-- Next Chapter -->
      <Link to="/{$chapterNumberStore + 1}" class="{$chapterNumberStore === 114 && disabledElement} inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-200 dark:hover:bg-gray-800 group">
        <ChevronRight />
        <span class="sr-only">Next Chapter</span>
      </Link>
    </div>
  </div>
</div>
