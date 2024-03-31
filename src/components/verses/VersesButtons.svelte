<script>
  export let key;

  const chapter = +key.split(":")[0];
  const verse = +key.split(":")[1];

  import { Link } from "svelte-routing";
  import { showAudioModal } from "$utils/audioController";
  import { __currentPage, __userSettings, __audioSettings } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";
  import { downloadVerseImage } from "$utils/downloadVerseImage";

  // icons
  import Bookmark from "$svgs/Bookmark.svelte";
  import Bookmarked from "$svgs/Bookmarked.svelte";
  import Play from "$svgs/Play.svelte";
  import Pause from "$svgs/Pause.svelte";
  import DotsVertical from "$svgs/DotsVertical.svelte";

  // update userBookmarks whenever the __userSettings changes
  $: userBookmarks = JSON.parse($__userSettings).userBookmarks;

  const buttonClasses = "inline-flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-150 rounded-lg focus:shadow-outline bg-[#ebebeb] hover:bg-gray-200 print:hidden dark:bg-slate-800 dark:hover:bg-slate-700";

  let verseDropdownVisible = false;

  // hide all other dropdown and show the current one
  function verseDropdownToggle() {
    document.querySelectorAll(".verse-dropdown").forEach((element) => {
      element.classList.remove("block");
      element.classList.add("hidden");
    });

    verseDropdownVisible = !verseDropdownVisible;
  }
</script>

<div class="verseButtons flex flex-row space-x-4 text-gray-400 text-xs grayscale">
  <Link to={$__currentPage === "chapter" ? "./#" : `/${chapter}/${verse}`} class={buttonClasses}>{key}</Link>

  <button on:click={() => updateSettings({ type: "userBookmarks", key })} class={buttonClasses}>
    <svelte:component this={userBookmarks.includes(key) ? Bookmarked : Bookmark} />
  </button>
  <button on:click={() => showAudioModal(key)} class={buttonClasses}>
    <svelte:component this={$__audioSettings.isPlaying === true && $__audioSettings.playingKey === key ? Pause : Play} />
  </button>

  <!-- verses option dropdown -->
  <!-- <div class="relative inline-block text-left" data-html2canvas-ignore>
    <button data-dropdown-toggle="dropdown" class={buttonClasses} on:click={() => verseDropdownToggle()}>
      <DotsVertical />
    </button>

    <div class="{verseDropdownVisible === true ? 'block' : 'hidden'} verse-dropdown absolute right-0 z-10 mt-2 min-w-max origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <div class="py-2 space-y-4">
        <ul class=" text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
            <Link to="/morphology/{chapter}:{verse}" class="block px-4 py-2 hover:bg-gray-100">Verse Morphology</Link>
          </li>
          <li>
            <button on:click={() => downloadVerseImage(key)} class="block px-4 py-2 hover:bg-gray-100 w-full text-left"> Verse Screenshot </button>
          </li>
        </ul>
      </div>
    </div>
  </div> -->
</div>
