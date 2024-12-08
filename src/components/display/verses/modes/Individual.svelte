<script>
	export let startIndex, endIndex;

	import Spinner from '$svgs/Spinner.svelte';
	import Skeleton from '$ui/FlowbiteSvelte/skeleton/Skeleton.svelte';
	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import TranslationTransliteration from '$display/layouts/TranslationTransliteration.svelte';
	import { __displayType, __fontType, __wordTranslation, __wordTransliteration, __keysToFetch } from '$utils/stores';
	import { buttonOutlineClasses } from '$data/commonClasses';
	import { fetchChapterData } from '$utils/fetchData';
	import { inview } from 'svelte-inview';

	// Load button click options
	const loadButtonOptions = {
		rootMargin: '2000px',
		unobserveOnEnter: true
	};

	let Individual; // for the "Individual" component
	let nextVersesProps = {};
	let versesLoadType; // previous/next
	const allowedDisplayTypes = [1, 2, 7];

	const maxIndexesAllowedToRender = 5;
	let keysArray = $__keysToFetch.split(',');
	let keysArrayLength = keysArray.length - 1;

	// Set initial indexes
	if (startIndex === undefined) startIndex = 0;
	if (endIndex === undefined) endIndex = keysArrayLength > maxIndexesAllowedToRender ? maxIndexesAllowedToRender : keysArrayLength;

	const displayComponents = {
		1: { component: WordByWord },
		2: { component: Normal },
		7: { component: TranslationTransliteration }
	};

	// Only allow display type 1, 2, & 7, and don't save the layout in settings if not allowed
	if (!allowedDisplayTypes.includes($__displayType)) {
		__displayType.set(1);
	}

	function loadNextVerses() {
		import('./Individual.svelte').then((res) => (Individual = res.default));
		const lastRenderedId = document.querySelectorAll('.verse')[document.querySelectorAll('.verse').length - 1].id;
		let { nextStartIndex, nextEndIndex } = findKeyIndices($__keysToFetch, lastRenderedId, maxIndexesAllowedToRender);

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
</script>

{#each Array.from(Array(endIndex + 1).keys()).slice(startIndex) as index}
	{#await fetchChapterData({ chapter: keysArray[index].split(':')[0], reRenderWhenTheseUpdates: [$__fontType, $__wordTranslation, $__wordTransliteration] })}
		<div class="w-full"><Skeleton size="xxl" class="py-8 ml-auto direction-rtl" /></div>
	{:then data}
		{@const key = keysArray[index]}
		{@const verseValue = data[key]}
		<svelte:component this={displayComponents[$__displayType]?.component} key={keysArray[index]} value={verseValue} />
	{:catch error}
		<p>...</p>
	{/await}
{/each}

{#if endIndex < keysArrayLength && document.getElementById('loadVersesButton') === null}
	<!-- <div id="loadVersesButton" class="flex justify-center pt-6 pb-18 invisible" use:inview={loadButtonOptions} on:inview_enter={(event) => document.querySelector('#loadVersesButton > button').click()}> -->
	<div id="loadVersesButton" class="flex justify-center pt-6 pb-18">
		<button on:click={loadNextVerses} class="text-sm {buttonOutlineClasses}"> Continue Reading </button>
	</div>
{/if}

{#if versesLoadType === 'next'}
	<svelte:component this={Individual} verses={$__keysToFetch} {...nextVersesProps} />
{/if}
