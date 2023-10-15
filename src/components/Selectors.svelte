<script>
  import { Link } from "svelte-routing";
  import { currentPage, chapterNumber, wordType } from "../lib/stores";
  import { quranMetaData } from "../lib/quranMeta";

  // manually toggling dropdowns with Svelte because for some reason Flowbite JS isn't working, will figure it out later
  let chaptersDropdownVisible = false;
  let versesDropdownVisible = false;
</script>

<div class="flex flex-col space-y-6 pt-8">
  <!-- <div class="flex flex-row space-x-6 justify-center">
    <button on:click={() => chapterNumber.update($chapterNumber === 1 ? 1 : $chapterNumber--)}> Previous Chapter </button>
    <button on:click={() => chapterNumber.update($chapterNumber === 114 ? 114 : $chapterNumber++)}> Next Chapter </button>
  </div> -->

  <div class="flex flex-row space-x-8 justify-center {$currentPage === 'chapter' ? 'block' : 'hidden'}">
    <!-- chapters selector -->
    <div>
      <button on:click={() => (chaptersDropdownVisible = !chaptersDropdownVisible)} id="chaptersDropdownButton" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800" type="button"
        >Chapter: {$chapterNumber}. {quranMetaData[$chapterNumber].transliteration}
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
      <button on:click={() => (versesDropdownVisible = !versesDropdownVisible)} id="versesDropdownButton" data-dropdown-toggle="versesDropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center daark:bg-blue-600 daark:hover:bg-blue-700 daark:focus:ring-blue-800" type="button"
        >Verses
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="versesDropdown" class="z-10 absolute {versesDropdownVisible === true ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 daark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 overflow-y-scroll max-h-80 daark:text-gray-200" aria-labelledby="versesDropdownButton">
          <li>
            <Link to="/{$chapterNumber}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">All Verses</Link>
          </li>
          {#each { length: quranMetaData[$chapterNumber].verses } as _, i}
            <li>
              <!-- <a href="#{$chapterNumber}:{i + 1}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">Verse {i + 1}</a> -->
              <Link to="/{$chapterNumber}/{i + 1}" class="block px-4 py-2 hover:bg-gray-100 daark:hover:bg-gray-600 daark:hover:text-white">Verse {i + 1}</Link>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <div class="flex flex-row space-x-6 justify-center">
    <select on:change={(event) => wordType.set(event.target.value)} bind:value={$wordType}>
      <option value="1" class="bg-black text-white">Uthmani</option>
      <option value="2" class="bg-black text-white">IndoPak</option>
    </select>
  </div>
</div>
