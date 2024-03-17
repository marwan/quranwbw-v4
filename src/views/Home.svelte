<script>
  import { Link } from "svelte-routing";
  import { websiteTagline, websiteTitle } from "$utils/websiteSettings";
  import { currentPageStore, lastReadStore } from "$utils/stores";
  import Logo from "$svgs/Logo.svelte";

  import HomepageTabs from "$ui/HomepageTabs.svelte";

  const linkStyles = "py-2 px-2 text-xs cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg hover:bg-[#ebebeb] dark:hover:bg-slate-700";

  currentPageStore.set("home");
</script>

<svelte:head>
  <title>{websiteTitle}</title>
</svelte:head>

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4 grayscale">
  <div class="flex flex-col mt-4">
    <Link to="/" class="flex justify-center text-gray-500">
      <Logo width="52" />
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

  <!-- chapter and most read tabs -->
  <HomepageTabs />
</div>
