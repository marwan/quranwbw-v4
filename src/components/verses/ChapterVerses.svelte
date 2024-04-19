<!-- component to load verses from a SINGLE chapter, unlike supplications and bookmarks which are random -->
<script>
	export let startVerse,
		endVerse,
		isExampleVerse = undefined;

	import { inview } from 'svelte-inview';

	import WBWDisplay from '$displays/WBWDisplay.svelte';
	import NormalDisplay from '$displays/NormalDisplay.svelte';
	import ContinuousDisplay from '$displays/ContinuousDisplay.svelte';
	import SideBySideDisplay from '$displays/SideBySideDisplay.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __displayType, __chapterNumber, __chapterData } from '$utils/stores';
	import { buttonElement } from '$data/commonStyles';

	// load button click options
	const loadButtonOptions = {
		rootMargin: '2000px',
		unobserveOnEnter: true
	};

	const displayComponents = {
		1: { component: WBWDisplay },
		2: { component: NormalDisplay },
		3: { component: ContinuousDisplay },
		4: { component: ContinuousDisplay },
		5: { component: SideBySideDisplay }
	};

	const chapterTotalVerses = quranMetaData[$__chapterNumber].verses;

	let ChapterVerses; // for the "ChapterVerses" component

	let versesLoadType; // previous/next

	// =================================================
	// function to load previous verses
	let previousVersesProps = {},
		previousVersesStart,
		previousVersesEnd;

	// function to load the previous set of verses
	function loadPreviousVerses() {
		versesLoadType = 'previous';

		// importing the same component to be re-used when the "Load Previous Verses" button is pressed
		import('./ChapterVerses.svelte').then((res) => (ChapterVerses = res.default));

		// get the last verse number from last prop value
		const firstVerseOnPage = startVerse;

		// remove the existing button
		document.getElementById('loadPreviousVersesButton').remove();

		// define the new starting and ending range
		(previousVersesStart = firstVerseOnPage - 1), (previousVersesEnd = previousVersesStart);

		// setting the nextVersesProps
		previousVersesProps = {
			startVerse: previousVersesStart,
			endVerse: previousVersesEnd
		};
	}
	// =================================================

	// =================================================
	// function to load next verses
	let nextVersesProps = {},
		nextVersesStart,
		nextVersesEnd;

	// function to load the next set of verses
	function loadNextVerses() {
		versesLoadType = 'next';

		// importing the same component to be re-used when the "Load Next Verses" button is pressed
		import('./ChapterVerses.svelte').then((res) => (ChapterVerses = res.default));

		// max verses to load when the next set is requested
		const versesToLoad = 10;

		// get the last verse number from last prop value
		const lastVerseOnPage = endVerse;

		// remove the existing button
		document.getElementById('loadVersesButton').remove();

		// define the new starting and ending range
		(nextVersesStart = lastVerseOnPage + 1), (nextVersesEnd = nextVersesStart + versesToLoad);

		// if the end verse set above is greater than total verses, then set it as total verses
		if (nextVersesEnd > chapterTotalVerses) nextVersesEnd = chapterTotalVerses;

		// setting the nextVersesProps
		nextVersesProps = {
			startVerse: nextVersesStart,
			endVerse: nextVersesEnd
		};
	}
	// =================================================
</script>

<!-- move the load button to Chapter component -->
<!-- {#if startVerse > 1 && document.getElementById("loadPreviousVersesButton") === null}
  <div id="loadPreviousVersesButton" class="flex justify-center pt-8 pb-6">
    <button on:click={loadPreviousVerses} class="text-sm {buttonElement}"> Load Previous Verses </button>
  </div>
{/if}

{#if versesLoadType === "previous"}
  <svelte:component this={ChapterVerses} {...previousVersesProps} />
{/if} -->

{#each Array.from(Array(endVerse + 1).keys()).slice(startVerse) as verse}
	<svelte:component this={displayComponents[$__displayType].component} key={`${$__chapterNumber}:${verse}`} value={$__chapterData[`${$__chapterNumber}:${verse}`]} />
{/each}

<!-- if the verses are being shown to the user in a modal/drawer, then do not show the loadNextVersesButton -->
{#if isExampleVerse === undefined}
	<!-- only show the button when the last verse on page is less than total verses in chapter -->
	{#if endVerse < chapterTotalVerses && document.getElementById('loadVersesButton') === null}
		<div id="loadVersesButton" class="flex justify-center pt-6 pb-14" use:inview={loadButtonOptions} on:inview_enter={(event) => document.querySelector('#loadVersesButton > button').click()}>
			<button on:click={loadNextVerses} class="text-sm {buttonElement}"> Load Next Verses </button>
		</div>
	{/if}
{/if}

{#if versesLoadType === 'next'}
	<svelte:component this={ChapterVerses} {...nextVersesProps} />
{/if}
