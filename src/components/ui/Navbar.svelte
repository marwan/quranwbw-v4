<script>
  import { Link } from "svelte-routing";
  import { quranMetaData, pageNumberKeys } from "$data/quranMeta";
  import { chapterNumberStore, currentPageStore, lastReadStore, pageURLStore, topNavbarVisibleStore } from "$utils/stores";
  import { toggleModal } from "$utils/toggleModal";
  import { disabledElement, buttonElement } from "$utils/commonStyles";

  // icons
  import Logo from "$svgs/Logo.svelte";
  import Menu from "$svgs/Menu.svelte";
  import Home from "$svgs/Home.svelte";

  // classes
  const rightMenuDropdownClasses = "block w-full text-left px-4 py-2 hover:bg-[#ebebeb] dark:hover:bg-slate-700";

  let gotoVerse,
    gotoPageChapter = 1,
    gotoPageVerse = 1;

  function verseSelector(event) {
    gotoVerse = event.target.valueAsNumber;
    // todo:
    // 1. if verse is less than 1, or more than max verses, set default
    // 2. bind input to gotoVerse
    // 3. disable "Go" button when input is empty
  }

  function pageSelector(event) {
    const pageKey = pageNumberKeys[event.target.valueAsNumber - 1].split(":");
    (gotoPageChapter = +pageKey[0]), (gotoPageVerse = +pageKey[1]);
  }

  // updating the page, juz... when the last read location updates
  let lastReadPage, lastReadJuz;

  $: {
    // window.HSStaticMethods.autoInit();

    try {
      lastReadPage = document.getElementById($lastReadStore).getAttribute("data-page");
      lastReadJuz = document.getElementById($lastReadStore).getAttribute("data-juz");
    } catch (error) {}
  }

  // revelation
  $: chapterRevelation = quranMetaData[$chapterNumberStore].revelation;

  // scroll percentage
  $: chapterProgress = ($lastReadStore.split(":")[1] / quranMetaData[$chapterNumberStore].verses) * 100;

  let navbarChapterName;

  $: {
    navbarChapterName = quranMetaData[$chapterNumberStore].transliteration;

    // chapters for which the Arabic and English names are same, the navbar should only show one
    if (quranMetaData[$chapterNumberStore].transliteration !== quranMetaData[$chapterNumberStore].translation) {
      navbarChapterName += ` (${quranMetaData[$chapterNumberStore].translation})`;
    }
  }
</script>

