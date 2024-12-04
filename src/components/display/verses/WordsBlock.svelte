<script>
	import VerseOptionsDropdown from '$display/verses/VerseOptionsDropdown.svelte';
	import Word from '$display/verses/Word.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import { selectableDisplays, selectableThemes } from '$data/options';
	import { __currentPage, __fontType, __displayType, __userSettings, __audioSettings, __morphologyKey, __verseKey, __websiteTheme, __morphologyModalVisible } from '$utils/stores';
	import { loadFont } from '$utils/loadFont';
	import { wordAudioController } from '$utils/audioController';
	import { updateSettings } from '$utils/updateSettings';
	import { mushafWordFontLink, mushafFontVersion } from '$data/websiteSettings';

	export let key;
	export let value;
	export let line = null;
	export let exampleVerse = false;

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	$: displayIsContinuous = selectableDisplays[$__displayType].continuous;

	// Dynamically load the fonts if mushaf fonts are selected
	if ([2, 3].includes($__fontType)) {
		loadFont(`p${value.meta.page}`, `${mushafWordFontLink}/QCF4${`00${value.meta.page}`.slice(-3)}_COLOR-Regular.woff?version=${mushafFontVersion}`).then(() => {
			// Hide the v4 words by default and show when the font is loaded...
			document.querySelectorAll(`.p${value.meta.page}`).forEach((element) => {
				element.classList.remove('invisible');
			});
		});
	}

	// Handle word clicks based on page type
	// 1. On morphology page, navigate to word's morphology
	// 2. On other pages, play word's audio
	// 3. On any page, show verse options dropdown for end verse icon
	function wordClickHandler(props) {
		// For morphology page
		if ($__currentPage === 'morphology' && props.type === 'word') {
			__morphologyKey.set(props.key);
			goto(`/morphology/${props.key}`, { replaceState: false });
		}

		// If the user clicks on a word in a non-Morphology page
		// else if ($__currentPage !== 'morphology' && props.type === 'word') {
		// 	__morphologyKey.set(props.key);
		// 	__morphologyModalVisible.set(true);
		// }

		// All other options
		else {
			__verseKey.set(props.key);
			if (props.type === 'word') {
				wordAudioController({
					key: props.key,
					chapter: +props.key.split(':')[0],
					verse: +props.key.split(':')[1]
				});
			} else if (props.type === 'end') {
				if (!displayIsContinuous)
					updateSettings({
						type: 'userBookmarks',
						key: props.key,
						set: true
					});
			}
		}
	}

	// Common classes for words and end icons
	$: wordAndEndIconCommonClasses = `
		hover:cursor-pointer
		${selectableThemes[$__websiteTheme].palette === 1 ? `hover:${window.theme('background')}/20` : 'hover:bg-blackkk/10'}
		${$__displayType === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'}
		${selectableDisplays[$__displayType].layout === 'wbw' ? 'p-3' : [2, 3].includes($__fontType) ? ($__currentPage === 'mushaf' ? 'p-0' : 'px-0 py-1') : 'p-1'}
		${exampleVerse && '!p-0'}
	`;

	// Classes for word spans
	$: wordSpanClasses = `
		arabicText leading-normal 
		arabic-font-${$__fontType} 
		${$__currentPage !== 'mushaf' && fontSizes.arabicText} 
		${displayIsContinuous && 'inline-block'}
		${[1, 4].includes($__fontType) && 'text-black theme'}
	`;

	// Classes for v4 hafs words
	$: v4hafsClasses = `
		invisible v4-words 
		p${value.meta.page} 
		${$__fontType === 3 ? 'theme-palette-tajweed' : 'theme-palette-normal'} 
	`;

	// Classes for end icons
	$: endIconClasses = `rounded-lg ${wordAndEndIconCommonClasses}`;
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
	<Word {value} {word} {key} {line} {wordClickHandler} {wordAndEndIconCommonClasses} {wordSpanClasses} {v4hafsClasses} {exampleVerse} />
{/each}

<!-- end icon -->
{#if $__currentPage != 'mushaf' || ($__currentPage === 'mushaf' && value.words.end_line === line)}
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
	<Tooltip arrow={false} type="light" class="z-30 inline-flex font-sans theme-grayyyscale font-normal">
		End of {key}
	</Tooltip>
{/if}
