<script>
  import { Link } from "svelte-routing";
  import { websiteTitle } from "../utils/websiteSettings";
  import { quranMetaData } from "../utils/quranMeta";
  import { currentPageStore } from "../utils/stores";

  currentPageStore.set("home");
</script>

<svelte:head>
  <title>{websiteTitle}</title>
</svelte:head>

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4">
  <div id="most-read" class="text-center text-sm md:text-md">
    Most Read:
    <Link to="/2/255">2:255</Link>,
    <Link to="/2/285-286">2:285-286</Link>,
    <Link to="/18/10">18:10</Link>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each { length: 114 } as _, chapter}
      <Link to="/{chapter + 1}" class="flex items-center justify-between border border-gray-200 text-sm bg-gray-50 rounded-lg p-4 hover:cursor-pointer hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200">
        <div class="">
          <span class="text-sm">{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</span>
          <div class="block text-xs text-gray-400">
            {quranMetaData[chapter + 1].translation} <br />
            {quranMetaData[chapter + 1].verses} Verses &bull; {quranMetaData[chapter + 1].revelation === 1 ? "Meccan" : "Medinan"}
          </div>
        </div>
        <!-- <div class="chapter-icons justify-items-end text-gray-400 text-4xl"></div> -->
      </Link>
    {/each}
  </div>
</div>
