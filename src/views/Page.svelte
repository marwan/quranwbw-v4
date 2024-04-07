<script>
  export let page;

  import { Link } from "svelte-routing";
  import PageMeta from "$components/PageMeta.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { __chapterNumber, __currentPage, __wordType } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";
  import { quranMetaData, chapterHeaderCodes } from "$data/quranMeta";
  import { tabPillElement, disabledElement } from "$utils/commonStyles";
  import BismillahMushaf from "$svgs/BismillahMushaf.svelte";

  updateSettings({ type: "displayType", value: 4 });

  let fetchData;
  let startingLine, endingLine;
  let chapters = [],
    verses = [],
    lines = [];

  // pages and the lines for which we need to center the verse rathen than justify
  const centeredPageLines = {
    602: [5, 15],
    603: [10, 15],
    604: [4, 9, 14, 15],
  };

  $: {
    // empty all the arrays
    (chapters = []), (verses = []), (lines = []);

    fetchData = (async () => {
      // const apiHost = "http://localhost:7500";
      const apiHost = "https://api.quranwbw.com";
      const apiURL = `${apiHost}/v1/page?page=${page}&word_type=${$__wordType}&word_translation=1`;
      const response = await fetch(apiURL);
      const data = await response.json();
      const apiData = data.data.verses;
      localStorage.setItem("pageData", JSON.stringify(apiData));

      // !!!!!!!!!!!!!!!!!!!!!!!!!!!
      // page 27: does not load because last verse icon is null
      // page 36, 77: last word of first line is overflowing

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
      if (chapters.length > 0) {
        for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
          const chapterTotalVerses = quranMetaData[chapters[chapter]].verses;
          for (let verse = 1; verse <= chapterTotalVerses; verse++) {
            if (apiData[`${chapters[chapter]}:${verse}`] !== undefined) {
              verses.push(verse);
              break;
            }
          }
        }
      }

      // get line numbers for chapters
      if (chapters.length > 0) {
        for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
          lines.push(+apiData[`${chapters[chapter]}:${verses[chapter]}`].words.line.split("|")[0]);
        }
      }

      return apiData;
    })();

    console.table({ chapters, verses, lines });
  }

  __currentPage.set("page");
</script>

<PageMeta title={`Page ${page}`} />

<div class="flex flex-row space-x-8 my-8 justify-center">
  <Link to="/page/{+page - 1}" class="{tabPillElement} {+page === 1 && disabledElement}">{@html "&#x2190;"} Previous Page</Link>
  <Link to="/page/{+page + 1}" class="{tabPillElement} {+page === 604 && disabledElement}">Next Page {@html "&#x2192;"}</Link>
</div>

<div class="text-center mt-8 text-xl">
  {#await fetchData}
    <Spinner />
  {:then}
    <div class="max-w-3xl space-y-2 pb-2 mx-auto">
      {#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
        <!-- if it's the first verse of a chapter -->
        {#if chapters.length > 0 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
          <div class="flex flex-col my-2">
            <div class="chapter-header text-8xl md:text-9xl">{chapterHeaderCodes[chapters[lines.indexOf(line)]]}</div>

            {#if ![1, 9].includes(chapters[lines.indexOf(line)])}
              <div id="bismillah" class="flex justify-center">
                <div class="w-36 md:w-52 h-11"><BismillahMushaf /></div>
              </div>
            {/if}
          </div>
        {/if}

        <div class="line {line} px-2 arabic-font-{$__wordType} {+page > 2 && centeredPageLines[+page] === undefined ? 'flex justify-between' : ''} {centeredPageLines[+page] !== undefined && centeredPageLines[+page].includes(line) ? 'flex justify-center' : ''}">
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

<style>
  /* @font-face {
    font-family: "chapter-headers";
    src:
      url("../fonts/QCF_SurahHeader_COLOR-Regular.woff2") format("woff2"),
      url("../fonts/QCF_SurahHeader_COLOR-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  .chapter-header {
    font-family: "chapter-headers";
  } */
</style>
