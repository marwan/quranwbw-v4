<script>
  export let page;

  import PageMeta from "$components/PageMeta.svelte";
  import { Link } from "svelte-routing";
  import VersesWords from "$verses/VersesWords.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { currentPageStore, wordTypeStore } from "$utils/stores";
  import { updateSettings } from "$utils/updateSettings";
  import { quranMetaData } from "$data/quranMeta";
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
      const apiURL = `${apiHost}/v1/page?page=${page}&word_type=${$wordTypeStore}&word_translation=1`;
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
      if (chapters.length > 1) {
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
      if (chapters.length > 1) {
        for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
          lines.push(+apiData[`${chapters[chapter]}:${verses[chapter]}`].words.line.split("|")[0]);
        }
      }

      return apiData;
    })();

    console.log(centeredPageLines[+page]);
  }

  currentPageStore.set("page");
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
        {#if chapters.length > 1 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
          <div class="flex flex-col space-y-8 my-8">
            <img class="" src="https://cdn.quranonline.net/wp-content/plugins/quran-learning-app/public/app/assets/images/surah-name-background.png" alt="surah name background" />
            <div class="chapter-icons text-4xl" style="margin-top: -44px;">{@html `&#xE9${quranMetaData[chapters[lines.indexOf(line)]].icon};`} {@html `&#xE903;`}</div>
            <div class="flex justify-center">
              <div class="w-36 md:w-52 h-11"><BismillahMushaf /></div>
            </div>
          </div>
        {/if}

        <div class="line {line} px-2 arabic-font-{$wordTypeStore} {+page > 2 && centeredPageLines[+page] === undefined ? 'flex justify-between' : ''} {centeredPageLines[+page] !== undefined && centeredPageLines[+page].includes(line) ? 'flex justify-center' : ''}">
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
