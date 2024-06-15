<script>
	export let key;
	export let value;
	export let line = null;

	import OptionsDropdown from '$display/verses/OptionsDropdown.svelte';
	import Word from '$display/verses/Word.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import { displayOptions, mushafFontLinks, selectableThemes } from '$data/options';
	import { __currentPage, __wordType, __displayType, __userSettings, __audioSettings, __morphologyKey, __tajweedEnabled, __verseKey, __websiteTheme } from '$utils/stores';
	import { loadFont } from '$utils/loadFont';
	import { wordAudioController } from '$utils/audioController';
	import { updateSettings } from '$utils/updateSettings';

	const userSettings = JSON.parse(localStorage.getItem('userSettings'));

	// for mushaf mode, we only allow v4 font type, but don't save the settings, and for other pages, get the font/word type from settings
	updateSettings({ type: 'wordType', value: $__currentPage === 'page' ? 2 : userSettings.displaySettings.wordType });

	const chapter = key.split(':')[0];
	const verse = key.split(':')[1];
	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;

	$: displayIsContinuous = displayOptions[$__displayType].continuous;

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
		if ($__currentPage === 'morphology' && props.type !== 'end') {
			const wordKey = `${props.chapter}:${props.verse}:${props.word + 1}`;
			__morphologyKey.set(wordKey);
			goto(`/morphology/${wordKey}`, { replaceState: false });
		} else {
			// if end icon was clicked, show options
			if (props.type === 'end') __verseKey.set(`${props.chapter}:${props.verse}`);
			// else if word was clicked, play it
			else wordAudioController(props);
		}
	}

	$: wordAndEndIconCommonClasses = `
		hover:cursor-pointer
		${selectableThemes[$__websiteTheme].palette === 1 ? 'hover:bg-white/20' : 'hover:bg-black/10'}
		${$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'}
		${displayOptions[$__displayType].layout === 'wbw' ? 'p-3' : $__wordType === 2 ? 'px-0 py-1' : 'p-1'}
	`;

	$: wordSpanClasses = `
		arabicText leading-normal 
		arabic-font-${$__wordType} 
		${$__currentPage !== 'page' && fontSizes.arabicText} 
		${displayIsContinuous ? 'inline-block group-hover:text-gray-500' : null}
		${[1, 3].includes($__wordType) ? 'text-black theme' : null}
	`;

	$: v4hafsClasses = `
		invisible v4-words 
		p${value.meta.page} 
		${$__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'} 
	`;

	$: endIconClasses = `rounded-lg ${wordAndEndIconCommonClasses}`;
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
	<Word {value} {word} {key} {line} {wordClickHandler} {wordAndEndIconCommonClasses} {wordSpanClasses} {v4hafsClasses} />
{/each}

<!-- end icon -->
{#if $__currentPage != 'page' || ($__currentPage === 'page' && value.words.end_line === line)}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class={endIconClasses} on:click={() => wordClickHandler({ chapter, verse, type: 'end' })}>
		<span class={wordSpanClasses} data-fontSize={fontSizes.arabicText}>
			<!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
			{#if $__wordType === 1 || $__wordType === 3}
				{value.words.end}
				<!-- 2: Uthmanic Hafs Mushaf -->
			{:else if $__wordType === 2}
				<span style="font-family: p{value.meta.page}" class={v4hafsClasses}>{value.words.end}</span>
			{/if}
		</span>
	</div>
	<OptionsDropdown page={value.meta.page} />

	<!-- end icon tooltip -->
	<Tooltip arrow={false} type="light" class="z-30 inline-flex font-filter">End of {key}</Tooltip>
{/if}
