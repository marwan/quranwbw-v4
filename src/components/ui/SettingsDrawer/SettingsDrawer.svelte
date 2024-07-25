<script>
	import Drawer from '$ui/flowbite-svelte/drawer/Drawer.svelte';
	import Plus from '$svgs/Plus.svelte';
	import Minus from '$svgs/Minus.svelte';
	import CloseButton from '$ui/flowbite-svelte/utils/CloseButton.svelte';
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
		__verseTafsir,
		__reciter,
		__translationReciter,
		__playbackSpeed,
		__playTranslation,
		__userSettings,
		__wordTooltip,
		__settingsDrawerHidden,
		__wakeLockEnabled,
		__englishTerminology,
		__lastRead,
		__hideNonDuaPart
	} from '$utils/stores';
	import { selectableDisplays, selectableFontTypes, selectableThemes, selectableWordTranslations, selectableReciters, selectableTranslationReciters, selectablePlaybackSpeeds, selectableTooltipOptions } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { resetSettings } from '$utils/resetSettings';
	import { disabledClasses, buttonClasses } from '$data/commonClasses';
	import { selectableTafsirs } from '$data/selectableTafsirs';
	import { sineIn } from 'svelte/easing';
	import { term } from '$utils/terminologies';

	import WebsiteThemeSelector from '$ui/SettingsDrawer/WebsiteThemeSelector.svelte';
	import DisplayTypeSelector from '$ui/SettingsDrawer/DisplayTypeSelector.svelte';
	import WordTooltipSelector from '$ui/SettingsDrawer/WordTooltipSelector.svelte';
	import QuranFontSelector from '$ui/SettingsDrawer/QuranFontSelector.svelte';
	import WordTranslationSelector from '$ui/SettingsDrawer/WordTranslationSelector.svelte';
	import VerseTranslationSelector from '$ui/SettingsDrawer/VerseTranslationSelector.svelte';
	import VerseTafsirSelector from '$ui/SettingsDrawer/VerseTafsirSelector.svelte';
	import VerseRecitorSelector from '$ui/SettingsDrawer/VerseRecitorSelector.svelte';
	import TranslationRecitorSelector from '$ui/SettingsDrawer/TranslationRecitorSelector.svelte';
	import PlaybackSpeedSelector from '$ui/SettingsDrawer/PlaybackSpeedSelector.svelte';

	const transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	const individualSettingsComponents = {
		'website-theme': WebsiteThemeSelector,
		'display-type': DisplayTypeSelector,
		'word-tooltip': WordTooltipSelector,
		'quran-font': QuranFontSelector,
		'word-translation': WordTranslationSelector,
		'verse-translation': VerseTranslationSelector,
		'verse-tafsir': VerseTafsirSelector,
		'verse-reciter': VerseRecitorSelector,
		'translation-reciter': TranslationRecitorSelector,
		'playback-speed': PlaybackSpeedSelector
	};

	const settingsBlockClasses = 'space-y-2 py-6';
	const selectorClasses = 'w-32 border border-black/10 text-black text-left rounded-3xl focus:ring-gray-500 focus:border-gray-500 focus-within:ring-2 block p-2.5 truncate font-normal theme-grayscale';
	const settingsDescriptionClasses = 'mb-6 text-sm opacity-70';
	const toggleBtnClasses =
		"relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-black/10 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-600 theme-grayscale";

	$: fontSizeCodes = JSON.parse($__userSettings).displaySettings.fontSizes;
	$: wordTranslationKey = Object.keys(selectableWordTranslations).filter((item) => selectableWordTranslations[item].id === $__wordTranslation);
	$: if ($__currentPage) goBackToMainSettings();

	let individualSettingsComponent;
	let mainSettingsScrollPos = 0;

	let allSettingsVisible = true;
	let individualSettingsVisible = false;

	function goBackToMainSettings() {
		allSettingsVisible = true;
		individualSettingsVisible = false;

		// scroll to last position
		try {
			setTimeout(function () {
				document.getElementById('settings-drawer').scrollTop = mainSettingsScrollPos;
			}, 0);
		} catch (error) {
			// ...
		}
	}

	function gotoIndividualSetting(type) {
		mainSettingsScrollPos = document.getElementById('settings-drawer').scrollTop;
		allSettingsVisible = false;
		individualSettingsVisible = true;
		individualSettingsComponent = individualSettingsComponents[type];

		// scroll to top
		try {
			setTimeout(function () {
				document.getElementById('individual-setting').scrollIntoView();
			}, 0);
		} catch (error) {
			// ...
		}
	}
</script>

