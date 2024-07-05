<script>
	import Drawer from '$ui/flowbite-svelte/drawer/Drawer.svelte';
	import Radio from '$ui/flowbite-svelte/forms/Radio.svelte';
	import Checkbox from '$ui/flowbite-svelte/forms/Checkbox.svelte';
	import Plus from '$svgs/Plus.svelte';
	import Minus from '$svgs/Minus.svelte';
	import CloseButton from '$ui/flowbite-svelte/utils/CloseButton.svelte';
	import Dropdown from '$ui/flowbite-svelte/dropdown/Dropdown.svelte';
	import Button from '$ui/flowbite-svelte/buttons/Button.svelte';
	import {
		__currentPage,
		__chapterData,
		__chapterNumber,
		__fontType,
		__displayType,
		__selectedDisplayId,
		__websiteTheme,
		__wordTranslation,
		__wordTranslationEnabled,
		__wordTransliterationEnabled,
		__verseTranslations,
		__reciter,
		__translationReciter,
		__playbackSpeed,
		__playTranslation,
		__userSettings,
		__wordTooltip,
		__settingsDrawerHidden,
		__wakeLockEnabled,
		__englishTerminology,
		__lastRead
	} from '$utils/stores';
	import { selectableDisplays, selectableFontTypes, selectableThemes, selectableVerseTranslations, verseTranslationsLanguages, selectableWordTranslations, selectableReciters, selectableTranslationReciters, selectablePlaybackSpeeds, selectableTooltipOptions } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { resetSettings } from '$utils/resetSettings';
	import { disabledClasses, buttonClasses } from '$data/commonClasses';
	import { sineIn } from 'svelte/easing';
	import { term } from '$utils/terminologies';
	import { displayTypeChangeHandler } from '$utils/displayTypeChangeHandler';

	const transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	const settingsBlockClasses = 'space-y-2 py-6';
	const selectorClasses = 'w-32 border border-black/10 text-black text-left rounded-3xl focus:ring-gray-500 focus:border-gray-500 focus-within:ring-2 block p-2.5 truncate font-normal theme-grayscale';
	const radioClasses = 'font-normal';
	const dropdownClasses = 'w-52 p-3 space-y-3 text-sm max-h-64 overflow-y-scroll theme-grayscale';
	const settingsDescriptionClasses = 'mb-6 text-sm opacity-70';
	const toggleBtnClasses =
		"relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-black/10 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-600 theme-grayscale";

	$: fontSizeCodes = JSON.parse($__userSettings).displaySettings.fontSizes;
	$: wordTranslationKey = Object.keys(selectableWordTranslations).filter((item) => selectableWordTranslations[item].id === $__wordTranslation);
</script>

