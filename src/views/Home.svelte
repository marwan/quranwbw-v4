<script>
  import { Link } from "svelte-routing";
  import { websiteTagline, websiteTitle } from "$utils/websiteSettings";
  import { quranMetaData } from "$data/quranMeta";
  import { currentPageStore, lastReadStore } from "$utils/stores";
  import Logo from "$svgs/Logo.svelte";

  const linkStyles = "py-2 px-4 text-xs cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg hover:bg-[#ebebeb]";

  currentPageStore.set("home");
</script>

<svelte:head>
  <title>{websiteTitle}</title>
</svelte:head>

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4">
  <div class="flex flex-col mt-4">
    <Link to="/" class="flex justify-center text-gray-500">
      <Logo />
    </Link>
    <div class="text-xs text-center text-gray-400">{websiteTagline}</div>
  </div>

  <div class="flex flex-wrap flex-row md:flex-row mt-12 justify-center text-xs font-bold text-gray-400 space-x-2">
    <!-- last read link -->
    <div id="last-read-block" class="flex justify-center items-center block">
      <Link to="/{$lastReadStore.split(':')[0]}/{$lastReadStore.split(':')[1]}" id="last-read-link" class={linkStyles}>Last Read ({$lastReadStore})</Link>
    </div>

    <!-- Supplications from Quran link -->
    <div class="flex justify-center items-center block">
      <span class={linkStyles}>
        <Link to="/supplications">Supplications</Link>
      </span>
    </div>

    <!-- bookmarks link -->
    <div id="bookmarks-link" class="flex justify-center items-center block">
      <span class={linkStyles}>
        <Link to="/bookmarks">Bookmarks</Link>
      </span>
    </div>
  </div>

  <div id="most-read" class="text-center text-sm md:text-md">
    Most Read:
    <Link to="/2/255">2:255</Link>,
    <Link to="/2/285-286">2:285-286</Link>,
    <Link to="/18/10">18:10</Link>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each { length: 114 } as _, chapter}
      <Link to="/{chapter + 1}" class="flex items-center justify-between border border-gray-200 text-sm bg-gray-50 rounded-lg p-4 hover:cursor-pointer hover:bg-[#ebebeb] hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200">
        <div class="">
          <span class="text-sm">{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</span>
          <div class="block text-xs text-gray-400">
            {quranMetaData[chapter + 1].translation} <br />
            {quranMetaData[chapter + 1].verses} Verses &bull; {quranMetaData[chapter + 1].revelation === 1 ? "Meccan" : "Medinan"}
          </div>
        </div>
        <div class="chapter-icons justify-items-end text-gray-400 text-3xl mt-2">{@html `&#xE9${quranMetaData[chapter + 1].icon};`}</div>
      </Link>
    {/each}
  </div>
</div>
