<script>
  import { Link } from "svelte-routing";
  import { quranMetaData } from "../lib/quranMeta";
  import { currentPageStore } from "../lib/stores";

  currentPageStore.set("home");
</script>

<svelte:head>
  <title>QuranWBW.com</title>
</svelte:head>

<div class=" flex flex-col space-y-8">
  <div id="most-read" class="text-sm md:text-md">
    Most Read:
    <Link to="/2/255">2:255</Link>,
    <Link to="/2/285-286">2:285-286</Link>,
    <Link to="/18/10">18:10</Link>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-md text-left">
    {#each { length: 114 } as _, i}
      <Link to="/{i + 1}" class="px-2 border border-gray-200 hover:border-gray-600">{i + 1}. {quranMetaData[i + 1].transliteration}</Link>
    {/each}
  </div>
</div>
