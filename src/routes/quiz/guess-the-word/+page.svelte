<script>
	import PageHead from '$components/PageHead.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { __currentPage, __wordType, __quizCorrectAnswers, __quizWrongAnswers } from '$utils/stores';
	import { buttonElement, disabledElement } from '$data/commonStyles';
	import { updateSettings } from '$utils/updateSettings';
	import { Radio } from 'flowbite-svelte';
	import party from 'party-js';

	// icons
	import Check from '$svgs/Check.svelte';
	import Cross from '$svgs/Cross.svelte';

	let randomID = 1;
	let fetchData;
	let selection = null;
	let answerChecked = false;
	let isAnswerCorrect = null;
	let randomWord = Math.floor(Math.random() * 3) + 0;

	// fetch words
	$: {
		fetchData = (async () => {
			const response = await fetch(`${apiEndpoint}/random-words?randomID=${randomID}`);
			const data = await response.json();
			return data.data;
		})();
	}

	function checkAnswer() {
		answerChecked = true;
		isAnswerCorrect = selection === randomWord;

		if (isAnswerCorrect) {
			// confettis for correct answer? why not!
			party.confetti(document.body, {
				count: 80,
				spread: 100,
				size: 2
			});

			updateSettings({ type: 'quizCorrectAnswers', value: $__quizCorrectAnswers + 1 });
		} else updateSettings({ type: 'quizWrongAnswers', value: $__quizWrongAnswers + 1 });
	}

	function setRandomWord() {
		randomID = Math.floor(Math.random() * 9999999) + 1;
		randomWord = Math.floor(Math.random() * 3) + 0;
		selection = null;
		isAnswerCorrect = null;
		answerChecked = false;
	}

	__currentPage.set('Guess The Word');
</script>

<PageHead title={'Guess The Word'} />

<div class="space-y-12 my-6 md:my-8">
	<div id="word">
		{#await fetchData}
			<Spinner />
		{:then fetchData}
			<div class="flex flex-col space-y-8 justify-center">
				<!-- word -->
				<div class="flex flex-col space-y-4 text-center">
					<span class="text-5xl md:text-7xl arabic-font-1">{fetchData[randomWord].word_uthmani}</span>
					<span class="text-xs">{fetchData[randomWord].word_transliteration}</span>
				</div>

				<!-- options -->
				<div id="options" class="pt-8 theme-grayscale">
					<p class="mb-5 text-sm">Guess the correct translation:</p>
					<div class="grid gap-4 md:gap-6 w-full md:grid-cols-2">
						{#each Object.entries(fetchData) as [key, value]}
							<div class="rounded border border-gray-200 {selection === +key ? 'border-gray-400' : null} {answerChecked === true && selection !== +key ? disabledElement : null}">
								<Radio name="bordered" bind:group={selection} value={+key} class="w-full p-4 flex flex-row font-normal cursor-pointer">
									<div class="flex flex-row mr-auto ml-2">{fetchData[key].word_english}</div>

									<!-- check / cross icon -->
									{#if answerChecked === true && selection === +key}
										<div class="justify-end">
											<svelte:component this={selection === randomWord ? Check : Cross} size={6} />
										</div>
									{/if}
								</Radio>
							</div>
						{/each}
					</div>
				</div>

				<!-- answer-results -->
				{#if answerChecked === true && isAnswerCorrect !== null}
					<div id="answer-results" class="flex justify-center font-medium text-xl theme-grayscale">
						<span>
							{isAnswerCorrect ? 'Your answer was correct 😊' : 'Your answer was wrong 😢'}
						</span>
					</div>
				{/if}

				<!-- buttons -->
				<div id="buttons" class="flex flex-col space-y-8 justify-center w-full">
					<!-- confirm-button -->
					{#if !answerChecked}
						<div id="confirm-button" class="{selection === null || answerChecked === true ? disabledElement : null} w-full">
							<button class="{buttonElement} w-full" on:click={() => checkAnswer()}>Confirm</button>
						</div>
					{/if}

					<!-- skip-word-button -->
					<div id="skip-word-button">
						<button class="w-full" on:click={() => setRandomWord()}>{answerChecked ? 'Next' : 'Skip'} {@html '&#x2192;'}</button>
					</div>
				</div>

				<!-- correct / wrong answers so far -->
				<div id="quiz-stats" class="flex flex-row space-x-4 justify-center text-xs">
					<span>Correct: {$__quizCorrectAnswers}</span>
					<span>|</span>
					<span>Wrong: {$__quizWrongAnswers}</span>
				</div>
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>
</div>