<!-- settings drawer -->
<Drawer placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$__settingsDrawerHidden} class="theme w-full md:w-1/2 lg:w-[430px] md:rounded-tl-3xl md:rounded-bl-3xl pt-0" id="settings-drawer">
	<!-- all-settings -->
	{#if allSettingsVisible}
		<div id="all-settings">
			<div class="flex z-30 top-0 sticky bg-white border-b-2 border-black/10 mb-4">
				<h5 id="drawer-label" class="inline-flex items-center my-4 text-3xl font-semibold">Settings</h5>
				<CloseButton on:click={() => ($__settingsDrawerHidden = true)} class="my-4 rounded-3xl" />
			</div>

			<!-- display-settings-block -->
			<div id="display-settings-block" class="py-5">
				<h3 class="block mb-2 font-medium text-xl">Display</h3>

				<div class="flex flex-col flex-wrap text-base">
					<!-- website-theme-setting -->
					<div id="website-theme-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Theme</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('website-theme')}>{selectableThemes[$__websiteTheme].name}</Button>
						</div>
						<p class={settingsDescriptionClasses}>An assortment of website themes to please your vision.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- display-type-setting -->
					<div id="display-type-setting" class="{settingsBlockClasses} {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
						<div class="flex flex-row justify-between items-center">
							<div class="block">Display Type</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('display-type')}>{selectableDisplays[$__selectedDisplayId].displayName}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Different {term('verse')} layouts that you can choose from.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- word-tooltip-setting -->
					<div id="word-tooltip-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Word Tooltip</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('word-tooltip')}>{selectableTooltipOptions[$__wordTooltip].name}</Button>
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
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('quran-font')}>{selectableFontTypes[$__fontType].font}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Multiple Quranic fonts to choose from depending on your mushaf or region preference.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- arabic-word-size-setting -->
					<div id="arabic-word-size-setting" class="{settingsBlockClasses} {$__currentPage === 'page' && disabledClasses}">
						<div class="flex flex-row justify-between items-center">
							<span class="block">Arabic Word Size ({fontSizeCodes.arabicText.split('-')[1]})</span>
							<div class="inline-flex rounded-3xl shadow-sm" role="group">
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
							<div class="inline-flex rounded-3xl shadow-sm" role="group">
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
							<div class="inline-flex rounded-3xl shadow-sm" role="group">
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
				<h3 class="block mb-2 font-medium text-xl">Translation & {term('tafsir')}</h3>

				<div class="flex flex-col flex-wrap text-base">
					<!-- word-translation-setting -->
					<div id="word-translation-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Word</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('word-translation')}>{selectableWordTranslations[wordTranslationKey].language}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Word translation which will be displaced under the Arabic word text.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- verse-translation-setting -->
					<div id="verse-translation-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">{term('verse')}</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-translation')}>{$__verseTranslations.length} selected</Button>
						</div>
						<p class={settingsDescriptionClasses}>{term('verse')} translations from multiple authors and languages.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- tafsir-setting -->
					<div id="tafsir-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">{term('tafsir')}</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-tafsir')}>{selectableTafsirs[$__verseTafsir].name}</Button>
						</div>
						<p class={settingsDescriptionClasses}>{term('verse')} {term('tafsir')} from multiple authors and languages.</p>
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
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-reciter')}>{selectableReciters[$__reciter].reciter}</Button>
						</div>
						<p class={settingsDescriptionClasses}>The reciter whose audio will be played when you choose to listen to a {term('verse')}.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- translation-reciter-setting -->
					<div id="translation-reciter-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Translation Reciter</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('translation-reciter')}>{selectableTranslationReciters[$__translationReciter].reciter}</Button>
						</div>
						<p class={settingsDescriptionClasses}>The translation reciter whose audio will be played after the {term('verse')} audio.</p>
					</div>

					<div class="border-b border-black/10"></div>

					<!-- playback-speed-setting -->
					<div id="playback-speed-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Playback Speed</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('playback-speed')}>x{selectablePlaybackSpeeds[$__playbackSpeed].speed}</Button>
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

					<div class="border-b border-black/10"></div>

					<!-- non-dua-part-toggle -->
					<div id="non-dua-part-toggle" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<span class="block">Hide Non-{term('supplications')} Words</span>
							<label class="inline-flex items-center cursor-pointer">
								<input type="checkbox" value="" class="sr-only peer" checked={$__hideNonDuaPart} on:click={(event) => updateSettings({ type: 'hideNonDuaPart', value: event.target.checked })} />
								<div class={toggleBtnClasses}></div>
							</label>
						</div>
						<p class={settingsDescriptionClasses}>Show/hide the non-{term('supplications')} words in the {term('supplications')} page.</p>
					</div>
				</div>
			</div>

			<!-- reset settings button -->
			<div class="flex flex-col justify-center border-t border-black/10 py-6 space-y-4">
				<button on:click={() => resetSettings()} class="text-sm {buttonClasses}">Reset Settings</button>
				<p class={settingsDescriptionClasses}>Resetting the options will not erase your bookmarks, notes, and last read location.</p>
			</div>
		</div>
	{/if}

	<!-- individual-setting -->
	{#if individualSettingsVisible}
		<div id="individual-setting">
			<div class="flex z-30 top-0 sticky bg-white border-b-2 border-black/10 mb-4">
				<button id="drawer-label" class="inline-flex items-center my-4 text-3xl font-semibold" on:click={() => goBackToMainSettings()}>← Back</button>
				<CloseButton on:click={() => ($__settingsDrawerHidden = true)} class="my-4 rounded-3xl" />
			</div>

			<svelte:component this={individualSettingsComponent} />
		</div>
	{/if}
</Drawer>
