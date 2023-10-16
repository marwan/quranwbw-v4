<script>
  import { Link } from "svelte-routing";
  import { currentPageStore, chapterNumberStore, wordTypeStore, pageURLStore } from "../lib/stores";
  import { quranMetaData } from "../lib/quranMeta";

  // manually toggling dropdowns with Svelte because for some reason Flowbite JS isn't working, will figure it out later
  let chaptersDropdownVisible = false;
  let versesDropdownVisible = false;

  let buttonCSS = "text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800";
</script>

<div class="flex flex-col md:flex-row justify-between py-8">
  <div class="flex flex-row space-x-8 {$currentPageStore === 'chapter' ? 'block' : 'hidden'}">
    <!-- chapters selector -->
    <div>
      <button on:click={() => (chaptersDropdownVisible = !chaptersDropdownVisible)} id="chaptersDropdownButton" class={buttonCSS} type="button"
        >Chapter: {$chapterNumberStore}. {quranMetaData[$chapterNumberStore].transliteration}
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="chaptersDropdown" class="z-10 absolute {chaptersDropdownVisible === true ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 overflow-y-scroll max-h-80 daark:text-gray-200" aria-labelledby="chaptersDropdownButton">
          {#each { length: 114 } as _, i}
            <li>
              <Link to="/{i + 1}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">{i + 1}. {quranMetaData[i + 1].transliteration}</Link>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- verses selector -->
    <div>
      <button on:click={() => (versesDropdownVisible = !versesDropdownVisible)} id="versesDropdownButton" data-dropdown-toggle="versesDropdown" class={buttonCSS} type="button"
        >Verses
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="versesDropdown" class="z-10 absolute {versesDropdownVisible === true ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 overflow-y-scroll max-h-80 daark:text-gray-200" aria-labelledby="versesDropdownButton">
          <li>
            <Link to="/{$chapterNumberStore}" on:click={() => pageURLStore.set(Math.random())} class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">All Verses</Link>
          </li>
          {#each { length: quranMetaData[$chapterNumberStore].verses } as _, verse}
            <li>
              <!-- <a href="#{$chapterNumberStore}:{i + 1}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">Verse {i + 1}</a> -->
              <Link to="/{$chapterNumberStore}/{verse + 1}" on:click={() => pageURLStore.set(Math.random())} class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">Verse {verse + 1}</Link>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <div class="flex flex-row space-x-6">
    <select on:change={(event) => wordTypeStore.set(event.target.value)} bind:value={$wordTypeStore} class={buttonCSS}>
      <option value="1" class="bg-black text-white">Uthmani</option>
      <option value="2" class="bg-black text-white">IndoPak</option>
    </select>
  </div>
</div>
