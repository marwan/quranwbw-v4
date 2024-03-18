<script>
  export let page;

  import { Link } from "svelte-routing";
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteTitle } from "$utils/websiteSettings";
  import { currentPageStore, wordTypeStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";
  import { quranMetaData } from "$data/quranMeta";

  updateSettings({ type: "displayType", value: 4 });

  let fetchData;
  let startingLine, endingLine;
  let chapters = [],
    verses = [],
    lines = [];

  $: {
    // empty all the arrays
    (chapters = []), (verses = []), (lines = []);

    fetchData = (async () => {
      // const apiHost = "http://localhost:7500";
      const apiHost = "https://api.quranwbw.com";
      const apiURL = `${apiHost}/v1/page?page=${page}&word_type=${$wordTypeStore}&word_translation=1`;
      const response = await fetch(apiURL);
      const data = await response.json();
      const apiData = data.data.verses;
      localStorage.setItem("pageData", JSON.stringify(apiData));

      startingLine = apiData[Object.keys(apiData)[0]].words.line.split("|")[0];
      endingLine = apiData[Object.keys(apiData)[Object.keys(apiData).length - 1]].words.end_line;

      // get chapter numbers
      for (const [key, value] of Object.entries(apiData)) {
        const chapter = +key.split(":")[0];
        if (chapters.indexOf(chapter) === -1) {
          chapters.push(chapter);
        }
      }

      // get first verse of each chapters
      if (chapters.length > 1) {
        for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
          const chapterTotalVerses = quranMetaData[chapters[chapter]].verses;
          for (let verse = 1; verse <= chapterTotalVerses; verse++) {
            let thisVerse = apiData[`${chapters[chapter]}:${verse}`];
            if (thisVerse !== undefined) {
              verses.push(verse);
              break;
            }
          }
        }
      }

      // get line numbers for chapters
      if (chapters.length > 1) {
        for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
          lines.push(+apiData[`${chapters[chapter]}:${verses[chapter]}`].words.line.split("|")[0]);
        }
      }

      return apiData;
    })();
  }

  currentPageStore.set("page");
</script>

<svelte:head>
  <title>Page {page} - {websiteTitle}</title>
</svelte:head>

<div class="flex flex-row space-x-8 my-8 justify-center">
  <Link to="/page/{+page - 1}">Previous Page</Link>
  <Link to="/page/{+page + 1}">Next Page</Link>
</div>

<div class="text-center mt-8 text-xl">
  {#await fetchData}
    <Spinner />
  {:then}
    <div style="max-width: 80%;" class="mx-auto">
      {#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
        <!-- if it's the first verse of a chapter -->
        {#if chapters.length > 1 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
          <div class="mt-8 mb-4">Chapter {chapters[lines.indexOf(line)]}</div>
        {/if}

        <div class="line {line} arabic-font-{$wordTypeStore} {+page > 2 ? 'flex justify-between' : ''}">
          {#each Object.entries(JSON.parse(localStorage.getItem("pageData"))) as [key, value]}
            <VersesWords {key} {value} {line} />
          {/each}
        </div>
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
