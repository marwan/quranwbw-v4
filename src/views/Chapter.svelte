<!-- for chapter and verse routes -->
<script>
	// props from router
	export let data, startVerse, endVerse;

	import PageHead from '$components/PageHead.svelte';
	import Bismillah from '$components/Bismillah.svelte';
	import ChapterVerses from '$verses/ChapterVerses.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { parseURL } from '$utils/parseURL';
	import { fetchChapterData } from '$utils/fetchData';
	import { quranMetaData } from '$data/quranMeta';
	import { displayOptions } from '$data/options';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage, __chapterNumber, __displayType, __wordType, __wordTranslation, __verseTranslations, __pageURL, __firstVerseOnPage } from '$utils/stores';

	// max verses to load if total verses in chapter are more than this
	const maxVersesThreshold = 10;

	let chapterData;

	// fetch verses whenever there's a change
	$: {
		// updating the chapter number in store and in window (for chapter navigation)
		__chapterNumber.set(+data.chapter);
		window.chapter = +data.chapter;

		const chapterTotalVerses = quranMetaData[$__chapterNumber].verses;

		chapterData = fetchChapterData($__chapterNumber);

		// getting start and end range incase we need to load specific verses
		(startVerse = parseURL()[0]), (endVerse = parseURL()[1]);

		// Note: the below is only executed when start is 1 and end is total chapter verses, that is, user did not opt for a specific range
		// if there were no specific range opted for, then start with 1 till threshold
		// else we just skip this check and load as per URL parameters
		if (startVerse === 1 && endVerse === chapterTotalVerses) {
			(startVerse = 1), (endVerse = chapterTotalVerses > maxVersesThreshold ? maxVersesThreshold : chapterTotalVerses);
		}

		// update the first verse on page
		__firstVerseOnPage.set(startVerse);

		// logging these for now to re-run the block on URL change
		console.log($__pageURL, $__displayType, $__wordType, $__wordTranslation, $__verseTranslations);
	}

	__currentPage.set('chapter');
</script>

<PageHead title={`${quranMetaData[$__chapterNumber].transliteration} (${$__chapterNumber})`} />

<div id="chapter-block">
	{#await chapterData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<Bismillah />

		<!-- need custom stylings if display type is 3 or 4 - continuous -->
		<div id="verses-block" class={displayOptions[`${$__displayType}`].customStyle}>
			<ChapterVerses {startVerse} {endVerse} />
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
