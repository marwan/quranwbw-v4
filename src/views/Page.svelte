<script>
  export let page;

  import PageMeta from "$components/PageMeta.svelte";
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { __chapterNumber, __pageNumber, __currentPage, __wordType, __tajweedEnabled } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";
  import { quranMetaData, chapterHeaderCodes, bismillahTypes } from "$data/quranMeta";

  let fetchData;
  let startingLine, endingLine;
  let chapters = [],
    verses = [],
    lines = [];

  // font, header, bismillah sizes
  const mushafSizes = {
    // small screens
    1: {
      header: "29vw",
      bismillah: "5vw",
      words: "5vw",
    },

    // medium screens
    2: {
      // header: "23vw",
      header: "220px",
      bismillah: "32px",
      words: "32px",
    },

    // large screens
    3: {
      header: "230px",
      bismillah: "36px",
      words: "36px",
    },
  };

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
          for (let verse = 1; verse <= quranMetaData[chapters[chapter]].verses; verse++) {
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

    // set the page number
    __pageNumber.set(+page);
  }

  // only allow continious normal mode
  updateSettings({ type: "displayType", value: 4 });

  __currentPage.set("page");
</script>

<PageMeta title={`Page ${page}`} />

<div class="text-center mt-2 md:mt-6 text-xl">
  {#await fetchData}
    <Spinner />
  {:then}
    <div class="space-y-2">
      <div class="max-w-3xl space-y-2 pb-2 mx-auto text-[{mushafSizes[1].words}] md:text-[{mushafSizes[2].words}] lg:text-[{mushafSizes[3].words}]">
        {#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
          <!-- if it's the first verse of a chapter -->
          {#if chapters.length > 0 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
            <div class="flex flex-col my-2">
              <div class="chapter-header leading-base pt-4 md:pt-8 pb-6 text-[{mushafSizes[1].header}] md:text-[{mushafSizes[2].header}] lg:text-[{mushafSizes[3].header}] {$__tajweedEnabled === true ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">{chapterHeaderCodes[chapters[lines.indexOf(line)]]}</div>

              <div class="bismillah flex flex-col text-center leading-normal flex-wrap space-y-4 block md:mt-6 text-[{mushafSizes[1].bismillah}] md:text-[{mushafSizes[2].bismillah}] lg:text-[{mushafSizes[3].bismillah}] {$__tajweedEnabled === true ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">
                {#if chapters[lines.indexOf(line)] === 2}
                  {bismillahTypes[1]}
                {:else if ![1, 9, 2].includes(chapters[lines.indexOf(line)])}
                  {bismillahTypes[2]}
                {/if}
              </div>
            </div>
          {/if}

          <div class="line {line} px-2 arabic-font-{$__wordType} {+page > 2 && centeredPageLines[+page] === undefined ? 'flex justify-between' : ''} {centeredPageLines[+page] !== undefined && centeredPageLines[+page].includes(line) ? 'flex justify-center' : ''}">
            {#each Object.entries(JSON.parse(localStorage.getItem("pageData"))) as [key, value]}
              <VersesWords {key} {value} {line} />
            {/each}
          </div>
        {/each}
      </div>

      <!-- page number -->
      <div class="max-w-3xl mx-auto justify-center text-sm">
        <div class="flex items-center">
          <div class="flex-1 border-t-2 border-gray-200"></div>
          <span class="px-3">{page}</span>
          <div class="flex-1 border-t-2 border-gray-200"></div>
        </div>
      </div>
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>

<!-- <div class="flex flex-row space-x-8 my-8 justify-center">
  <Link to="/page/{+page - 1}" class="{tabPillElement} {+page === 1 && disabledElement}">{@html "&#x2190;"} Previous Page</Link>
  <Link to="/page/{+page + 1}" class="{tabPillElement} {+page === 604 && disabledElement}">Next Page {@html "&#x2192;"}</Link>
</div> -->

<!-- loading extra fonts -->
<div class="p{+page - 1} invisible text-[0px]">.</div>
<div class="p{+page + 1} invisible text-[0px]">.</div>
