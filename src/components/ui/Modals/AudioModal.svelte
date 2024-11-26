<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __userSettings, __audioModalVisible } from '$utils/stores';
	import { playVerseAudio, playWordAudio, updateAudioSettings, setVersesToPlay } from '$utils/audioController';
	import { disabledClasses, buttonClasses, selectedRadioClasses } from '$data/commonClasses';
	import { term } from '$utils/terminologies';
	import { getModalTransition } from '$utils/getModalTransition';

	const radioClasses = 'inline-flex justify-between items-center py-2 px-4 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 theme-grayscale';
	let invalidStartVerse = false;
	let invalidEndVerse = false;
	let invalidTimesToRepeat = false;

	$: {
		if ($__audioModalVisible) {
			const thisChapter = $__audioSettings.playingKey.split(':')[0];
			const thisVerse = $__audioSettings.playingKey.split(':')[1];
			const versesInChapter = quranMetaData[thisChapter].verses;
			const startVerse = $__audioSettings.startVerse;
			const endVerse = $__audioSettings.endVerse;
			const timesToRepeat = $__audioSettings.timesToRepeat;

			// allow only playThisVerse option for non-chapter pages
			if (!['chapter', 'page'].includes($__currentPage)) $__audioSettings.audioRange = 'playThisVerse';

			// this verse
			if ($__audioSettings.audioRange === 'playThisVerse') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: thisVerse });
			}

			// from here
			else if ($__audioSettings.audioRange === 'playFromHere') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: versesInChapter, audioRange: 'playFromHere' });
			}

			// range
			else if ($__audioSettings.audioRange === 'playRange') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: startVerse, endVerse: endVerse });
			}

			// make the endVerse same as startVerse initially
			if (endVerse === undefined) $__audioSettings.endVerse = startVerse;

			// checking for abnormal values in order to disable the play button
			invalidStartVerse = startVerse < 1 || startVerse > versesInChapter ? true : false;
			invalidEndVerse = endVerse < 1 || endVerse > versesInChapter || endVerse < startVerse ? true : false;
			invalidTimesToRepeat = timesToRepeat < 1 || timesToRepeat > 20 || isNaN(timesToRepeat) ? true : false;
		}
	}

	function playButtonHandler() {
		// verse
		if ($__audioSettings.audioType === 'verse') {
			playVerseAudio({
				key: `${window.versesToPlayArray[0]}`,
				timesToRepeat: $__audioSettings.audioRange,
				language: 'arabic'
			});
		}

		// word
		else if ($__audioSettings.audioType === 'word') {
			playWordAudio({
				key: `${$__audioSettings.playingKey}:1`,
				playAllWords: true
			});
		}

		__audioModalVisible.set(false);
	}
</script>

<Modal id="audioModal" bind:open={$__audioModalVisible} transitionParams={getModalTransition('bottom')} size="xs" class="!rounded-b-none md:!rounded-3xl !text-black theme" bodyClass="p-6" placement="center" position="bottom" autoclose outsideclose>
	<!-- Modal content -->
	<div class="flex flex-row space-x-4 mb-4 text-xl" style="margin-top: 0px;">
		<h3 id="audio-modal-title" class="font-medium">{quranMetaData[$__audioSettings.playingChapter || 1].transliteration}, {$__audioSettings.playingKey}</h3>
	</div>
	<div class="flex flex-col">
		<!-- verse or words -->
		<div class="flex flex-col space-y-4 py-4">
			<span class="text-sm">Either play the whole {term('verse')} or individual words.</span>
			<div class="flex flex-row space-x-2">
				<!-- play verse -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="verse" custom>
						<div class="{radioClasses} {$__audioSettings.audioType === 'verse' && selectedRadioClasses}">
							<div class="w-full">Play {term('verse')}</div>
						</div>
					</Radio>
				</div>
				<!-- play word -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="word" custom>
						<div class="{radioClasses} {$__audioSettings.audioType === 'word' && selectedRadioClasses}">
							<div class="w-full">Play Words</div>
						</div>
					</Radio>
				</div>
			</div>

			{#if $__audioSettings.audioType === 'word'}
				<span class="flex flex-col space-y-3 text-sm pt-2 opacity-70">
					<span>This feature allows you to hear each word in the {term('verse')} individually. To listen to specific words, simply click on them. Please note, this option plays the words sequentially without accounting for the connecting silent letters between them. For a seamless and accurate recitation, it is recommended to play the entire {term('verse')}.</span>
				</span>
			{/if}
		</div>

		<!-- single or range -->
		<div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t {$__audioSettings.audioType === 'word' ? 'hidden' : null}">
			<span class="text-sm">Your preferred range.</span>
			<div class="flex flex-row space-x-2">
				<!-- play this verse -->
				<div class="flex items-center {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playThisVerse" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playThisVerse' && selectedRadioClasses}">
							<div class="w-full">This {term('verse')}</div>
						</div>
					</Radio>
				</div>
				<!-- play from here -->
				<div class="flex items-center {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playFromHere" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playFromHere' && selectedRadioClasses}">
							<div class="w-full">From Here</div>
						</div>
					</Radio>
				</div>
				<!-- play range -->
				<div class="flex items-center {!['chapter'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playRange" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playRange' && selectedRadioClasses}">
							<div class="w-full">From / Till</div>
						</div>
					</Radio>
				</div>
			</div>
		</div>

		<!-- audio range options -->
		{#if $__currentPage === 'chapter' && $__audioSettings.audioType === 'verse'}
			<div id="audio-range-options" class={$__audioSettings.audioRange === 'playRange' ? 'block' : 'hidden'}>
				<!-- from / till -->
				<div class="flex flex-col space-y-4 py-4 border-t">
					<!-- <span class="text-xs  ">Select the range of verses or words to be played.</span> -->
					<div class="flex flex-row space-x-4">
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm mr-2">From {term('verse')}</span>
							<input type="number" min="1" max={quranMetaData[$__chapterNumber].verses} bind:value={$__audioSettings.startVerse} id="startVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="start" />
						</div>
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm mr-2">Till {term('verse')}</span>
							<input type="number" min={$__audioSettings.startVerse} max={quranMetaData[$__chapterNumber].verses} bind:value={quranMetaData[$__chapterNumber].verses} id="endVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="end" />
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- repeat times -->
	{#if $__audioSettings.audioType === 'verse'}
		<div class="flex flex-col space-y-4 py-4 border-t">
			<div class="flex flex-row space-x-4">
				<div class="flex flex-row space-x-2">
					<span class="m-auto text-sm mr-2">Repeat each {term($__audioSettings.audioType)}</span>
					<input id="timesToRepeat" type="number" bind:value={$__audioSettings.timesToRepeat} min="1" max="20" on:change={updateAudioSettings} class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" />
					<span class="m-auto text-sm">{$__audioSettings.timesToRepeat > 1 ? 'times' : 'time'} </span>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-4">
		<button on:click={playButtonHandler} class="w-full mr-2 {buttonClasses} {invalidStartVerse || invalidEndVerse || invalidTimesToRepeat ? disabledClasses : null}">Play</button>
	</div>
</Modal>
