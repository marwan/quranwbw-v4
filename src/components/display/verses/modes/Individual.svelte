<script>
	export let startIndex, endIndex;

	import Spinner from '$svgs/Spinner.svelte';
	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import TranslationTransliteration from '$display/layouts/TranslationTransliteration.svelte';
	import Bismillah from '$display/Bismillah.svelte';
	import ChapterHeader from '$display/ChapterHeader.svelte';
	import { __displayType, __fontType, __wordTranslation, __wordTransliteration, __keysToFetch, __currentPage } from '$utils/stores';
	import { buttonOutlineClasses } from '$data/commonClasses';
	import { fetchChapterData } from '$utils/fetchData';
	import { isValidVerseKey } from '$utils/validateKey';
	import { goto } from '$app/navigation';
	import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';

	const allowedDisplayTypes = [1, 2, 7];
	const displayComponents = {
		1: { component: WordByWord },
		2: { component: Normal },
		7: { component: TranslationTransliteration }
	};

	const maxIndexesAllowedToRender = 5;

	// Load button click options
	const loadButtonOptions = {
		rootMargin: '2000px',
		unobserveOnEnter: true
	};

	const params = new URLSearchParams(window.location.search);
	let Individual; // for the "Individual" component
	let nextVersesProps = {};
	let versesLoadType; // previous/next
	let keysArray = $__keysToFetch.split(',');
	let keysArrayLength = keysArray.length - 1;
	let nextStartIndex, nextEndIndex;
	let renderedVerses = 0;
	let showContinueReadingButton = false;
	let dataMap = {};

	// Checking if a start key was provided
	if (params.get('startKey') !== undefined || params.get('startKey') !== null) {
		try {
			let keyToStartWith = params.get('startKey');

			if (isValidVerseKey(keyToStartWith)) {
				goto(removeParam('startKey'), { replaceState: false });
				startIndex = getIndexOfKey(keyToStartWith);
				endIndex = keysArrayLength > maxIndexesAllowedToRender ? startIndex + maxIndexesAllowedToRender : keysArrayLength;
			}
		} catch (error) {
			// ...
		}
	}

	// Set initial indexes if nothing was set earlier
	if (startIndex === undefined) startIndex = 0;
	if (endIndex === undefined) endIndex = keysArrayLength > maxIndexesAllowedToRender ? startIndex + maxIndexesAllowedToRender : keysArrayLength;
	// Basic checks
	if (startIndex < 0) startIndex = 0;
	if (endIndex > keysArrayLength) endIndex = keysArrayLength;

	// Only allow display type 1, 2, & 7, and don't save the layout in settings if not allowed
	if (!allowedDisplayTypes.includes($__displayType)) {
		__displayType.set(1);
	}

	function loadNextVerses() {
		try {
			import('./Individual.svelte').then((res) => (Individual = res.default));
			const lastRenderedId = document.querySelectorAll('.verse')[document.querySelectorAll('.verse').length - 1].id;

			nextStartIndex = findKeyIndices($__keysToFetch, lastRenderedId, maxIndexesAllowedToRender).startIndex;
			nextEndIndex = findKeyIndices($__keysToFetch, lastRenderedId, maxIndexesAllowedToRender).endIndex;

			// don't let the end index be more than the data object's length
			if (nextEndIndex === -1) nextEndIndex = Object.keys($__keysToFetch).length;

			// Remove the existing button
			document.getElementById('loadVersesButton').remove();

			// Setting the nextVersesProps
			nextVersesProps = {
				startIndex: nextStartIndex,
				endIndex: nextEndIndex
			};

			versesLoadType = 'next';
		} catch (error) {
			console.log(error);
		}
	}

	function findKeyIndices(keyString, key, threshold) {
		// Convert the comma-separated string into an array
		let keys = keyString.split(',');

		// Find the index of the given key
		let keyIndex = keys.indexOf(key);

		if (keyIndex === -1) {
			return { startIndex: -1, endIndex: -1 };
		}

		// Calculate start and end indices
		let startIndex = keyIndex + 1;
		let endIndex = Math.min(keyIndex + threshold, keys.length - 1);

		return { startIndex, endIndex };
	}

	function getIndexOfKey(key, keysString = $__keysToFetch) {
		const keysArray = keysString.split(',');
		let index = keysArray.indexOf(key);
		if (index === -1) index = 0;
		return index;
	}

	function removeParam(param) {
		const parsedUrl = new URL(window.location.href);
		parsedUrl.searchParams.delete(param);
		return parsedUrl.toString();
	}

	function versesRendered() {
		renderedVerses += 1;

		if (renderedVerses === endIndex + 1 - startIndex) {
			showContinueReadingButton = true;
		}
	}

	// This function fetches the data for all chapters within the specified startIndex and endIndex range, stores the data in a dataMap object,
	// and then renders the fetched data on the page.
	// Instead of rendering each chapter immediately upon retrieval, the function waits until all the chapter data is fetched,
	// ensuring the complete data set is rendered at once, improving the user experience by avoiding partial rendering.
	async function fetchAllChapterData() {
		const promises = Array.from(Array(endIndex + 1).keys())
			.slice(startIndex)
			.map((index) =>
				fetchChapterData({
					chapter: keysArray[index].split(':')[0],
					reRenderWhenTheseUpdates: [$__fontType, $__wordTranslation, $__wordTransliteration]
				})
			);

		const results = await Promise.all(promises);

		results.forEach((data, i) => {
			const index = startIndex + i;
			const key = keysArray[index];
			dataMap[key] = data[key];
		});
	}

	onMount(() => {
		fetchAllChapterData();
	});
</script>

{#if Object.keys(dataMap).length === endIndex - startIndex + 1}
	{#each Array.from(Array(endIndex + 1).keys()).slice(startIndex) as index}
		{@const key = keysArray[index]}
		{@const value = dataMap[key]}

		<!-- Only show Bismillah when its the Juz page, because the verses there can continue to next chapters -->
		{#if $__currentPage === 'juz' && +key.split(':')[1] === 1}
			{@const chapter = +key.split(':')[0]}
			<div class="mt-4">
				<ChapterHeader {chapter} />
				<Bismillah {chapter} startVerse={+key.split(':')[1]} />
			</div>
		{/if}
		<section use:versesRendered>
			<svelte:component this={displayComponents[$__displayType]?.component} {key} {value} />
		</section>
	{/each}
{:else}
	<Spinner />
{/if}

{#if showContinueReadingButton}
	{#if endIndex < keysArrayLength && document.getElementById('loadVersesButton') === null}
		<div id="loadVersesButton" class="flex justify-center pt-6 pb-18" use:inview={loadButtonOptions} on:inview_enter={(event) => document.querySelector('#loadVersesButton > button').click()}>
			<button on:click={loadNextVerses} class="text-sm {buttonOutlineClasses}"> Continue Reading </button>
		</div>
	{/if}
{/if}

{#if versesLoadType === 'next'}
	<svelte:component this={Individual} {...nextVersesProps} />
{/if}
