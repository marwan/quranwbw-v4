<script>
	export let key;
	export let value;
	export let line = null;
	export let exampleVerse = false;

	import VerseOptionsDropdown from '$display/verses/VerseOptionsDropdown.svelte';
	import Word from '$display/verses/Word.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import { selectableDisplays, mushafFontLinks, selectableThemes } from '$data/options';
	import { __currentPage, __fontType, __displayType, __userSettings, __audioSettings, __morphologyKey, __verseKey, __websiteTheme } from '$utils/stores';
	import { loadFont } from '$utils/loadFont';
	import { wordAudioController } from '$utils/audioController';
	import { updateSettings } from '$utils/updateSettings';

	const userSettings = JSON.parse(localStorage.getItem('userSettings'));

	// for mushaf mode, we only allow v4 font type, but don't save the settings, and for other pages, get the font type from settings
	if (![2, 3].includes($__fontType)) {
		updateSettings({ type: 'fontType', value: $__currentPage === 'page' ? 2 : userSettings.displaySettings.fontType });
	}

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;

	$: displayIsContinuous = selectableDisplays[$__displayType].continuous;

	// if mushaf fonts are selected, then dynamically load the fonts
	if ([2, 3].includes($__fontType)) {
		loadFont(`p${value.meta.page}`, `${mushafFontLinks.COLRv1}/QCF4${`00${value.meta.page}`.slice(-3)}_COLOR-Regular.woff`).then(() => {
			// we can by default hide the v4 words and show when the font is loaded...
			document.querySelectorAll(`.p${value.meta.page}`).forEach((element) => {
				element.classList.remove('invisible');
			});
		});
	}

	// handle what happens when a word is clicked depending on page type
	// 1. if a word is clicked on the morphology page, show/goto that word's morphology
	// 2. if a word is clicked on other pages, play the word's audio
	// 3. if the end verse icon is clicked on any page, show the verse options dropdown
	function wordClickHandler(props) {
		// only if its morphology page and a word is clicked
		if ($__currentPage === 'morphology' && props.type === 'word') {
			__morphologyKey.set(props.key);
			goto(`/morphology/${props.key}`, { replaceState: false });
		}

		// for all other pages
		else {
			__verseKey.set(props.key);

			// word in verse
			if (props.type === 'word') {
				wordAudioController({ key: props.key, chapter: +props.key.split(':')[0], verse: +props.key.split(':')[1] });
			}

			// end verse icon
			else if (props.type === 'end') {
				// for continuous modes, the verse options dropdown will open, but if its not a continuous mode then un/bookmark verse
				if (!displayIsContinuous) updateSettings({ type: 'userBookmarks', key: props.key, set: true });
			}
		}
	}

	$: wordAndEndIconCommonClasses = `
		hover:cursor-pointer
		${selectableThemes[$__websiteTheme].palette === 1 ? 'hover:bg-white/20' : 'hover:bg-black/10'}
		${$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'}
		${selectableDisplays[$__displayType].layout === 'wbw' ? 'p-3' : [2, 3].includes($__fontType) ? ($__currentPage === 'page' ? 'p-0' : 'px-0 py-1') : 'p-1'}
		${exampleVerse && '!p-0'}
	`;

	$: wordSpanClasses = `
		arabicText leading-normal 
		arabic-font-${$__fontType} 
		${$__currentPage !== 'page' && fontSizes.arabicText} 
		${displayIsContinuous ? 'inline-block' : null}
		${[1, 4].includes($__fontType) ? 'text-black theme' : null}
	`;

	$: v4hafsClasses = `
		invisible v4-words 
		p${value.meta.page} 
		${$__fontType === 3 ? 'theme-palette-tajweed' : 'theme-palette-normal'} 
	`;

	$: endIconClasses = `rounded-lg ${wordAndEndIconCommonClasses}`;
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
	<Word {value} {word} {key} {line} {wordClickHandler} {wordAndEndIconCommonClasses} {wordSpanClasses} {v4hafsClasses} {exampleVerse} />
{/each}

<!-- end icon -->
{#if $__currentPage != 'page' || ($__currentPage === 'page' && value.words.end_line === line)}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class={endIconClasses} on:click={() => wordClickHandler({ key, type: 'end' })}>
		<span class={wordSpanClasses} data-fontSize={fontSizes.arabicText}>
			<!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
			{#if [1, 4].includes($__fontType)}
				{value.words.end}
				<!-- 2: Uthmanic Hafs Mushaf -->
			{:else if [2, 3].includes($__fontType)}
				<span style="font-family: p{value.meta.page}" class={v4hafsClasses}>{value.words.end}</span>
			{/if}
		</span>
	</div>
	{#if displayIsContinuous}
		<VerseOptionsDropdown page={value.meta.page} />
	{/if}

	<!-- end icon tooltip -->
	<Tooltip arrow={false} type="light" class="z-30 inline-flex font-filter">End of {key}</Tooltip>
{/if}
