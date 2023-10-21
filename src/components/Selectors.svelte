<script>
  import { Link } from "svelte-routing";
  import { currentPageStore, chapterNumberStore, wordTypeStore, displayTypeStore, verseTranslationsStore, pageURLStore } from "../utils/stores";
  import { quranMetaData } from "../utils/quranMeta";
  import { displayOptions, selectableVerseTranslations } from "../utils/options";
  import { updateSettings } from "../utils/updateSettings";

  // manually toggling dropdowns with Svelte because for some reason Flowbite JS isn't working, will figure it out later
  let isChaptersDropdownVisible = false;
  let isVersesDropdownVisible = false;
  let isVerseTranslationsDropdownVisible = false;

  const buttonCSS = "text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800";
</script>

<div class="flex flex-col justify-between py-8 space-y-4">
  <div class="flex flex-row space-x-2 {$currentPageStore === 'chapter' ? 'block' : 'hidden'}">
    <!-- chapters selector -->
    <div>
      <button on:click={() => (isChaptersDropdownVisible = !isChaptersDropdownVisible)} id="chaptersDropdownButton" class={buttonCSS} type="button"
        >{$chapterNumberStore}. {quranMetaData[$chapterNumberStore].transliteration}
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="chaptersDropdown" class="{isChaptersDropdownVisible === true ? 'block' : 'hidden'} z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 overflow-y-scroll max-h-80 daark:text-gray-200" aria-labelledby="chaptersDropdownButton">
          {#each { length: 114 } as _, chapter}
            <li>
              <Link to="/{chapter + 1}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</Link>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- verses selector -->
    <div>
      <button on:click={() => (isVersesDropdownVisible = !isVersesDropdownVisible)} id="versesDropdownButton" data-dropdown-toggle="versesDropdown" class={buttonCSS} type="button"
        >Verses
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="versesDropdown" class="{isVersesDropdownVisible === true ? 'block' : 'hidden'} z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 overflow-y-scroll max-h-80 daark:text-gray-200" aria-labelledby="versesDropdownButton">
          <li>
            <Link to="/{$chapterNumberStore}" on:click={() => pageURLStore.set(Math.random())} class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">All Verses</Link>
          </li>
          {#each { length: quranMetaData[$chapterNumberStore].verses } as _, verse}
            <li>
              <Link to="/{$chapterNumberStore}/{verse + 1}" on:click={() => pageURLStore.set(Math.random())} class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">Verse {verse + 1}</Link>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <div class="flex flex-row space-x-2">
    <!-- verse translation selector -->
    <div>
      <button id="verseTranslationsDropdownButton" on:click={() => (isVerseTranslationsDropdownVisible = !isVerseTranslationsDropdownVisible)} data-dropdown-toggle="verseTranslationsDropdown" class={buttonCSS} type="button"
        >Verse Translations <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="verseTranslationsDropdown" class="{isVerseTranslationsDropdownVisible === true ? 'block' : 'hidden'} absolute z-10 w-56 max-h-64 bg-white divide-y divide-gray-100 rounded-lg shadow daark:bg-gray-700 daark:divide-gray-600 overflow-y-scroll">
        <ul class="p-3 space-y-3 text-sm text-gray-700 daark:text-gray-200" aria-labelledby="verseTranslationsDropdownButton">
          {#each Object.values(selectableVerseTranslations) as translation}
            <li>
              <div class="flex items-center">
                <!-- using else-if block to add the "checked" attribute because for some reason the inline check is not working in Svelte as compared to regular javascript -->
                {#if $verseTranslationsStore.includes(translation.id)}
                  <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings("verseTranslation", translation.id)} checked type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 daark:focus:ring-blue-600 daark:ring-offset-gray-700 daark:focus:ring-offset-gray-700 focus:ring-2 daark:bg-gray-600 daark:border-gray-500" />
                {:else}
                  <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings("verseTranslation", translation.id)} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 daark:focus:ring-blue-600 daark:ring-offset-gray-700 daark:focus:ring-offset-gray-700 focus:ring-2 daark:bg-gray-600 daark:border-gray-500" />
                {/if}
                <label for="verseTranslationCheckbox-{translation.id}" class="ml-2 text-sm font-medium text-gray-900 daark:text-gray-300">{translation.author}</label>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <div class="flex flex-row space-x-2">
    <!-- word type selector -->
    <select on:change={(event) => updateSettings("wordType", Number(event.target.value))} bind:value={$wordTypeStore} class={buttonCSS}>
      <option value={1} class="bg-black text-white">Uthmani</option>
      <option value={2} class="bg-black text-white">IndoPak</option>
    </select>

    <!-- display type selector -->
    <select bind:value={$displayTypeStore} on:change={(event) => updateSettings("displayType", Number(event.target.selectedIndex) + 1)} class={buttonCSS}>
      {#each displayOptions as displayOption}
        {#if displayOption.displayType > 0}
          <option value={displayOption.displayType}>{displayOption.displayName}</option>
        {/if}
      {/each}
    </select>
  </div>
</div>
