<script>
  import { currentPageStore, wordTypeStore, displayTypeStore, websiteThemeStore, wordTranslationStore, wordTranslationEnabledStore, wordTransliterationEnabledStore, verseTranslationsStore, reciterStore, playbackSpeedStore, userSettingsStore } from "$utils/stores";
  import { displayOptions, selectableFontTypes, selectableThemes, selectableVerseTranslations, verseTranslationsLanguages, selectableWordTranslations, selectableReciters, selectablePlaybackSpeeds } from "$data/options";
  import { updateSettings } from "$utils/updateSettings";
  import { resetSettings } from "$utils/resetSettings";
  import { disabledElement, buttonElement, labelPillElement } from "$utils/commonStyles";

  const settingsBlockClasses = "space-y-2 py-6 border-b";

  $: fontSizeCodes = JSON.parse($userSettingsStore).displaySettings.fontSizes;
</script>

<!-- drawer component -->
<div id="settings-drawer" class="fixed top-0 right-0 z-40 h-screen p-4 pt-0 pb-16 overflow-y-auto transition-transform rounded-tl-xl rounded-bl-xl translate-x-full bg-white grayscale w-full md:w-1/2 lg:w-[430px] dark:bg-gray-800" tabindex="-1" aria-labelledby="settings-drawer-label">
  <div id="settings-head" class="top-0 sticky bg-white border-b-2 py-4 mb-4">
    <h5 id="settings-drawer-label" class="inline-flex items-center mb-4 text-3xl space-x-2 font-semibold text-gray-500 dark:text-gray-400">
      <span>Settings</span>
    </h5>

    <!-- <div id="quick-jump" class="flex flex-row space-x-2">
      <span>Jump: </span>
      <div>
        <a href="#display-settings-block" class={labelPillElement}>Display</a>
        <a href="#font-settings-block" class={labelPillElement}>Font</a>
        <a href="#translation-settings-block" class={labelPillElement}>Translation</a>
        <a href="#audio-settings-block" class={labelPillElement}>Audio</a>
      </div>
    </div> -->

    <button type="button" data-drawer-hide="settings-drawer" aria-controls="settings-drawer" class="text-gray-400 bg-transparent hover:bg-[#ebebeb] hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-4 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
      <span class="sr-only">Close menu</span>
    </button>
  </div>

  <!-- display-settings-block -->
  <div id="display-settings-block" class="py-5">
    <h3 class="block mb-2 font-medium text-xl text-gray-500 dark:text-slate-400">Display</h3>

    <div class="flex flex-col flex-wrap text-base">
      <!-- website-theme-setting -->
      <div id="website-theme-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <label for="website-theme-list" class="block text-gray-900 dark:text-slate-400">Theme</label>
          <select id="website-theme-list" on:change={(event) => updateSettings({ type: "websiteTheme", value: +event.target.value })} bind:value={$websiteThemeStore} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(selectableThemes) as [id, theme]}
              <option value={theme.id}>{theme.name}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">An assortment of website themes to please your vision.</p>
      </div>

      <!-- display-type-setting -->
      <div id="display-type-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <label for="display-style-list" class="block text-gray-900 dark:text-slate-400">Display Type</label>
          <select id="display-style-list" bind:value={$displayTypeStore} on:change={(event) => updateSettings({ type: "displayType", value: +event.target.selectedIndex + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(displayOptions) as [id, displayOption]}
              <option disabled={$currentPageStore !== "chapter" && displayOption.displayID > 2 && "true"} value={displayOption.displayID}>{displayOption.displayName}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Different verse layouts that you can choose from.</p>
      </div>

      <!-- word-translation-toggle-setting -->
      <div id="word-translation-toggle-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <span class="block text-gray-900 dark:text-slate-400">Word Translation</span>

          <label class="inline-flex items-center cursor-pointer {$wordTransliterationEnabledStore === false && disabledElement}">
            <input type="checkbox" value="" class="sr-only peer" checked={$wordTranslationEnabledStore} on:click={(event) => updateSettings({ type: "wordTranslationEnabled", value: event.target.checked })} />
            <div class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Toggle the word translation which is shown below the Arabic word.</p>
      </div>

      <!-- word-transliteration-toggle-setting -->
      <div id="word-transliteration-toggle-setting" class="{settingsBlockClasses} border-b-0">
        <div class="flex flex-row justify-between items-center">
          <span class="block text-gray-900 dark:text-slate-400">Word Transliteration</span>

          <label class="inline-flex items-center cursor-pointer {$wordTranslationEnabledStore === false && disabledElement}">
            <input type="checkbox" value="" class="sr-only peer" checked={$wordTransliterationEnabledStore} on:click={(event) => updateSettings({ type: "wordTransliterationEnabled", value: event.target.checked })} />
            <div class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Toggle the word transliteration which is shown below the Arabic word.</p>
      </div>

      <!-- <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer" on:click={(event) => console.log(event.target.checked)} />
        <div class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label> -->
    </div>
  </div>

  <!-- font-settings-block -->
  <div id="font-settings-block" class="py-5 border-t-2 border-gray-200">
    <h3 class="block mb-2 font-medium text-xl text-gray-500 dark:text-slate-400">Font</h3>

    <div class="flex flex-col flex-wrap text-base">
      <!-- quran-font-setting -->
      <div id="quran-font-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <label for="quran-font-list" class="block text-gray-900 dark:text-slate-400">Quran Font</label>
          <select id="quran-font-list" on:change={(event) => updateSettings({ type: "wordType", value: +event.target.value })} bind:value={$wordTypeStore} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(selectableFontTypes) as [id, font]}
              <option value={font.id}>{font.font}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Multiple Quranic fonts to choose from depending on your Mushaf or region preference.</p>

        <!-- note for Uthmanic Hafs Mushaf -->
        {#if $wordTypeStore === 2}
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400"><b>Note:</b> The Uthmanic Hafs Mushaf font type is still under development and may contain errors and we are aware of them. In case you find any issues, please use a different font type.</p>
        {/if}
      </div>

      <!-- arabic-word-size-setting -->
      <div id="arabic-word-size-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <span class="block text-gray-900 dark:text-slate-400">Arabic Word Size ({fontSizeCodes.arabicText.split("-")[1]})</span>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" on:click={() => updateSettings({ type: "arabicText", action: "increase" })} class="w-16 border px-6 border-gray-300 text-gray-900 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
              </svg>
            </button>
            <button type="button" on:click={() => updateSettings({ type: "arabicText", action: "decrease" })} class="w-16 border px-6 text-center border-gray-300 text-gray-900 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Font size for Arabic word text.</p>
      </div>

      <!-- word-translation-size-setting -->
      <div id="word-translation-size-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <span class="block text-gray-900 dark:text-slate-400">Word Tr/Tl Size ({fontSizeCodes.wordTranslationText.split("-")[1]})</span>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" on:click={() => updateSettings({ type: "wordTranslationText", action: "increase" })} class="w-16 border px-6 border-gray-300 text-gray-900 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
              </svg>
            </button>
            <button type="button" on:click={() => updateSettings({ type: "wordTranslationText", action: "decrease" })} class="w-16 border px-6 text-center border-gray-300 text-gray-900 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Font size for word translation and transliteration.</p>
      </div>

      <!-- verse-translation-size-setting -->
      <div id="verse-translation-size-setting" class="{settingsBlockClasses} border-b-0">
        <div class="flex flex-row justify-between items-center">
          <span class="block text-gray-900 dark:text-slate-400">Verse Tr/Tl Size ({fontSizeCodes.verseTranslationText.split("-")[1]})</span>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" on:click={() => updateSettings({ type: "verseTranslationText", action: "increase" })} class="w-16 border px-6 border-gray-300 text-gray-900 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
              </svg>
            </button>
            <button type="button" on:click={() => updateSettings({ type: "verseTranslationText", action: "decrease" })} class="w-16 border px-6 text-center border-gray-300 text-gray-900 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg class="w-3 h-3 text-gray-800 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Font size for verse translation and transliteration.</p>
      </div>
    </div>
  </div>

  <!-- translation-settings-block -->
  <div id="translation-settings-block" class="py-5 border-t-2 border-gray-200">
    <h3 class="block mb-2 font-medium text-xl text-gray-500 dark:text-slate-400">Translation</h3>

    <div class="flex flex-col flex-wrap text-base">
      <!-- word-translation-setting -->
      <div id="word-translation-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <label for="word-translations-list" class="block text-gray-900 dark:text-slate-400">Word</label>
          <select id="word-translations-list" bind:value={$wordTranslationStore} on:change={(event) => updateSettings({ type: "wordTranslation", value: +event.target.value })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(selectableWordTranslations) as [id, translation]}
              <option value={translation.id}>{translation.language}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Word translation which will be displaced under the Arabic word text.</p>
      </div>

      <!-- verse-translation-setting -->
      <div id="verse-translation-setting" class="{settingsBlockClasses} border-b-0">
        <div class="flex flex-row justify-between items-center">
          <label for="verse-translations-list" class="block text-gray-900 dark:text-slate-400">Verse</label>
          <button id="dropdownCheckboxButton" data-dropdown-toggle="verse-translation-checkbox" class="w-32 border text-left border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="button"> {$verseTranslationsStore.toString()} </button>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Verse translations from multiple authors and languages.</p>

        <!-- verse-translation dropdown menu -->
        <div id="verse-translation-checkbox" class="z-10 hidden w-56 bg-white divide-y divide-gray-100 rounded-lg border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
          <ul id="verse-translations-list" class="max-h-56 overflow-y-scroll p-3 space-y-4 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
            {#each Object.entries(verseTranslationsLanguages) as [id, language]}
              <div class="space-y-2">
                <div id="translation-name" class="text-sm font-medium">{language.language}</div>
                <div id="translation-list" class="space-y-2">
                  {#each Object.values(selectableVerseTranslations) as translation}
                    {#if translation.language === language.language}
                      <li>
                        <div class="flex items-center">
                          <!-- using else-if block to add the "checked" attribute because for some reason the inline check is not working in Svelte as compared to regular javascript -->
                          {#if $verseTranslationsStore.includes(translation.id)}
                            <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: "verseTranslation", value: translation.id })} checked type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-slate-700" />
                          {:else}
                            <input id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: "verseTranslation", value: translation.id })} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-slate-700" />
                          {/if}
                          <label for="verseTranslationCheckbox-{translation.id}" class="ml-2 text-sm text-gray-900 dark:text-gray-300">{translation.author}</label>
                        </div>
                      </li>
                    {/if}
                  {/each}
                </div>
              </div>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- audio-settings-block -->
  <div id="audio-settings-block" class="py-5 border-t-2 border-gray-200">
    <h3 class="block mb-2 font-medium text-xl text-gray-500 dark:text-slate-400">Audio</h3>

    <div class="flex flex-col flex-wrap text-base">
      <!-- verse-reciter-setting -->
      <div id="verse-reciter-setting" class={settingsBlockClasses}>
        <div class="flex flex-row justify-between items-center">
          <label for="reciter-list" class="block text-gray-900 dark:text-slate-400">Verse Reciter</label>
          <select id="reciter-list" bind:value={$reciterStore} on:change={(event) => updateSettings({ type: "reciter", value: +event.target.selectedIndex + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(selectableReciters) as [id, reciter]}
              <option value={reciter.id}>{reciter.reciter}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Desired reciter whose audio will be played when you choose to listen to a verse.</p>
      </div>

      <!-- playback-speed-setting -->
      <div id="playback-speed-setting" class="{settingsBlockClasses} border-b-0">
        <div class="flex flex-row justify-between items-center">
          <label for="speed-list" class="block text-gray-900 dark:text-slate-400">Playback Speed</label>
          <select id="speed-list" bind:value={$playbackSpeedStore} on:change={(event) => updateSettings({ type: "playbackSpeed", value: +event.target.selectedIndex + 1 })} class="w-32 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {#each Object.entries(selectablePlaybackSpeeds) as [id, speed]}
              <option value={speed.id}>x{speed.speed}</option>
            {/each}
          </select>
        </div>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">The playback speed at which the verse/word audio will be played.</p>
      </div>
    </div>
  </div>

  <!-- reset settings button -->
  <div class="flex flex-col justify-center border-t border-gray-200 py-6 space-y-4">
    <button on:click={() => resetSettings()} class="text-sm {buttonElement}">Reset Settings</button>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Resetting the options will not affect your bookmarks or last read location.</p>
  </div>
</div>
