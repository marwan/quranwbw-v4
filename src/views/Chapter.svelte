<script>
	// props from router
	export let chapter, startVerse, endVerse;

	import PageMeta from '$components/PageMeta.svelte';
	import ChapterVerses from '$verses/ChapterVerses.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { parseURL } from '$utils/parseURL';
	import { fetchChapterData } from '$utils/fetchChapterData';
	import { quranMetaData, bismillahTypes } from '$data/quranMeta';
	import { displayOptions } from '$data/options';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { updateSettings } from '$utils/updateSettings';
	import { __currentPage, __chapterNumber, __displayType, __wordType, __wordTranslation, __verseTranslations, __pageURL } from '$utils/stores';
	// import { debounce } from '$utils/debounce';
	// import { toggleNavbar } from '$utils/toggleNavbar';

	// max verses to load if total verses in chapter are more than this
	const maxVersesThreshold = 10;

	let chapterData;

	// fetch verses whenever there's a change
	$: {
		// updating the chapter number in store and in localStorage (for chapter navigation)
		__chapterNumber.set(+chapter);
		updateSettings({ type: 'chapter', value: +chapter });

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

		// logging these for now to re-run the block on URL change
		console.log($__pageURL, $__displayType, $__wordType, $__wordTranslation, $__verseTranslations);
	}

	// toggle bottom nav on scroll
	// document.body.addEventListener(
	// 	'scroll',
	// 	() => {
	// 		// toggle the navbars based on the scroll direction
	// 		debounce(toggleNavbar, 0);
	// 	},
	// 	{
	// 		capture: true,
	// 		passive: true
	// 	}
	// );

	__currentPage.set('chapter');
</script>

<PageMeta title={`${quranMetaData[$__chapterNumber].transliteration} (${$__chapterNumber})`} />

<div class="pt-8">
	{#await chapterData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<!-- we have different Bismillah for chapter 2 and the rest -->
		{#if ![1, 9].includes($__chapterNumber)}
			<div class="invisible bismillah flex flex-col text-center flex-wrap pt-4 px-6 space-y-4 text-xl md:text-2xl block theme-palette-normal font-filter opacity-60">
				{#if $__chapterNumber === 2}
					{bismillahTypes[1]}
				{:else if ![1, 9, 2].includes($__chapterNumber)}
					{bismillahTypes[2]}
				{/if}
			</div>
		{/if}

		<!-- need custom stylings if display type is 3 or 4 - continuous -->
		<div id="verses-block" class={displayOptions[`${$__displayType}`].customStyle}>
			<ChapterVerses {startVerse} {endVerse} />
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
