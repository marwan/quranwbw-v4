<script>
	export let data, startIndex, endIndex;

	console.log({ startIndex, endIndex });

	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import TranslationTransliteration from '$display/layouts/TranslationTransliteration.svelte';
	import { __displayType } from '$utils/stores';

	let Individual; // for the "Individual" component
	let nextVersesProps = {};
	let versesLoadType; // previous/next
	let nextStartIndex;
	let nextEndIndex;
	const allowedDisplayTypes = [1, 2, 7];

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
		versesLoadType = 'next';

		import('./Individual.svelte').then((res) => (Individual = res.default));
		const versesToLoad = 5;

		const lastRenderedId = document.querySelectorAll('.verse')[document.querySelectorAll('.verse').length - 1].id;
		const keys = Object.keys(data);
		const requiredIndex = keys.indexOf(lastRenderedId);

		nextStartIndex = keys.indexOf(keys[requiredIndex + 1]);
		nextEndIndex = keys.indexOf(keys[requiredIndex + versesToLoad]);

		console.log({
			lastRenderedId,
			nextStartIndex,
			nextEndIndex
		});

		// Remove the existing button
		document.getElementById('loadVersesButton').remove();

		// Setting the nextVersesProps
		nextVersesProps = {
			startIndex: nextStartIndex,
			endIndex: nextEndIndex
		};
	}
</script>

{#each Array.from(Array(endIndex).keys()).slice(startIndex) as verse}
	{@const verseKey = Object.keys(data)[verse]}
	{@const verseValue = data[verseKey]}
	<svelte:component this={displayComponents[$__displayType]?.component} key={verseKey} value={verseValue} />
{/each}

<div id="loadVersesButton" class="flex justify-center pt-6 pb-18">
	<button on:click={loadNextVerses} class="text-sm"> Load Next Verses </button>
</div>

{#if versesLoadType === 'next'}
	<svelte:component this={Individual} {data} {...nextVersesProps} />
{/if}