<nav id="navbar" class="{$currentPageStore === 'home' ? 'hidden' : 'block'} bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200 text-black backdrop-filter backdrop-blur-lg bg-opacity-50 print:hidden dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 grayscale">
  <div id="top-nav" class="{$topNavbarVisibleStore === true ? 'block' : 'hidden'} flex flex-row items-center justify-between max-w-screen-lg mx-auto px-4 py-2">
    <Link to="/" class="flex flex-row items-center p-2 cursor-pointer hover:bg-[#ebebeb] rounded-lg dark:hover:bg-slate-700">
      <Home />
      <span class="text-xs pl-2 hidden sm:block">Home</span>
    </Link>

    <button id="navigationDropdownButton" data-dropdown-toggle="navigationDropdown" class="flex items-center py-2 px-3 text-sm border-gray-200 w-auto p-2 hover:bg-[#ebebeb] rounded-lg dark:hover:bg-slate-700">
      <span id="navbar-top-title">
        {#if $currentPageStore === "chapter"}
          {navbarChapterName}
        {:else}
          <!-- capitalize the first letter of the current page and display it -->
          {$currentPageStore[0].toUpperCase() + $currentPageStore.slice(1)}
        {/if}
      </span>
      <svg class="w-2.5 h-2.5 ml-2.5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" /></svg>
    </button>

    <div class="flex flex-row items-center p-2 cursor-pointer hover:bg-[#ebebeb] rounded-lg dark:hover:bg-slate-700" type="button" id="rightMenuDropdownButton" data-dropdown-toggle="rightMenuDropdown">
      <span class="text-xs pr-2 hidden sm:block">Menu</span>
      <Menu />
    </div>
  </div>

  {#if $currentPageStore === "chapter"}
    <div id="bottom-nav" class="flex flex-row items-center justify-between border-t text-xs max-w-screen-lg mx-auto px-6 dark:border-slate-700">
      <div id="navbar-bottom-chapter-revalation" class="flex flex-row items-center py-2">
        {#if $topNavbarVisibleStore === false}
          <span>{navbarChapterName}</span>
        {:else}
          <span>{chapterRevelation === 1 ? "Meccan" : "Medinan"}</span>
        {/if}
      </div>
      <!-- <div id="navbar-bottom-chapter-title" class="flex flex-row items-center py-2">{quranMetaData[$chapterNumberStore].transliteration}</div> -->
      <div class="flex flex-row items-center py-2">
        <span>{lastReadPage !== undefined ? `Page ${lastReadPage}` : "..."}</span>
        <span class="px-1 opacity-60">/</span>
        <span>{lastReadJuz !== undefined ? `Juz ${lastReadJuz}` : "..."}</span>
      </div>
    </div>

    <div id="chapter-progress-bar" class="fixed inset-x-0 z-20 h-1 bg-gray-300 transition-width transition-slowest ease dark:bg-slate-700" style="width: {chapterProgress}%" />
  {/if}

  <!-- navigation list -->
  <div id="navigationDropdown" class="navbar-dropdown z-30 mt-1 border border-gray-200 rounded-lg shadow-sm bg-white border-y shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-95 hidden dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
    <div class="flex flex-row space-x-4 justify-between max-h-80 max-w-screen-lg px-4 py-5 mx-auto text-gray-900 dark:text-slate-400 md:px-2">
      <!-- chapter selector -->
      <div class="flex flex-col space-y-2">
        <div class="mx-4 text-xs pb-2 border-b dark:border-slate-700">Chapters</div>
        <ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll md:min-w-fit">
          {#each { length: 114 } as _, chapter}
            <li>
              <button on:click={() => toggleModal("navigationDropdown", "hide")} class="w-full text-left">
                <Link to="/{chapter + 1}" class="block p-3 rounded-lg hover:bg-[#ebebeb] dark:hover:bg-slate-700 {$chapterNumberStore === chapter + 1 && 'bg-[#ebebeb] dark:bg-slate-700'}">
                  <span class="text-sm text-gray-500 dark:text-slate-400">
                    {chapter + 1}. {quranMetaData[chapter + 1].transliteration}
                    <span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
                  </span>
                </Link>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- verses selector -->
      {#if $currentPageStore === "chapter"}
        <div class="flex flex-col space-y-6">
          <!-- goto verse -->
          <div class="flex flex-col space-y-2">
            <div class="text-xs pb-2 border-b dark:border-slate-700">Go to Verse</div>
            <div class="flex flex-row space-x-2">
              <input type="number" min="1" max={quranMetaData[$chapterNumberStore].verses} id="gotoVerse" on:change={(event) => verseSelector(event)} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g. {Math.floor(Math.random() * (quranMetaData[$chapterNumberStore].verses - 1 + 1)) + 1}" />
              <button on:click={() => toggleModal("navigationDropdown", "hide")}>
                <Link to="/{$chapterNumberStore}/{gotoVerse}" on:click={() => pageURLStore.set(Math.random())} class={buttonElement}>Go</Link>
              </button>
            </div>
          </div>
          <!-- goto page -->
          <div class="flex flex-col space-y-2">
            <div class="text-xs pb-2 border-b dark:border-slate-700">Go to Page</div>
            <div class="flex flex-row space-x-2">
              <input type="number" min="1" max="604" id="gotoPage" on:change={(event) => pageSelector(event)} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g. {Math.floor(Math.random() * 604) + 1}" />
              <button on:click={() => toggleModal("navigationDropdown", "hide")}>
                <Link to="/{gotoPageChapter}/{gotoPageVerse}" on:click={() => pageURLStore.set(Math.random())} class={buttonElement}>Go</Link>
              </button>
            </div>
            <div class="flex flex-col text-xs opacity-50">{quranMetaData[gotoPageChapter].transliteration}, {gotoPageChapter}:{gotoPageVerse}</div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Dropdown menu -->
  <div id="rightMenuDropdown" class="navbar-dropdown z-30 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-slate-800 dark:border-slate-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-slate-400" aria-labelledby="rightMenuDropdownButton">
      <li class={$currentPageStore === "changelogs" || $currentPageStore === "issues" || $currentPageStore === "about" || $currentPageStore === "search" ? disabledElement : ""}>
        <button data-drawer-target="settings-drawer" data-drawer-show="settings-drawer" data-drawer-placement="right" aria-controls="settings-drawer" class={rightMenuDropdownClasses}>Settings</button>
      </li>
      <li>
        <Link to="/about">
          <button class={rightMenuDropdownClasses}>About</button>
        </Link>
      </li>
      <li>
        <Link to="/changelogs">
          <button class={rightMenuDropdownClasses}>Changelogs</button>
        </Link>
      </li>
      <li>
        <Link to="/issues">
          <button class={rightMenuDropdownClasses}>Issues</button>
        </Link>
      </li>
      <li class={disabledElement}>
        <button class={rightMenuDropdownClasses}>Chapter Overview</button>
      </li>
      <li class={$currentPageStore === "changelogs" || $currentPageStore === "issues" || $currentPageStore === "about" || $currentPageStore === "search" ? disabledElement : ""}>
        <button on:click={() => toggleModal("InitialSetupModal", "show")} class={rightMenuDropdownClasses}>Initial Setup</button>
      </li>
    </ul>
  </div>
</nav>
