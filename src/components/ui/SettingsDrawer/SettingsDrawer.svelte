<script>
	import WebsiteThemeSelector from '$ui/SettingsDrawer/WebsiteThemeSelector.svelte';
	import DisplayTypeSelector from '$ui/SettingsDrawer/DisplayTypeSelector.svelte';
	import WordTooltipSelector from '$ui/SettingsDrawer/WordTooltipSelector.svelte';
	import QuranFontSelector from '$ui/SettingsDrawer/QuranFontSelector.svelte';
	import WordTranslationSelector from '$ui/SettingsDrawer/WordTranslationSelector.svelte';
	import WordTransliterationSelector from '$ui/SettingsDrawer/WordTransliterationSelector.svelte';
	import VerseTranslationSelector from '$ui/SettingsDrawer/VerseTranslationSelector.svelte';
	import VerseTransliterationSelector from '$ui/SettingsDrawer/VerseTransliterationSelector.svelte';
	import VerseTafsirSelector from '$ui/SettingsDrawer/VerseTafsirSelector.svelte';
	import VerseRecitorSelector from '$ui/SettingsDrawer/VerseRecitorSelector.svelte';
	import TranslationRecitorSelector from '$ui/SettingsDrawer/TranslationRecitorSelector.svelte';
	import PlaybackSpeedSelector from '$ui/SettingsDrawer/PlaybackSpeedSelector.svelte';
	import VersePlayButtonSelector from '$ui/SettingsDrawer/VersePlayButtonSelector.svelte';
	import Drawer from '$ui/FlowbiteSvelte/drawer/Drawer.svelte';
	import Range from '$ui/FlowbiteSvelte/forms/Range.svelte';
	import CloseButton from '$ui/FlowbiteSvelte/utils/CloseButton.svelte';
	import Button from '$ui/FlowbiteSvelte/buttons/Button.svelte';

	import {
		__currentPage,
		__chapterData,
		__chapterNumber,
		__fontType,
		__displayType,
		__selectedDisplayId,
		__websiteTheme,
		__wordTranslation,
		__wordTransliteration,
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
		__hideNonDuaPart,
		__playButtonsFunctionality
	} from '$utils/stores';

	import { selectableDisplays, selectableFontTypes, selectableThemes, selectableWordTranslations, selectableWordTransliterations, selectableVerseTransliterations, selectableReciters, selectableTranslationReciters, selectablePlaybackSpeeds, selectableTooltipOptions, selectableFontSizes, fontSizePresets, selectableVersePlayButtonOptions } from '$data/options';

	import { updateSettings } from '$utils/updateSettings';
	import { resetSettings } from '$utils/resetSettings';
	import { disabledClasses, buttonClasses } from '$data/commonClasses';
	import { selectableTafsirs } from '$data/selectableTafsirs';
	import { sineIn } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { term } from '$utils/terminologies';
	import { getTailwindBreakpoint } from '$utils/getTailwindBreakpoint';

	// Components mapping for individual settings
	const individualSettingsComponents = {
		'website-theme': WebsiteThemeSelector,
		'display-type': DisplayTypeSelector,
		'word-tooltip': WordTooltipSelector,
		'quran-font': QuranFontSelector,
		'word-translation': WordTranslationSelector,
		'word-transliteration': WordTransliterationSelector,
		'verse-translation': VerseTranslationSelector,
		'verse-transliteration': VerseTransliterationSelector,
		'verse-tafsir': VerseTafsirSelector,
		'verse-reciter': VerseRecitorSelector,
		'translation-reciter': TranslationRecitorSelector,
		'playback-speed': PlaybackSpeedSelector,
		'verse-play-button': VersePlayButtonSelector
	};

	// Transition parameters for drawer
	const transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	// CSS classes
	const settingsBlockClasses = 'space-y-2 py-6';
	const selectorClasses = `w-32 border ${window.theme('border')} text-left rounded-3xl ${window.theme('input')} focus-within:ring-2 block p-2.5 truncate font-normal`;
	const settingsDescriptionClasses = 'mb-6 text-xs opacityyy-70';
	const toggleBtnClasses = `relative w-14 h-7 ${window.theme('toggles')} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-grayyy-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-0.5 after:start-[4px] after:${window.theme('background')} after:${window.theme('border')} after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-grayyy-600`;

	let settingsDrawerOpacity = 'opacity-100';
	let settingsDrawerBackground = `${window.theme('background')}`;
	let individualSettingsComponent;
	let mainSettingsScrollPos = 0;
	let allSettingsVisible = true;
	let individualSettingsVisible = false;
	let totalVerseTransliterationsSelected = 0;
	let arabicWordSizeValue = fontSizePresets.indexOf(JSON.parse($__userSettings).displaySettings.fontSizes.arabicText);
	let wordTranlationTransliterationSizeValue = fontSizePresets.indexOf(JSON.parse($__userSettings).displaySettings.fontSizes.wordTranslationText);
	let verseTranlationTransliterationSizeValue = fontSizePresets.indexOf(JSON.parse($__userSettings).displaySettings.fontSizes.verseTranslationText);
	let playbackSpeedValue = JSON.parse($__userSettings).audioSettings.playbackSpeed;

	// Update settings when sliders are changed
	$: updateSettings({ type: 'arabicText', value: selectableFontSizes[arabicWordSizeValue].value });
	$: updateSettings({ type: 'wordTranslationText', value: selectableFontSizes[wordTranlationTransliterationSizeValue].value });
	$: updateSettings({ type: 'verseTranslationText', value: selectableFontSizes[verseTranlationTransliterationSizeValue].value });
	$: updateSettings({ type: 'playbackSpeed', value: playbackSpeedValue });

	// Calculate maximum allowed font size based on breakpoint
	$: maxFontSizeAllowed = ['default', 'sm'].includes(getTailwindBreakpoint()) ? 9 : 12;

	// Get translation and transliteration keys
	$: wordTranslationKey = Object.keys(selectableWordTranslations).find((item) => selectableWordTranslations[item].id === $__wordTranslation);
	$: wordTransliterationKey = Object.keys(selectableWordTransliterations).find((item) => selectableWordTransliterations[item].id === $__wordTransliteration);

	// Hide settings drawer and go back to main settings on certain conditions
	$: if ($__currentPage || $__settingsDrawerHidden) goBackToMainSettings();

	// Count total selected verse transliterations
	$: {
		totalVerseTransliterationsSelected = $__verseTranslations.filter((item) => selectableVerseTransliterations.includes(item)).length;
	}

	// Basic browser and platform detection
	const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
	const isMac = navigator.platform.toUpperCase().includes('MAC');
	const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);

	// Go back to main settings and restore scroll position
	function goBackToMainSettings() {
		allSettingsVisible = true;
		individualSettingsVisible = false;

		// Scroll to last known position
		setTimeout(() => {
			try {
				document.getElementById('settings-drawer').scrollTop = mainSettingsScrollPos;
			} catch (error) {
				// console.log(error);
			}
		}, 0);
	}

	// Navigate to an individual setting component
	function gotoIndividualSetting(type) {
		mainSettingsScrollPos = document.getElementById('settings-drawer').scrollTop;
		allSettingsVisible = false;
		individualSettingsVisible = true;
		individualSettingsComponent = individualSettingsComponents[type];

		// Scroll to the individual setting view
		setTimeout(() => {
			try {
				document.getElementById('individual-setting').scrollIntoView();
			} catch (error) {
				// console.log(error);
			}
		}, 0);
	}

	// Handle mouse enter event to show font size sliders
	function onMouseEnter(selector) {
		document.querySelectorAll('.fontSizeSliders').forEach((element) => {
			element.classList.remove(`${window.theme('background')}`, 'opacity-100');
			element.classList.add('opacity-0', 'pointer-events-none');
		});

		settingsDrawerOpacity = 'opacity-0';
		settingsDrawerBackground = 'bg-transparent';
		document.querySelector('.settings-backdrop').classList.add('opacityyy-10');

		const selectedElement = document.getElementById(selector);
		selectedElement.classList.remove('opacity-0', 'pointer-events-none');
		selectedElement.classList.add('opacity-100', `${window.theme('background')}`, 'rounded-3xl', 'shadow-lg', 'px-2');
	}

	// Handle mouse leave event to hide font size sliders
	function onMouseLeave() {
		document.querySelectorAll('.fontSizeSliders').forEach((element) => {
			element.classList.remove(`${window.theme('background')}`, 'opacity-0', 'rounded-3xl', 'shadow-lg', 'px-2', 'pointer-events-none');
			element.classList.add('opacity-100');
		});

		settingsDrawerOpacity = 'opacity-100';
		settingsDrawerBackground = `${window.theme('background')}`;
		document.querySelector('.settings-backdrop').classList.remove('opacityyy-10');
	}
