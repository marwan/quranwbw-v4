<script>
  import { currentPageStore, wordTypeStore, displayTypeStore, websiteThemeStore, wordTranslationStore, wordTranslationEnabledStore, wordTransliterationEnabledStore, verseTranslationsStore, reciterStore, playbackSpeedStore, userSettingsStore } from "$utils/stores";
  import { displayOptions, selectableFontTypes, selectableThemes, selectableVerseTranslations, selectableWordTranslations, selectableReciters, selectablePlaybackSpeeds } from "$data/options";
  import { updateSettings } from "$utils/updateSettings";
  import { disabledElement, buttonElement } from "$utils/commonStyles";

  $: fontSizeCodes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
</script>

<!-- drawer component -->
<div id="drawer-right" class="fixed top-0 right-0 z-40 h-screen p-4 pb-16 overflow-y-auto transition-transform rounded-tl-xl rounded-bl-xl translate-x-full bg-white w-72 md:w-96 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label">
  <h5 id="drawer-right-label" class="inline-flex items-center mb-4 text-xl space-x-2 font-semibold text-gray-500 dark:text-gray-400">
    <span>Settings</span>
  </h5>

  <button type="button" data-drawer-hide="drawer-right" aria-controls="drawer-right" class="text-gray-400 bg-transparent hover:bg-[#ebebeb] hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
    </svg>
    <span class="sr-only">Close menu</span>
  </button>

  <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Change the website settings like the theme, display, translations or the audio settings.</p>

  <div class="flex flex-col justify-between items-center py-5 space-y-4 text-xs border-gray-200 dark:border-slate-700">
    <span class="block text-gray-900 dark:text-slate-400">Theme: {selectableThemes[$websiteThemeStore].name}</span>
    <div class="inline-flex rounded-md shadow-sm" role="group">
      {#each Array.from(Array(5 + 1).keys()).slice(1) as theme}
        <button type="button" on:click={() => updateSettings({ type: "websiteTheme", value: theme })} class="{$websiteThemeStore === theme && 'border-gray-900'} inline-flex items-center px-4 py-2 text-gray-900 bg-white border hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"> {theme} </button>
      {/each}
    </div>
  </div>

  <div class="py-5 text-xs border-t border-gray-200 dark:border-slate-700">
    <h3 class="block mb-2 font-medium text-base text-gray-500 dark:text-slate-400">Display</h3>

    <div class="flex flex-col flex-wrap space-y-4 text-xs">
      <div class="flex flex-row justify-between items-center">
        <label for="quran-font-list" class="block text-gray-900 dark:text-slate-400">Quran Font</label>
        <select id="quran-font-list" on:change={(event) => updateSettings({ type: "wordType", value: +event.target.value })} bind:value={$wordTypeStore} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {#each Object.entries(selectableFontTypes) as [id, font]}
            <option value={font.id}>{font.font}</option>
          {/each}
        </select>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select the Quranic font type depending on your region.</p>

      <div class="flex flex-row justify-between items-center">
        <label for="display-style-list" class="block text-gray-900 dark:text-slate-400">Display Type</label>
        <select id="display-style-list" bind:value={$displayTypeStore} on:change={(event) => updateSettings({ type: "displayType", value: +event.target.selectedIndex + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {#each Object.entries(displayOptions) as [id, displayOption]}
            <option disabled={$currentPageStore !== "chapter" && displayOption.displayID > 2 && "true"} value={displayOption.displayID}>{displayOption.displayName}</option>
          {/each}
        </select>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select the verses display type based on your reading preference.</p>

      <div class="flex flex-row justify-between items-center">
        <span class="block text-gray-900 dark:text-slate-400">Arabic Word Size ({fontSizeCodes.arabicText.split("-")[1]})</span>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" on:click={() => updateSettings({ type: "arabicText", action: "increase" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
            </svg>
          </button>
          <button type="button" on:click={() => updateSettings({ type: "arabicText", action: "decrease" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
            </svg>
          </button>
        </div>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Modify the font size for arabic word text.</p>

      <div class="flex flex-row justify-between items-center">
        <span class="block text-gray-900 dark:text-slate-400">Word Translation Size ({fontSizeCodes.wordTranslationText.split("-")[1]})</span>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" on:click={() => updateSettings({ type: "wordTranslationText", action: "increase" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
            </svg>
          </button>
          <button type="button" on:click={() => updateSettings({ type: "wordTranslationText", action: "decrease" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
            </svg>
          </button>
        </div>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Modify the font size for word translation and transliteration.</p>

      <div class="flex flex-row justify-between items-center">
        <span class="block text-gray-900 dark:text-slate-400">Verse Translation Size ({fontSizeCodes.verseTranslationText.split("-")[1]})</span>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" on:click={() => updateSettings({ type: "verseTranslationText", action: "increase" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
            </svg>
          </button>
          <button type="button" on:click={() => updateSettings({ type: "verseTranslationText", action: "decrease" })} class="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
            </svg>
          </button>
        </div>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Modify the font size for verse translation and transliteration.</p>

      <!-- wbw translation toggle -->
      <div class="flex flex-row justify-between items-center">
        <span class="block text-gray-900 dark:text-slate-400">Word Translation Display</span>
        <div class="inline-flex rounded-md shadow-sm {$wordTransliterationEnabledStore === false && disabledElement}" role="group">
          <button type="button" on:click={() => updateSettings({ type: "wordTranslationEnabled" })} class="inline-flex items-center px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            {$wordTranslationEnabledStore === true ? "Shown" : "Hidden"}
          </button>
        </div>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select whether you would like to show/hide word translations.</p>

      <!-- wbw transliteration toggle -->
      <div class="flex flex-row justify-between items-center">
        <span class="block text-gray-900 dark:text-slate-400">Word Transliteration Display</span>
        <div class="inline-flex rounded-md shadow-sm {$wordTranslationEnabledStore === false && disabledElement}" role="group">
          <button type="button" on:click={() => updateSettings({ type: "wordTransliterationEnabled" })} class="inline-flex items-center px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            {$wordTransliterationEnabledStore === true ? "Shown" : "Hidden"}
          </button>
        </div>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select whether you would like to show/hide word transliterations.</p>
    </div>
  </div>

  <!-- translations -->
  <div class="py-5 text-xs border-t border-gray-200 dark:border-slate-700">
    <h3 class="block mb-2 font-medium text-base text-gray-500 dark:text-slate-400">Translations</h3>

    <div class="flex flex-col flex-wrap space-y-4 text-xs">
      <div class="flex flex-row justify-between items-center">
        <label for="word-translations-list" class="block text-gray-900 dark:text-slate-400">Word</label>
        <select id="word-translations-list" bind:value={$wordTranslationStore} on:change={(event) => updateSettings({ type: "wordTranslation", value: +event.target.selectedIndex + 1 })} class="w-24 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {#each Object.entries(selectableWordTranslations) as [id, translation]}
            <option value={translation.id}>{translation.language}</option>
          {/each}
        </select>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select the word translation which will be displaced under the arabic word text.</p>

      <div class="flex flex-row justify-between items-center">
        <label for="verse-translations-list" class="block text-gray-900 dark:text-slate-400">Verse</label>
        <button id="dropdownCheckboxButton" data-dropdown-toggle="verse-translation-checkbox" class="inline-flex items-center px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-[#ebebeb] focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" type="button"> Select </button>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select verse translations from various author and languages.</p>

      <!-- Dropdown menu -->
      <div id="verse-translation-checkbox" class="z-10 hidden w-56 bg-white divide-y divide-gray-100 rounded-lg border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
        <ul id="verse-translations-list" class="max-h-56 overflow-y-scroll p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
          {#each Object.values(selectableVerseTranslations) as translation}
            <li>
              <div class="flex items-center">
                <!-- using else-if block to add the "checked" attribute because for some reason the inline check is not working in Svelte as compared to regular javascript -->
                {#if $verseTranslationsStore.includes(translation.id)}
                  <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: "verseTranslation", value: translation.id })} checked type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-slate-700" />
                {:else}
                  <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: "verseTranslation", value: translation.id })} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-slate-700" />
                {/if}
                <label for="verseTranslationCheckbox-{translation.id}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{translation.author}</label>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- audio -->
  <div class="py-5 text-xs border-t border-gray-200 dark:border-slate-700">
    <h3 class="block mb-2 font-medium text-base text-gray-500 dark:text-slate-400">Audios</h3>

    <div class="flex flex-col flex-wrap space-y-4 text-xs">
      <!-- reciter -->
      <div class="flex flex-row justify-between items-center">
        <label for="reciter-list" class="block text-gray-900 dark:text-slate-400">Verse Reciter</label>
        <select id="reciter-list" bind:value={$reciterStore} on:change={(event) => updateSettings({ type: "reciter", value: +event.target.selectedIndex + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {#each Object.entries(selectableReciters) as [id, reciter]}
            <option value={reciter.id}>{reciter.reciter}</option>
          {/each}
        </select>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select the desired reciter whose audio will be played when you choose to listen to a verse.</p>

      <!-- playback speed -->
      <div class="flex flex-row justify-between items-center">
        <label for="speed-list" class="block text-gray-900 dark:text-slate-400">Playback Speed</label>
        <select id="speed-list" bind:value={$playbackSpeedStore} on:change={(event) => updateSettings({ type: "playbackSpeed", value: +event.target.selectedIndex + 1 })} class="w-24 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {#each Object.entries(selectablePlaybackSpeeds) as [id, speed]}
            <option value={speed.id}>x{speed.speed}</option>
          {/each}
        </select>
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Select the desired playback speed at which the verse/word audio will be played.</p>

      <div class="flex flex-row justify-between items-center {disabledElement}">
        <label for="verse-repeat-list" class="block text-gray-900 dark:text-slate-400">Verse Repeat</label>
        <select id="verse-repeat-list" onchange="update_settings('audio', ['verse-repeat'])" class="w-24 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400 {disabledElement}">Select the number of times that a verse audio has to be repeated when you play it.</p>

      <div class="flex flex-row justify-between items-center {disabledElement}">
        <label for="word-repeat-list" class="block text-gray-900 dark:text-slate-400">Word Repeat</label>
        <select id="word-repeat-list" onchange="update_settings('audio', ['word-repeat'])" class="w-24 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      <p class="mb-6 text-xs text-gray-500 dark:text-gray-400 {disabledElement}">Select the number of times that a word audio has to be repeated when you click on it.</p>
    </div>
  </div>

  <!-- reset settings button -->
  <div class="flex flex-col justify-center border-t border-gray-200 py-6 space-y-4 {disabledElement}">
    <button onclick="reset_defaults()" class="text-sm {buttonElement}">Reset Settings</button>
    <p class="mb-6 text-xs text-gray-500 dark:text-gray-400">Resetting the website settings will also erase your last read location and bookmarks and the page will be reloaded for changes to take effect.</p>
  </div>
</div>
