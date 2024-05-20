<script>
	export let key,
		value,
		line = null;

	import { goto } from '$app/navigation';
	import { displayOptions, mushafFontLinks } from '$data/options';
	import { supplicationsFromQuran } from '$data/quranMeta';
	import { __currentPage, __wordType, __displayType, __websiteTheme, __userSettings, __audioSettings, __wordTranslation, __wordTranslationEnabled, __wordTransliterationEnabled, __morphologyKey, __tajweedEnabled, __wordTooltip } from '$utils/stores';
	import { wordAudioController } from '$utils/audioController';
	import { loadFont } from '$utils/loadFont';
	import { Tooltip } from 'flowbite-svelte';

	const chapter = key.split(':')[0];
	const verse = key.split(':')[1];
	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	const arabicSplit = value.words.arabic.split('|');
	const transliterationSplit = value.words.transliteration.split('|');
	const translationSplit = value.words.translation.split('|');
	const timestampSplit = value.words.timestamp.split('|');

	// if mushaf fonts are selected, then dynamically load the fonts
	if ($__wordType === 2) {
		loadFont(`p${value.meta.page}`, `${mushafFontLinks.COLRv1}/QCF4${`00${value.meta.page}`.slice(-3)}_COLOR-Regular.woff`).then(() => {
			// we can by default hide the v4 words and show when the font is loaded...
			document.querySelectorAll(`.p${value.meta.page}`).forEach((element) => {
				element.classList.remove('invisible');
			});
		});
	}

	// handle what happens when a word is clicked depending on page type
	function wordClickHandler(props) {
		if ($__currentPage === 'morphology') {
			const wordKey = `${props.chapter}:${props.verse}:${props.word + 1}`;
			__morphologyKey.set(wordKey);
			goto(`/morphology/${wordKey}`, { replaceState: false });
		} else {
			wordAudioController(props);
		}
	}

	$: wordClasses = `rounded-lg hover:cursor-pointer hover:bg-lightGray ${displayOptions[$__displayType].layout === 'wbw' ? 'p-3' : $__currentPage === 'page' ? 'p-0' : 'p-1'}`;
	$: displayIsContinuous = displayOptions[$__displayType].continuous;

	// remove the invisibility class once all the fonts are loaded
	document.fonts.ready.then(function () {
		document.querySelectorAll('.chapter-headers').forEach((element) => {
			element.classList.remove('invisible');
		});

		document.querySelectorAll('.bismillah').forEach((element) => {
			element.classList.remove('invisible');
		});
	});
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
	{#if $__currentPage != 'page' || ($__currentPage === 'page' && +value.words.line.split('|')[word] === line)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			id={`${chapter}:${verse}:${word + 1}`}
			class="word {$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses} {$__audioSettings.playingWordKey === `${chapter}:${verse}:${word + 1}` || $__morphologyKey === `${chapter}:${verse}:${word + 1}` ? 'bg-lightGray dark:bg-slate-800' : ''}"
			style={$__currentPage === 'supplications' && word + 1 < supplicationsFromQuran[key] && 'opacity: 30%;'}
			data-timestamp={timestampSplit[word]}
			on:click={() => wordClickHandler({ chapter, verse, word, type: 'word' })}
		>
			<span class="arabicText leading-normal arabic-font-{$__wordType} {$__currentPage !== 'page' && fontSizes.arabicText} {displayIsContinuous === true && 'inline-block'}" data-fontSize={fontSizes.arabicText}>
				<!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
				{#if $__wordType === 1 || $__wordType === 3}
					{arabicSplit[word]}
					<!-- 2: Uthmanic Hafs Mushaf -->
				{:else if $__wordType === 2}
					<span style="font-family: p{value.meta.page}" class="p{value.meta.page} invisible {$__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">{arabicSplit[word]}</span>
				{/if}
			</span>

			<!-- word translation and transliteration -->
			{#if $__displayType === 1 || $__displayType === 3}
				<div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText} {displayIsContinuous === true && 'direction-ltr'}" data-fontSize={fontSizes.wordTranslationText}>
					<span class="leading-normal {$__wordTransliterationEnabled ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
					<span class="leading-normal {$__wordTranslation === 2 && 'font-Urdu'} {$__wordTranslationEnabled ? 'block' : 'hidden'}">{translationSplit[word]}</span>
				</div>
			{/if}
		</div>

		<!-- word tooltip -->
		{#if $__wordTooltip > 1}
			<Tooltip class="z-30 text-center inline-flex theme-grayscale" type="light">
				{#if $__wordTooltip === 2}
					{@html transliterationSplit[word]}
				{:else if $__wordTooltip === 3}
					{@html translationSplit[word]}
				{:else if $__wordTooltip === 4}
					{@html `${transliterationSplit[word]} <br /><br /> ${translationSplit[word]}`}
				{/if}
			</Tooltip>
		{/if}
	{/if}
{/each}

<!-- end icon -->
{#if $__currentPage != 'page' || ($__currentPage === 'page' && value.words.end_line === line)}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="{$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses}" on:click={() => wordClickHandler({ chapter, verse, type: 'end' })}>
		<span class="arabicText leading-normal arabic-font-{$__wordType} {$__currentPage !== 'page' && fontSizes.arabicText} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
			<!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
			{#if $__wordType === 1 || $__wordType === 3}
				{value.words.end}
				<!-- 2: Uthmanic Hafs Mushaf -->
			{:else if $__wordType === 2}
				<span style="font-family: p{value.meta.page}" class="p{value.meta.page} invisible {$__tajweedEnabled === true ? 'theme-palette-tajweed' : 'theme-palette-normal'} font-filter">{value.words.end}</span>
			{/if}
		</span>
	</div>

	<!-- end icon tooltip -->
	<Tooltip type="light" class="z-30 inline-flex theme-grayscale font-filter">End of Verse {key}</Tooltip>
{/if}