<!-- settings drawer -->
<Drawer placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$__settingsDrawerHidden} class="theme w-full md:w-1/2 lg:w-[430px] md:rounded-tl-3xl md:rounded-bl-3xl pt-0" id="settings-drawer">
	<div class="flex z-30 top-0 sticky bg-white border-b-2 border-black/10 py-4 mb-4">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-3xl font-semibold">Settings</h5>
		<CloseButton on:click={() => ($__settingsDrawerHidden = true)} class="mb-4 rounded-3xl" />
	</div>

	<!-- display-settings-block -->
	<div id="display-settings-block" class="py-5">
		<h3 class="block mb-2 font-medium text-xl">Display</h3>

		<div class="flex flex-col flex-wrap text-base">
			<!-- website-theme-setting -->
			<div id="website-theme-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Theme</div>
					<Button class={selectorClasses}>{selectableThemes[$__websiteTheme].name}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableThemes) as [id, theme]}
							<li><Radio name="websiteTheme" bind:group={$__websiteTheme} value={theme.id} on:change={(event) => updateSettings({ type: 'websiteTheme', value: +event.target.value })} class={radioClasses}>{theme.name}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>An assortment of website themes to please your vision.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- display-type-setting -->
			<div id="display-type-setting" class="{settingsBlockClasses} {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
				<div class="flex flex-row justify-between items-center">
					<div class="block">Display Type</div>
					<Button class={selectorClasses}>{selectableDisplays[$__selectedDisplayId].displayName}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableDisplays) as [id, displayOption]}
							<li><Radio name="displayType" bind:group={$__selectedDisplayId} value={displayOption.displayID} on:change={(event) => displayTypeChangeHandler(+event.target.value)} class={radioClasses}>{displayOption.displayName}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>Different {term('verse')} layouts that you can choose from.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- word-tooltip-setting -->
			<div id="word-tooltip-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Word Tooltip</div>
					<Button class={selectorClasses}>{selectableTooltipOptions[$__wordTooltip].name}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableTooltipOptions) as [id, options]}
							<li><Radio name="wordTooltip" bind:group={$__wordTooltip} value={options.id} on:change={(event) => updateSettings({ type: 'wordTooltip', value: +event.target.value })} class={radioClasses}>{options.name}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>Choose what is displayed when you hover a word.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- word-translation-toggle-setting -->
			<div id="word-translation-toggle-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">Word Translation</span>

					<label class="inline-flex items-center cursor-pointer {$__wordTransliterationEnabled === false && disabledClasses}">
						<input type="checkbox" value="" class="sr-only peer" checked={$__wordTranslationEnabled} on:click={(event) => updateSettings({ type: 'wordTranslationEnabled', value: event.target.checked })} />
						<div class={toggleBtnClasses}></div>
					</label>
				</div>
				<p class={settingsDescriptionClasses}>Toggle the word translation which is shown below the Arabic word.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- word-transliteration-toggle-setting -->
			<div id="word-transliteration-toggle-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">Word Transliteration</span>
					<label class="inline-flex items-center cursor-pointer {$__wordTranslationEnabled === false && disabledClasses}">
						<input type="checkbox" value="" class="sr-only peer" checked={$__wordTransliterationEnabled} on:click={(event) => updateSettings({ type: 'wordTransliterationEnabled', value: event.target.checked })} />
						<div class={toggleBtnClasses}></div>
					</label>
				</div>
				<p class={settingsDescriptionClasses}>Toggle the word transliteration which is shown below the Arabic word.</p>
			</div>

			<!-- prevent sleep toggle, only show if the browser supports it  -->
			{#if 'wakeLock' in navigator}
				<div class="border-b border-black/10"></div>

				<!-- prevent-sleep-toggle-setting -->
				<div id="prevent-sleep-toggle-setting" class={settingsBlockClasses}>
					<div class="flex flex-row justify-between items-center">
						<span class="block">Prevent Sleep</span>
						<label class="inline-flex items-center cursor-pointer">
							<input type="checkbox" value="" class="sr-only peer" checked={$__wakeLockEnabled} on:click={(event) => updateSettings({ type: 'wakeLockEnabled', value: event.target.checked })} />
							<div class={toggleBtnClasses}></div>
						</label>
					</div>
					<p class={settingsDescriptionClasses}>Enabling this option would stop your screen from dimming/sleeping.</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- font-settings-block -->
	<div id="font-settings-block" class="py-5 border-t-2 border-black/10">
		<h3 class="block mb-2 font-medium text-xl">Font</h3>

		<div class="flex flex-col flex-wrap text-base">
			<!-- quran-font-setting -->
			<div id="quran-font-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Quran Font</div>
					<Button class={selectorClasses}>{selectableFontTypes[$__fontType].font}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableFontTypes) as [id, font]}
							{#if !font.disallowedIn.includes($__currentPage)}
								<li><Radio name="fontType" bind:group={$__fontType} value={font.id} on:change={(event) => updateSettings({ type: 'fontType', value: +event.target.value })} class={radioClasses}>{font.font}</Radio></li>
							{/if}
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>Multiple Quranic fonts to choose from depending on your mushaf or region preference.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- arabic-word-size-setting -->
			<div id="arabic-word-size-setting" class="{settingsBlockClasses} {$__currentPage === 'page' && disabledClasses}">
				<div class="flex flex-row justify-between items-center">
					<span class="block">Arabic Word Size ({fontSizeCodes.arabicText.split('-')[1]})</span>
					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button type="button" on:click={() => updateSettings({ type: 'arabicText', action: 'increase' })} class="w-16 border px-6 border-black/10 rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5">
							<Plus size={3} />
						</button>
						<button type="button" on:click={() => updateSettings({ type: 'arabicText', action: 'decrease' })} class="w-16 border px-6 text-center border-black/10 rounded-r-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5">
							<Minus size={3} />
						</button>
					</div>
				</div>
				<p class={settingsDescriptionClasses}>Font size for Arabic word text.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- word-translation-size-setting -->
			<div id="word-translation-size-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">Word Tr/Tl Size ({fontSizeCodes.wordTranslationText.split('-')[1]})</span>
					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button type="button" on:click={() => updateSettings({ type: 'wordTranslationText', action: 'increase' })} class="w-16 border px-6 border-black/10 rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500">
							<Plus size={3} />
						</button>
						<button type="button" on:click={() => updateSettings({ type: 'wordTranslationText', action: 'decrease' })} class="w-16 border px-6 text-center border-black/10 rounded-r-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500">
							<Minus size={3} />
						</button>
					</div>
				</div>
				<p class={settingsDescriptionClasses}>Font size for word translation and transliteration.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- verse-translation-size-setting -->
			<div id="verse-translation-size-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">{term('verse')} Tr/Tl Size ({fontSizeCodes.verseTranslationText.split('-')[1]})</span>
					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button type="button" on:click={() => updateSettings({ type: 'verseTranslationText', action: 'increase' })} class="w-16 border px-6 border-black/10 rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500">
							<Plus size={3} />
						</button>
						<button type="button" on:click={() => updateSettings({ type: 'verseTranslationText', action: 'decrease' })} class="w-16 border px-6 text-center border-black/10 rounded-r-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500">
							<Minus size={3} />
						</button>
					</div>
				</div>
				<p class={settingsDescriptionClasses}>Font size for {term('verse')} translation and transliteration.</p>
			</div>
		</div>
	</div>

	<!-- translation-settings-block -->
	<div id="translation-settings-block" class="py-5 border-t-2 border-black/10">
		<h3 class="block mb-2 font-medium text-xl">Translation</h3>

		<div class="flex flex-col flex-wrap text-base">
			<!-- word-translation-setting -->
			<div id="word-translation-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Word</div>
					<Button class={selectorClasses}>{selectableWordTranslations[wordTranslationKey].language}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableWordTranslations) as [id, translation]}
							<li><Radio name="wordTranslation" bind:group={$__wordTranslation} value={translation.id} on:change={(event) => updateSettings({ type: 'wordTranslation', value: +event.target.value })} class={radioClasses}>{translation.language}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>Word translation which will be displaced under the Arabic word text.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- verse-translation-setting -->
			<div id="verse-translation-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">{term('verse')}</div>
					<Button class={selectorClasses}>{$__verseTranslations.length} selected</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(verseTranslationsLanguages) as [id, language]}
							<div class="space-y-2">
								<div id="translation-name" class="text-sm font-medium">{language.language}</div>
								<div id="translation-list" class="space-y-2">
									{#each Object.values(selectableVerseTranslations) as translation}
										{#if translation.language === language.language}
											<li>
												<div class="flex items-center">
													<!-- using else-if block to add the "checked" attribute because for some reason the inline check is not working in Svelte as compared to regular javascript -->
													{#if $__verseTranslations.includes(translation.id)}
														<Checkbox checked id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: 'verseTranslation', value: translation.id })} class={radioClasses}>{translation.author}</Checkbox>
													{:else}
														<Checkbox id="verseTranslationCheckbox-{translation.id}" on:click={() => updateSettings({ type: 'verseTranslation', value: translation.id })} class={radioClasses}>{translation.author}</Checkbox>
													{/if}
												</div>
											</li>
										{/if}
									{/each}
								</div>
							</div>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>{term('verse')} translations from multiple authors and languages.</p>
			</div>
		</div>
	</div>

	<!-- audio-settings-block -->
	<div id="audio-settings-block" class="py-5 border-t-2 border-black/10">
		<h3 class="block mb-2 font-medium text-xl">Audio</h3>

		<div class="flex flex-col flex-wrap text-base">
			<!-- verse-reciter-setting -->
			<div id="verse-reciter-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">{term('verse')} Reciter</div>
					<Button class={selectorClasses}>{selectableReciters[$__reciter].reciter}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableReciters) as [id, reciter]}
							<li><Radio name="reciter" bind:group={$__reciter} value={reciter.id} on:change={(event) => updateSettings({ type: 'reciter', value: +event.target.value })} class={radioClasses}>{reciter.reciter}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>The reciter whose audio will be played when you choose to listen to a {term('verse')}.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- translation-reciter-setting -->
			<div id="translation-reciter-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Translation Reciter</div>
					<Button class={selectorClasses}>{selectableTranslationReciters[$__translationReciter].reciter}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectableTranslationReciters) as [id, reciter]}
							<li><Radio name="reciter" bind:group={$__translationReciter} value={reciter.id} on:change={(event) => updateSettings({ type: 'translationReciter', value: +event.target.value })} class={radioClasses}>{reciter.reciter}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>The translation reciter whose audio will be played after the {term('verse')} audio.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- playback-speed-setting -->
			<div id="playback-speed-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<div class="block">Playback Speed</div>
					<Button class={selectorClasses}>x{selectablePlaybackSpeeds[$__playbackSpeed].speed}</Button>
					<Dropdown class={dropdownClasses}>
						{#each Object.entries(selectablePlaybackSpeeds) as [id, speed]}
							<li><Radio name="playbackSpeed" bind:group={$__playbackSpeed} value={speed.id} on:change={(event) => updateSettings({ type: 'playbackSpeed', value: +event.target.value })} class={radioClasses}>x{speed.speed}</Radio></li>
						{/each}
					</Dropdown>
				</div>
				<p class={settingsDescriptionClasses}>The playback speed at which the {term('verse')}/word audio will be played.</p>
			</div>

			<div class="border-b border-black/10"></div>

			<!-- play-translation-setting -->
			<div id="play-translation-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">Play Translation</span>
					<label class="inline-flex items-center cursor-pointer {$__wordTranslationEnabled === false && disabledClasses}">
						<input type="checkbox" value="" class="sr-only peer" checked={$__playTranslation} on:click={(event) => updateSettings({ type: 'playTranslation', value: event.target.checked })} />
						<div class={toggleBtnClasses}></div>
					</label>
				</div>
				<p class={settingsDescriptionClasses}>Whether the translation audio should be played after the Arabic audio.</p>
			</div>
		</div>
	</div>

	<!-- miscellaneous-settings-block -->
	<div id="miscellaneous-settings-block" class="py-5 border-t-2 border-black/10">
		<h3 class="block mb-2 font-medium text-xl">Miscellaneous</h3>

		<div class="flex flex-col flex-wrap text-base">
			<!-- verse-reciter-setting -->
			<div id="verse-reciter-setting" class={settingsBlockClasses}>
				<div class="flex flex-row justify-between items-center">
					<span class="block">English Terminologies</span>
					<label class="inline-flex items-center cursor-pointer">
						<input type="checkbox" value="" class="sr-only peer" checked={$__englishTerminology} on:click={(event) => updateSettings({ type: 'englishTerminology', value: event.target.checked })} />
						<div class={toggleBtnClasses}></div>
					</label>
				</div>
				<p class={settingsDescriptionClasses}>Switch between the English and Arabic terminologies used on the website.</p>
			</div>
		</div>
	</div>

	<!-- reset settings button -->
	<div class="flex flex-col justify-center border-t border-black/10 py-6 space-y-4">
		<button on:click={() => resetSettings()} class="text-sm {buttonClasses}">Reset Settings</button>
		<p class={settingsDescriptionClasses}>Resetting the options will not erase your bookmarks, notes, and last read location.</p>
	</div>
</Drawer>
