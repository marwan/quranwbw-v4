<script>
	export let startVerse;
	export let endVerse;
	export let isExampleVerse = undefined;

	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import Continuous from '$display/layouts/Continuous.svelte';
	import SideBySide from '$display/layouts/SideBySide.svelte';
	import { inview } from 'svelte-inview';
	import { quranMetaData } from '$data/quranMeta';
	import { __userSettings, __displayType, __chapterNumber, __chapterData, __chapterDataLoaded } from '$utils/stores';
	import { buttonOutlineClasses } from '$data/commonClasses';

	// load button click options
	const loadButtonOptions = {
		rootMargin: '2000px',
		unobserveOnEnter: true
	};

	const displayComponents = {
		1: { component: WordByWord },
		2: { component: Normal },
		3: { component: Continuous },
		4: { component: Continuous },
		5: { component: SideBySide }
	};

	const chapterTotalVerses = quranMetaData[$__chapterNumber].verses;
	let Chapter; // for the "Chapter" component
	let versesLoadType; // previous/next
	let nextVersesProps = {};
	let nextVersesStart;
	let nextVersesEnd;

	// function to load the next set of verses
	function loadNextVerses() {
		versesLoadType = 'next';

		// importing the same component to be re-used when the "Load Next Verses" button is pressed
		import('./Chapter.svelte').then((res) => (Chapter = res.default));

		// max verses to load when the next set is requested
		const versesToLoad = 5;

		// get the last verse number from last prop value
		const versesOnPage = document.getElementsByClassName('verse');
		const lastVerseOnPage = +versesOnPage[versesOnPage.length - 1].id.split(':')[1];

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
</script>

{#each Array.from(Array(endVerse + 1).keys()).slice(startVerse) as verse}
	<svelte:component this={displayComponents[JSON.parse($__userSettings).displaySettings.displayType].component} key={`${$__chapterNumber}:${verse}`} value={$__chapterData[`${$__chapterNumber}:${verse}`]} />
{/each}

<!-- if the verses are being shown to the user in a modal/drawer, then do not show the loadNextVersesButton -->
{#if isExampleVerse === undefined}
	<!-- only show the button when the last verse on page is less than total verses in chapter -->
	<!-- invisible for now... -->
	{#if endVerse < chapterTotalVerses && document.getElementById('loadVersesButton') === null}
		<div id="loadVersesButton" class="flex justify-center pt-6 pb-18 invisible" use:inview={loadButtonOptions} on:inview_enter={(event) => document.querySelector('#loadVersesButton > button').click()}>
			<button on:click={loadNextVerses} class="text-sm {buttonOutlineClasses}"> Continue Reading </button>
		</div>
	{/if}
{/if}

{#if versesLoadType === 'next'}
	<svelte:component this={Chapter} {...nextVersesProps} />
{/if}
