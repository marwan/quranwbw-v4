<script>
  import Selectors from "./Selectors.svelte";
  import DisplayVerses from "./DisplayVerses.svelte";
  import { currentPage, chapterNumber, wordType } from "../lib/stores";
  import { quranMetaData } from "../lib/quranMeta";

  // props from router
  export let chapter, startVerse, endVerse;

  let fetchData;

  // fetch verses whenever there's a change
  $: {
    // updating the reactive chapter number
    chapterNumber.set(chapter);

    let chapterTotalVerses = quranMetaData[$chapterNumber].verses;

    // if none were set, then start with verse 1 till end of chapter
    // we also do the same when both are SET (when switching chapters), to reset start and end verse
    // have to do this else when switching chapters, the startVerse and endVerse retains their old values
    // surely there's a better way of doing this but I haven't figured it out yet...
    if ((startVerse === undefined && endVerse === undefined) || (startVerse != undefined && endVerse != undefined)) {
      (startVerse = 1), (endVerse = chapterTotalVerses);
    }

    // if end verse was not set, then set it to same are start verse, that is, only display single verse
    if (endVerse === undefined) {
      endVerse = startVerse;
    }

    // if hyphen was set, that is, user wants a range of verses (eg: /2/285-286), then split and set the start and end verse
    try {
      if (startVerse != undefined && startVerse.includes("-")) {
        let split = startVerse.split("-");
        (startVerse = split[0]), (endVerse = split[1]);
      }
    } catch (error) {
      console.error(error);
    }

    // basic checks: making sure the user is asking for verses between 1 and max verses
    if (startVerse < 1) startVerse = 1;
    if (endVerse > chapterTotalVerses) endVerse = chapterTotalVerses;

    fetchData = (async () => {
      const api_url = `https://api.quranwbw.com/v1/verses?verses=${$chapterNumber}:${startVerse},${$chapterNumber}:${endVerse}&word_type=${$wordType}&verse_translation=1,15&between=true`;
      const response = await fetch(api_url);
      const data = await response.json();
      return data.data.verses;
    })();
  }

  currentPage.set("chapter");
</script>

<svelte:head>
  <title>{quranMetaData[$chapterNumber].transliteration} - QuranWBW.com</title>
</svelte:head>

<div class="">
  <Selectors />

  {#await fetchData}
    <div class="flex items-center justify-center pt-28">loading...</div>
  {:then chapterData}
    <div>
      {#each Object.entries(chapterData) as [key, value]}
        <DisplayVerses {key} {value} />
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