</script>

<!-- settings drawer -->
<Drawer placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$__settingsDrawerHidden} class="w-full md:w-1/2 lg:w-[430px] md:rounded-tl-3xl md:rounded-bl-3xl pt-0 {settingsDrawerBackground}" id="settings-drawer">
	<!-- all-settings -->
	{#if allSettingsVisible}
		<div id="all-settings">
			<div class="flex z-30 top-0 sticky {window.theme('background')} border-b-2 {window.theme('border')} mb-4 {settingsDrawerOpacity}">
				<h5 id="drawer-label" class="inline-flex items-center my-4 text-3xl font-semibold">Settings</h5>
				<CloseButton on:click={() => ($__settingsDrawerHidden = true)} class="my-4 rounded-3xl" />
			</div>

			<!-- display-settings-block -->
			<div id="display-settings-block" class="py-5 {settingsDrawerOpacity}">
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

					<div class="border-b {window.theme('border')}"></div>

					<!-- display-type-setting -->
					<div id="display-type-setting" class="{settingsBlockClasses} {!['chapter', 'mushaf', 'supplications', 'bookmarks', 'morphology', 'search'].includes($__currentPage) && disabledClasses}">
						<div class="flex flex-row justify-between items-center">
							<div class="block">Display Type</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('display-type')}>{selectableDisplays[$__selectedDisplayId].displayName}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Different {term('verse')} layouts that you can choose from.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

					<!-- word-tooltip-setting -->
					<div id="word-tooltip-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Word Tooltip</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('word-tooltip')}>{selectableTooltipOptions[$__wordTooltip].name}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Choose what is displayed when you hover a word.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

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

					<div class="border-b {window.theme('border')}"></div>

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
						<div class="border-b {window.theme('border')}"></div>

						<!-- prevent-sleep-toggle-setting -->
						<div id="prevent-sleep-toggle-setting" class={settingsBlockClasses}>
							<div class="flex flex-row justify-between items-center">
								<span class="block">Prevent Sleep</span>
								<label class="inline-flex items-center cursor-pointer">
									<input type="checkbox" value="" class="sr-only peer" checked={$__wakeLockEnabled} on:click={(event) => __wakeLockEnabled.set(event.target.checked)} />
									<div class={toggleBtnClasses}></div>
								</label>
							</div>
							<p class={settingsDescriptionClasses}>Enabling this option will prevent your screen from dimming or sleeping. Please note that you will need to manually enable this option for each session.</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- font-settings-block -->
			<div id="font-settings-block" class="py-5 border-t-2 {window.theme('border')}">
				<h3 class="block mb-2 font-medium text-xl {settingsDrawerOpacity}">Font</h3>

				<div class="flex flex-col flex-wrap text-base">
					<!-- quran-font-setting -->
					<div id="quran-font-setting" class="{settingsBlockClasses} {settingsDrawerOpacity}">
						<div class="flex flex-row justify-between items-center">
							<div class="block">Quran Font</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('quran-font')}>{selectableFontTypes[$__fontType].font}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Multiple Quranic fonts to choose from depending on your mushaf or region preference.</p>

						<!-- note for Firefox users on Apple devices -->
						{#if [2, 3].includes($__fontType)}
							{#if (isIOS && isFirefox) || (isMac && isFirefox)}
								<p class={settingsDescriptionClasses}><span class="font-semibold">Important Note: </span>The Mushaf fonts you have selected may not be fully compatible with Firefox on Apple devices. For the best experience, please use Safari or Chrome.</p>
							{/if}
						{/if}
					</div>

					<div class="border-b {window.theme('border')} {settingsDrawerOpacity}"></div>

					<!-- arabic-word-size-setting -->
					<div id="arabic-word-size-setting" class="fontSizeSliders {settingsBlockClasses} {$__currentPage === 'mushaf' && disabledClasses}">
						<div class="flex flex-col justify-between space-y-4">
							<span class="block">Arabic Word Size ({selectableFontSizes[arabicWordSizeValue].value.split('-')[1]})</span>
							<!-- svelte-ignore a11y-mouse-events-have-key-events -->
							<div class="flex flex-col space-y-2 rounded-3xl w-full" role="group" on:mouseenter={() => onMouseEnter('arabic-word-size-setting')} on:mouseleave={() => onMouseLeave()}>
								<Range min="1" max={maxFontSizeAllowed} bind:value={arabicWordSizeValue} class={window.theme('sliders')} />
							</div>
						</div>
					</div>

					<div class="border-b {window.theme('border')} {settingsDrawerOpacity}"></div>

					<!-- word-translation-size-setting . -->
					<div id="word-translation-size-setting" class="fontSizeSliders {settingsBlockClasses} {$__currentPage === 'mushaf' && disabledClasses}">
						<div class="flex flex-col justify-between space-y-4">
							<span class="block">Word Translation/Transliteration Size ({selectableFontSizes[wordTranlationTransliterationSizeValue].value.split('-')[1]})</span>
							<!-- svelte-ignore a11y-mouse-events-have-key-events -->
							<div class="flex flex-col space-y-2 rounded-3xl w-full" role="group" on:mouseenter={() => onMouseEnter('word-translation-size-setting')} on:mouseleave={() => onMouseLeave()}>
								<Range min="1" max={maxFontSizeAllowed} bind:value={wordTranlationTransliterationSizeValue} class={window.theme('sliders')} />
							</div>
						</div>
					</div>

					<div class="border-b {window.theme('border')} {settingsDrawerOpacity}"></div>

					<!-- verse-translation-size-setting -->
					<div id="verse-translation-size-setting" class="fontSizeSliders {settingsBlockClasses} {$__currentPage === 'mushaf' && disabledClasses}">
						<div class="flex flex-col justify-between space-y-4">
							<span class="block">{term('verse')} Translation/Transliteration Size ({selectableFontSizes[verseTranlationTransliterationSizeValue].value.split('-')[1]})</span>
							<!-- svelte-ignore a11y-mouse-events-have-key-events -->
							<div class="flex flex-col space-y-2 rounded-3xl w-full" role="group" on:mouseenter={() => onMouseEnter('verse-translation-size-setting')} on:mouseleave={() => onMouseLeave()}>
								<Range min="1" max={maxFontSizeAllowed} bind:value={verseTranlationTransliterationSizeValue} class={window.theme('sliders')} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- translation-settings-block -->
			<div id="translation-settings-block" class="py-5 border-t-2 {window.theme('border')} {settingsDrawerOpacity}">
				<h3 class="block mb-2 font-medium text-xl">Translation, Transliteration & {term('tafsir')}</h3>

				<div class="flex flex-col flex-wrap text-base">
					<!-- word-translation-setting -->
					<div id="word-translation-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Word Translation</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('word-translation')}>{selectableWordTranslations[wordTranslationKey].language}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Word translation which will be displaced under the Arabic word text.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

					<!-- word-transliteration-setting -->
					<div id="word-transliteration-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Word Transliteration</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('word-transliteration')}>{selectableWordTransliterations[wordTransliterationKey].language}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Word transliteration of various types.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

					<!-- verse-translation-setting -->
					<div id="verse-translation-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">{term('verse')} Translation</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-translation')}>{$__verseTranslations.length - totalVerseTransliterationsSelected} selected</Button>
						</div>
						<p class={settingsDescriptionClasses}>{term('verse')} translations from multiple authors and languages.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

					<!-- verse-transliteration-setting -->
					<div id="verse-transliteration-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">{term('verse')} Transliteration</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-transliteration')}>{totalVerseTransliterationsSelected} selected</Button>
						</div>
						<p class={settingsDescriptionClasses}>{term('verse')} transliteration of various types.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

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
			<div id="audio-settings-block" class="py-5 border-t-2 {window.theme('border')} {settingsDrawerOpacity}">
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

					<div class="border-b {window.theme('border')}"></div>

					<!-- translation-reciter-setting -->
					<div id="translation-reciter-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">Translation Reciter</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('translation-reciter')}>{selectableTranslationReciters[$__translationReciter].reciter}</Button>
						</div>
						<p class={settingsDescriptionClasses}>The translation reciter whose audio will be played after the {term('verse')} audio.</p>
					</div>

					<div class="border-b {window.theme('border')}"></div>

					<!-- playback-speed-setting -->
					<div id="playback-speed-setting" class={settingsBlockClasses}>
						<div class="flex flex-col justify-between space-y-4">
							<span class="block">Playback Speed ({selectablePlaybackSpeeds[playbackSpeedValue].speed})</span>
							<div class="flex flex-col space-y-2 rounded-3xl w-full" role="group">
								<Range min="1" max="7" bind:value={playbackSpeedValue} class={window.theme('sliders')} />
							</div>
						</div>
					</div>

					<div class="border-b {window.theme('border')}"></div>

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

					<div class="border-b {window.theme('border')}"></div>

					<!-- verse-play-button-setting -->
					<div id="verse-play-button-setting" class={settingsBlockClasses}>
						<div class="flex flex-row justify-between items-center">
							<div class="block">{term('verse')} Play Button</div>
							<Button class={selectorClasses} on:click={() => gotoIndividualSetting('verse-play-button')}>{selectableVersePlayButtonOptions[$__playButtonsFunctionality.verse].name}</Button>
						</div>
						<p class={settingsDescriptionClasses}>Select what happens when you click on the play button for a {term('verse')}.</p>
					</div>
				</div>
			</div>

			<!-- miscellaneous-settings-block -->
			<div id="miscellaneous-settings-block" class="py-5 border-t-2 {window.theme('border')} {settingsDrawerOpacity}">
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

					<div class="border-b {window.theme('border')}"></div>

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
			<div class="flex flex-col justify-center border-t {window.theme('border')} py-6 space-y-4 {settingsDrawerOpacity}">
				<button on:click={() => resetSettings()} class="text-sm {buttonClasses}">Reset Settings</button>
				<p class={settingsDescriptionClasses}>Your bookmarks and notes will remain unaffected.</p>
			</div>
		</div>
	{/if}

	<!-- individual-setting -->
	{#if individualSettingsVisible}
		<div id="individual-setting" transition:fly={{ duration: 150, x: 0, easing: sineIn }}>
			<div class="flex z-30 top-0 sticky {window.theme('background')} border-b-2 {window.theme('border')} mb-4">
				<button id="drawer-label" class="inline-flex items-center my-4 text-3xl font-semibold" on:click={() => goBackToMainSettings()}>← Back</button>
				<CloseButton on:click={() => ($__settingsDrawerHidden = true)} class="my-4 rounded-3xl" />
			</div>

			<svelte:component this={individualSettingsComponent} />
		</div>
	{/if}
</Drawer>
