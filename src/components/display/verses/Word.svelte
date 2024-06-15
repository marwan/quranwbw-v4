<script>
	export let word;
	export let key;
	export let value;
	export let line = null;
	export let wordClickHandler;
	export let wordAndEndIconCommonClasses;
	export let wordSpanClasses;
	export let v4hafsClasses;

	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	// import Popover from '$ui/flowbite-svelte/popover/Popover.svelte';
	import { displayOptions, selectableThemes } from '$data/options';
	import { supplicationsFromQuran } from '$data/quranMeta';
	import { __currentPage, __wordType, __displayType, __userSettings, __audioSettings, __wordTranslation, __wordTranslationEnabled, __wordTransliterationEnabled, __morphologyKey, __tajweedEnabled, __wordTooltip, __verseKey, __websiteTheme } from '$utils/stores';

	const chapter = key.split(':')[0];
	const verse = key.split(':')[1];
	const wordKey = `${chapter}:${verse}:${word + 1}`;

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	const arabicSplit = value.words.arabic.split('|');
	const transliterationSplit = value.words.transliteration.split('|');
	const translationSplit = value.words.translation.split('|');
	const timestampSplit = value.words.timestamp.split('|');

	$: displayIsContinuous = displayOptions[$__displayType].continuous;

	$: wordDivClasses = `
	  word rounded-lg ${wordAndEndIconCommonClasses}
	  ${$__audioSettings.playingWordKey === wordKey || $__morphologyKey === wordKey ? (selectableThemes[$__websiteTheme].palette === 1 ? 'bg-white/20' : 'bg-black/10') : null}
		${$__currentPage === 'supplications' && word + 1 < supplicationsFromQuran[key] ? 'opacity-30' : null}
	`;

	$: wordTranslationClasses = `
		wordTranslationText flex flex-col 
		${fontSizes.wordTranslationText} ${displayIsContinuous ? 'direction-ltr' : null}
		text-black theme
	`;

	// fix for Ba'da Ma Ja'aka for page 254
	// since it's just a cosmetic change, there's no need of changing it at database level
	const fixedMushafWords = {
		'13:37:8': 'ﱿ', // 6th line last word - Ba'da
		'13:37:9': 'ﲀﲁ' // 7th line first word - Ma Ja'aka
	};
</script>

{#if $__currentPage != 'page' || ($__currentPage === 'page' && +value.words.line.split('|')[word] === line)}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div id="word-{wordKey.split(':')[2]}" class={wordDivClasses} data-timestamp={timestampSplit[word]} on:click={() => wordClickHandler({ chapter, verse, word, type: 'word' })}>
		<span class={wordSpanClasses} data-fontSize={fontSizes.arabicText}>
			<!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
			{#if $__wordType === 1 || $__wordType === 3}
				{arabicSplit[word]}
				<!-- 2: Uthmanic Hafs Mushaf -->
			{:else if $__wordType === 2}
				<span style="font-family: p{value.meta.page}" class={v4hafsClasses}>
					<!-- word fix, see fixedMushafWords -->
					{#if fixedMushafWords.hasOwnProperty(wordKey)}
						{fixedMushafWords[wordKey]}
					{:else}
						{arabicSplit[word]}
					{/if}
				</span>
			{/if}
		</span>

		<!-- word translation and transliteration, only for wbw modes -->
		{#if $__displayType === 1 || $__displayType === 3}
			<div class={wordTranslationClasses} data-fontSize={fontSizes.wordTranslationText}>
				<span class="leading-normal {$__wordTransliterationEnabled ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
				<span class="leading-normal {$__wordTranslation === 2 && 'font-Urdu'} {$__wordTranslationEnabled ? 'block' : 'hidden'}">{translationSplit[word]}</span>
			</div>
		{/if}
	</div>
	<!-- <Popover class="w-64 text-sm font-light " title="Popover title" triggeredBy="#word-{wordKey.split(':')[2]}" trigger="hover" arrow={false}>
		And here's some amazing content. It's very engaging. Right? <br />
		<a href="/">home</a>
	</Popover> -->

	<!-- word tooltip -->
	{#if $__wordTooltip > 1}
		<Tooltip arrow={false} type="light" class="z-30 hidden md:block text-center inline-flex font-sans theme-grayscale font-normal">
			{#if $__wordTooltip === 2}
				{@html transliterationSplit[word]}
			{:else if $__wordTooltip === 3}
				{@html translationSplit[word]}
			{:else if $__wordTooltip === 4}
				{@html `<div class="flex flex-col">${transliterationSplit[word]} <div class="border-t"></div> ${translationSplit[word]}</div>`}
			{/if}
		</Tooltip>
	{/if}
{/if}
