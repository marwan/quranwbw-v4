<script>
	export let data, startVerse, endVerse;

	import PageHead from '$misc/PageHead.svelte';
	import Bismillah from '$display/Bismillah.svelte';
	import Chapter from '$display/verses/modes/Chapter.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { parseURL } from '$utils/parseURL';
	import { fetchChapterData, fetchVerseTranslationData } from '$utils/fetchData';
	import { quranMetaData } from '$data/quranMeta';
	import { selectableDisplays } from '$data/options';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { __userSettings, __currentPage, __chapterNumber, __displayType, __fontType, __wordTranslation, __wordTransliteration, __verseTranslations, __pageURL, __firstVerseOnPage, __chapterDataLoaded, __verseTranslationData } from '$utils/stores';
	import { buttonOutlineClasses } from '$data/commonClasses';
	import { goto } from '$app/navigation';
	import { term } from '$utils/terminologies';

	// max verses to load if total verses in chapter are more than this
	const maxVersesThreshold = 5;

	let chapterData;

	// fetch verses whenever there's a change
	$: {
		resetChapterDataVariables(+data.chapter);

		__chapterNumber.set(+data.chapter);

		const chapterTotalVerses = quranMetaData[$__chapterNumber].verses;

		// getting start and end range incase we need to load specific verses
		(startVerse = parseURL()[0]), (endVerse = parseURL()[1]);

		// Note: the below is only executed when start is 1 and end is total chapter verses, that is, user did not opt for a specific range
		// if there were no specific range opted for, then start with 1 till threshold
		// else we just skip this check and load as per URL parameters
		if (startVerse === 1 && endVerse === chapterTotalVerses) {
			(startVerse = 1), (endVerse = chapterTotalVerses > maxVersesThreshold ? maxVersesThreshold : chapterTotalVerses);
		}

		// if the complete chapter data was already fetched for this chapter, fetch from the same endpoint again (which should be cached)
		// else fetch the data for the given start and end verses
		// if (localStorage.getItem('chapterDataLoaded') === 'true') {
		// 	chapterData = fetchChapterData(true, $__chapterNumber);
		// } else {
		// 	chapterData = fetchChapterData(false, $__chapterNumber, startVerse, endVerse);
		// }

		chapterData = fetchChapterData($__chapterNumber);

		// update the first verse on page
		__firstVerseOnPage.set(startVerse);

		// do nothing except re-run the block if any of the following store updates
		if ($__pageURL || $__displayType || $__fontType || $__wordTranslation || $__wordTransliteration) {
			// do nothing...
		}
	}

	$: if ($__verseTranslations) fetchVerseTranslationData($__chapterNumber);

	$: loadPrevNextVerseButtons = `flex ${selectableDisplays[JSON.parse($__userSettings).displaySettings.displayType].continuous ? 'flex-row-reverse' : 'flex-row'} space-x-4 justify-center pt-8 pb-6 theme`;

	// update some variables on chapter change, for when the data has to be loaded from the API
	function resetChapterDataVariables(chapter) {
		if (chapter !== $__chapterNumber) {
			__chapterDataLoaded.set(false);
			localStorage.setItem('chapterDataLoaded', false);
		}
	}

	// load the first verse on page minus 1
	function loadPreviousVerse() {
		const versesOnPage = document.getElementsByClassName('verse');
		const firstVerseOnPage = +versesOnPage[1].id.split(':')[1];
		const lastVerseOnPage = +versesOnPage[versesOnPage.length - 1].id.split(':')[1];
		goto(`/${$__chapterNumber}/${+firstVerseOnPage - 1}-${+lastVerseOnPage}`, { replaceState: false });
	}

	__currentPage.set('chapter');
</script>

<PageHead title={`${quranMetaData[$__chapterNumber].transliteration} (${$__chapterNumber})`} />

<div id="chapter-block">
	{#await chapterData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<!-- <Bismillah {startVerse} /> -->

		<!-- need custom stylings if display type is 3 or 4 - continuous -->
		<div id="verses-block" class={selectableDisplays[JSON.parse($__userSettings).displaySettings.displayType].customClasses}>
			<!-- buttons to start chapter from start and load previous verse -->
			{#if startVerse > 1}
				<div class={loadPrevNextVerseButtons}>
					<a href="/{$__chapterNumber}" class="text-sm {buttonOutlineClasses}"> Start of {term('chapter')} </a>
					<button on:click={loadPreviousVerse} class="text-sm {buttonOutlineClasses}"> Previous {term('verse')} </button>
				</div>
			{/if}

			<Chapter {startVerse} {endVerse} />
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
