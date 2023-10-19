<!-- component to load verses from a SINGLE chapter, unlike supplications and bookmarks which are random -->
<script>
  export let startVerse, endVerse;

  import WBWDisplay from "./DisplayTypes/WBWDisplay.svelte";
  import NormalDisplay from "./DisplayTypes/NormalDisplay.svelte";
  import ContinuousNormalDisplay from "./DisplayTypes/ContinuousNormalDisplay.svelte";
  import SideBySideDisplay from "./DisplayTypes/SideBySideDisplay.svelte";

  import { quranMetaData } from "../../lib/quranMeta";
  import { displayTypeStore, chapterNumberStore, chapterDataStore } from "../../lib/stores";

  const displayComponents = [
    { displayType: 0, displayComponent: WBWDisplay, displayStyle: "" },
    { displayType: 1, displayComponent: NormalDisplay, displayStyle: "" },
    { displayType: 2, displayComponent: ContinuousNormalDisplay, displayStyle: "text-align: center; direction: rtl;" },
    { displayType: 3, displayComponent: SideBySideDisplay, displayStyle: "" },
  ];

  const chapterTotalVerses = quranMetaData[$chapterNumberStore].verses;

  let DisplayChapterVerses; // for the "DisplayChapterVerses" component

  let props = {},
    start,
    end;

  // function to load the next set of verses
  function loadNextVerses() {
    // importing the same component to be re-used when the "Load Next Verses" button is pressed
    import("./DisplayChapterVerses.svelte").then((res) => (DisplayChapterVerses = res.default));

    // get the last verse number from last prop value
    const lastVerseOnPage = endVerse;

    // remove the existing button
    document.getElementById("loadNextVersesButton").remove();

    // define the new starting and ending range
    (start = lastVerseOnPage + 1), (end = start + 10);

    // if the end verse set above is greater than total verses, then set it as total verses
    if (end > chapterTotalVerses) end = chapterTotalVerses;

    // setting the props
    props = {
      startVerse: start,
      endVerse: end,
    };
  }
</script>

<div style={displayComponents[$displayTypeStore].displayStyle}>
  {#each Array.from(Array(endVerse + 1).keys()).slice(startVerse) as verse}
    <svelte:component this={displayComponents[$displayTypeStore].displayComponent} key={`${$chapterNumberStore}:${verse}`} value={$chapterDataStore[`${$chapterNumberStore}:${verse}`]} />
  {/each}
</div>

<!-- only show the button when the last verse on page is less than total verses in chapter -->
{#if endVerse < chapterTotalVerses}
  <div id="loadNextVersesButton" class="flex justify-center pt-6 pb-14">
    <button on:click={loadNextVerses} class="font-bold py-2 px-4 rounded-md"> Load Next Verses </button>
  </div>
{/if}

<svelte:component this={DisplayChapterVerses} {...props} />
