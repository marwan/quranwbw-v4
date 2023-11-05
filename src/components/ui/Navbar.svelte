<script>
  import { Link } from "svelte-routing";
  import { quranMetaData } from "$data/quranMeta";
  import { chapterNumberStore, currentPageStore, pageURLStore, topNavbarVisibleStore, bottomNavbarVisibleStore } from "$utils/stores";
  import { toggleModal } from "$utils/toggleModal";

  // icons
  import Menu from "$svgs/Menu.svelte";
  import Home from "$svgs/Home.svelte";

  // classes
  const rightMenuDropdownClasses = "block w-full text-left px-4 py-2 hover:bg-gray-200 daaark:hover:bg-gray-600 daaark:hover:text-white";
</script>

<nav id="navbar" class="{$currentPageStore === 'home' ? 'hidden' : $topNavbarVisibleStore ? 'block' : 'hidden'} bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200 text-black backdrop-filter backdrop-blur-lg bg-opacity-50 print:hidden">
  <div id="top-nav" class="flex flex-row items-center justify-between max-w-screen-lg mx-auto px-4 py-2">
    <Link to="/" class="flex flex-row items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg">
      <Home />
      <span class="text-xs pl-2 hidden sm:block">Home</span>
    </Link>

    <button id="navigationDropdownButton" data-dropdown-toggle="navigationDropdown" class="flex items-center py-2 pl-3 pr-4 text-sm border-gray-200 w-auto p-2 hover:bg-gray-200 rounded-lg">
      <span id="navbar-top-title">
        {#if $currentPageStore === "chapter"}
          {quranMetaData[$chapterNumberStore].transliteration} ({quranMetaData[$chapterNumberStore].translation})
        {:else}
          <!-- capitalize the first letter of the current page and display it -->
          {$currentPageStore[0].toUpperCase() + $currentPageStore.slice(1)}
        {/if}
      </span>
      <svg class="w-2.5 h-2.5 ml-2.5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" /></svg>
    </button>

    <div class="flex flex-row items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg" type="button" id="rightMenuDropdownButton" data-dropdown-toggle="rightMenuDropdown">
      <span class="text-xs pr-2 hidden sm:block">Menu</span>
      <Menu />
    </div>
  </div>

  <div id="bottom-nav" class="{$bottomNavbarVisibleStore === true ? 'block' : 'hidden'} flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6">
    <div id="navbar-bottom-chapter-revalation" class="flex flex-row items-center py-2">...</div>
    <div id="navbar-bottom-chapter-title" class="hidden flex flex-row items-center py-2">{quranMetaData[$chapterNumberStore].transliteration}</div>
    <div class="flex flex-row items-center py-2">
      <span id="navbar-quran-divisions">..</span>
    </div>
  </div>

  <div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-gray-300 transition-width transition-slowest ease" style="width: 0%" />

  <!-- navigation list -->
  <div id="navigationDropdown" class="navbar-dropdown z-30 mt-1 border border-gray-200 rounded-lg shadow-sm bg-white border-y shadow-lg hidden">
    <div class="flex flex-row space-x-4 justify-between max-h-80 max-w-screen-lg px-4 py-5 mx-auto text-gray-900 daaark:text-white md:px-2">
      <!-- chapter selector -->
      <div class="flex">
        <ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll md:min-w-fit">
          {#each { length: 114 } as _, chapter}
            <li>
              <Link to="/{chapter + 1}" class="block p-3 rounded-lg hover:bg-gray-200">
                <span class="text-sm text-gray-500">{chapter + 1}. {quranMetaData[chapter + 1].transliteration} ({quranMetaData[chapter + 1].translation})</span>
              </Link>
            </li>
          {/each}
        </ul>
      </div>

      <!-- verses selector -->
      {#if $currentPageStore === "chapter"}
        <div class="flex flex-col space-y-4">
          <ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll md:min-w-fit">
            <li>
              <Link to="/{$chapterNumberStore}" on:click={() => pageURLStore.set(Math.random())} class="block p-3 rounded-lg hover:bg-gray-200 text-sm text-gray-500">All Verses</Link>
            </li>
            {#each { length: quranMetaData[$chapterNumberStore].verses } as _, verse}
              <li>
                <Link to="/{$chapterNumberStore}/{verse + 1}" on:click={() => pageURLStore.set(Math.random())} class="block p-3 rounded-lg hover:bg-gray-200 text-sm text-gray-500">Verse {verse + 1}</Link>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>

  <!-- Dropdown menu -->
  <div id="rightMenuDropdown" class="navbar-dropdown z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daaark:bg-gray-700 daaark:divide-gray-600">
    <ul class="py-2 text-sm text-gray-700 daaark:text-gray-200" aria-labelledby="rightMenuDropdownButton">
      <li>
        <button data-drawer-target="drawer-right" data-drawer-show="drawer-right" data-drawer-placement="right" aria-controls="drawer-right" class={rightMenuDropdownClasses}>Settings</button>
      </li>
      <li>
        <button class={rightMenuDropdownClasses}>Chapter Overview</button>
      </li>
      <li>
        <button on:click={() => toggleModal("InitialSetupModal", "show")} class={rightMenuDropdownClasses}>Initial Setup</button>
      </li>
    </ul>
  </div>
</nav>
