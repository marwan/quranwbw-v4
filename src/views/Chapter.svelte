<!-- for chapter and verse routes -->
<script>
	export let data, startVerse, endVerse;

	import PageHead from '$misc/PageHead.svelte';
	import Bismillah from '$display/Bismillah.svelte';
	import Chapter from '$display/verses/modes/Chapter.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { parseURL } from '$utils/parseURL';
	import { fetchChapterData } from '$utils/fetchData';
	import { quranMetaData } from '$data/quranMeta';
	import { displayOptions } from '$data/options';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { __userSettings, __currentPage, __chapterNumber, __displayType, __wordType, __wordTranslation, __verseTranslations, __pageURL, __firstVerseOnPage, __chapterDataLoaded, __chapterData } from '$utils/stores';

	// max verses to load if total verses in chapter are more than this
	const maxVersesThreshold = 10;

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
		if (localStorage.getItem('chapterDataLoaded') === 'true') {
			chapterData = fetchChapterData(true, $__chapterNumber);
		} else {
			chapterData = fetchChapterData(false, $__chapterNumber, startVerse, endVerse);
		}

		// update the first verse on page
		__firstVerseOnPage.set(startVerse);

		// do nothing except re-run the block if any of the following store updates
		if ($__pageURL || $__displayType || $__wordType || $__wordTranslation || $__verseTranslations) {
			// do nothing...
		}
	}

	// update some variables on chapter change, for when the data has to be loaded from the API
	function resetChapterDataVariables(chapter) {
		if (chapter !== $__chapterNumber) {
			__chapterDataLoaded.set(false);
			localStorage.setItem('chapterDataLoaded', false);
		}
	}

	__currentPage.set('chapter');
</script>

<PageHead title={`${quranMetaData[$__chapterNumber].transliteration} (${$__chapterNumber})`} />

<div id="chapter-block">
	{#await chapterData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<Bismillah {startVerse} />

		<!-- need custom stylings if display type is 3 or 4 - continuous -->
		<div id="verses-block" class={displayOptions[JSON.parse($__userSettings).displaySettings.displayType].customStyle}>
			<Chapter {startVerse} {endVerse} />
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
