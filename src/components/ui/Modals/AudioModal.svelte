<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Checkbox from '$ui/FlowbiteSvelte/forms/Checkbox.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __userSettings, __audioModalVisible, __keysToFetch, __savedPlaySettings } from '$utils/stores';
	import { updateAudioSettings, setVersesToPlay, playButtonHandler } from '$utils/audioController';
	import { disabledClasses, buttonClasses, selectedRadioOrCheckboxClasses } from '$data/commonClasses';
	import { term } from '$utils/terminologies';
	import { getModalTransition } from '$utils/getModalTransition';
	import { updateSettings } from '$utils/updateSettings';

	// CSS classes for radio buttons
	const radioClasses = `inline-flex justify-between items-center py-2 px-4 w-full ${window.theme('bgMain')} rounded-lg border ${window.theme('border')} cursor-pointer ${window.theme('checked')} ${window.theme('hover')}`;
	let invalidStartVerse = false;
	let invalidEndVerse = false;
	let invalidTimesToRepeat = false;

	// Update settings and validate verses when audio modal is visible
	$: if ($__audioModalVisible) {
		const [thisChapter, thisVerse] = $__audioSettings.playingKey.split(':');
		const versesInChapter = quranMetaData[thisChapter].verses;
		const { startVerse, endVerse, timesToRepeat, audioRange } = $__audioSettings;

		// Set verses to play based on audio range setting
		switch (audioRange) {
			case 'playThisVerse':
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: thisVerse });
				break;
			case 'playFromHere':
				// On the following pages, we already have the keys stored in "__keysToFetch",
				// So we just push all the keys in setVersesToPlay from the current key onwards
				if (['supplications', 'bookmarks', 'juz'].includes($__currentPage)) {
					const removeKeysBefore = (string, key) => string.split(',').slice(string.split(',').indexOf(key)).join(',');
					setVersesToPlay({ verses: removeKeysBefore($__keysToFetch, $__audioSettings.playingKey).split(',') });
				}

				// Else on the chapter page, we manually set the start and end verses
				else setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: versesInChapter, audioRange: 'playFromHere' });
				break;
			case 'playRange':
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse, endVerse: versesInChapter });
				break;
		}

		// Initialize endVerse as startVerse if undefined
		$__audioSettings.endVerse ??= startVerse;

		// Validate verse and repeat times
		invalidStartVerse = startVerse < 1 || startVerse > versesInChapter;
		invalidEndVerse = endVerse < 1 || endVerse > versesInChapter || endVerse < startVerse;
		invalidTimesToRepeat = timesToRepeat < 1 || timesToRepeat > 20 || isNaN(timesToRepeat);
	}

	// Allow only "playThisVerse" option for non-chapter pages
	$: if ($__currentPage !== 'chapter' && $__audioSettings.audioRange === 'playRange') {
		$__audioSettings.audioRange = 'playThisVerse';
	}

	// // Get the saved settings only if the user had opted to remember them
	// $: if ($__savedPlaySettings && $__savedPlaySettings.rememberSettings) {
	// 	savedPlaySettingsHandler('get');
	// }

	// // Update the selected settings only if the user had opted to remember them
	// $: if ($__audioSettings && $__savedPlaySettings) {
	// 	savedPlaySettingsHandler('save');
	// }

	// Get the saved settings only if the user had opted to remember them
	// $: if ($__audioSettings) {
	// 	if ($__audioSettings.rememberSettings === true) {
	// 		savedPlaySettingsHandler('get');
	// 	}
	// }

	// Update the selected settings only if the user had opted to remember them
	$: if ($__audioSettings && $__audioSettings.rememberSettings === true) {
		savedPlaySettingsHandler('save');
	}

	$: console.log($__audioSettings);

	// Get or save the audio settings
	function savedPlaySettingsHandler(action) {
		// Get from localStorage/store
		if (action === 'get') {
			$__audioSettings.audioType = $__savedPlaySettings.audioType;
			$__audioSettings.audioRange = $__savedPlaySettings.audioRange;
			$__audioSettings.language = $__savedPlaySettings.language;
			$__audioSettings.timesToRepeat = $__savedPlaySettings.timesToRepeat;
			$__audioSettings.rememberSettings = $__savedPlaySettings.rememberSettings;
			console.log('getting audio settings...');
		}
		// Save in localStorage else
		if (action === 'save') {
			$__savedPlaySettings.audioType = $__audioSettings.audioType;
			$__savedPlaySettings.audioRange = $__audioSettings.audioRange;
			$__savedPlaySettings.language = $__audioSettings.language;
			$__savedPlaySettings.timesToRepeat = $__audioSettings.timesToRepeat;
			$__savedPlaySettings.rememberSettings = $__audioSettings.rememberSettings;
			updateSettings({ type: 'savedPlaySettings', value: { audioType: $__savedPlaySettings.audioType, audioRange: $__savedPlaySettings.audioRange, language: $__savedPlaySettings.language, timesToRepeat: $__savedPlaySettings.timesToRepeat, rememberSettings: $__savedPlaySettings.rememberSettings } });
			console.log('saving audio settings...');
		}
	}
</script>

<Modal id="audioModal" bind:open={$__audioModalVisible} transitionParams={getModalTransition('bottom')} size="xs" class="!rounded-b-none md:!rounded-3xl !theme" bodyClass="p-6" placement="center" position="bottom" autoclose outsideclose>
	<!-- Modal content -->
	<div class="flex flex-row space-x-4 mb-4 text-xl" style="margin-top: 0px;">
		<h3 id="audio-modal-title" class="font-medium">{quranMetaData[$__audioSettings.playingChapter || 1].transliteration}, {$__audioSettings.playingKey}</h3>
	</div>
	<div class="flex flex-col">
		<!-- verse or words -->
		<div class="flex flex-col space-y-4 py-4">
			<span class="text-sm">Playback Options</span>
			<div class="flex flex-row space-x-2">
				<!-- play verse -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="verse" custom>
						<div class="{radioClasses} {$__audioSettings.audioType === 'verse' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">Play {term('verse')}</div>
						</div>
					</Radio>
				</div>
				<!-- play word -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="word" custom>
						<div class="{radioClasses} {$__audioSettings.audioType === 'word' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">Play Words</div>
						</div>
					</Radio>
				</div>
			</div>

			{#if $__audioSettings.audioType === 'word'}
				<span class="flex flex-col space-y-3 text-xs pt-2 opacity-70">
					<span>This feature allows you to hear each word in the {term('verse')} individually. To listen to specific words, simply click on them. Please note, this option plays the words sequentially without accounting for the connecting silent letters between them. For a seamless and accurate recitation, it is recommended to play the entire {term('verse')}.</span>
				</span>
			{/if}
		</div>

		<!-- recitation language -->
		<div id="recitation-language-block" class="flex flex-col space-y-4 py-4 border-t {window.theme('border')} {$__audioSettings.audioType === 'word' ? 'hidden' : null}">
			<span class="text-sm">Preferred Language</span>
			<div class="flex flex-row space-x-2">
				<!-- play arabic only -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.language} value="arabic" custom>
						<div class="{radioClasses} {$__audioSettings.language === 'arabic' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">Arabic</div>
						</div>
					</Radio>
				</div>
				<!-- play translation only -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.language} value="translation" custom>
						<div class="{radioClasses} {$__audioSettings.language === 'translation' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">Translation</div>
						</div>
					</Radio>
				</div>
				<!-- play both -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.language} value="both" custom>
						<div class="{radioClasses} {$__audioSettings.language === 'both' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">Both</div>
						</div>
					</Radio>
				</div>
			</div>
		</div>

		<!-- single or range -->
		<div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t {window.theme('border')} {$__audioSettings.audioType === 'word' ? 'hidden' : null}">
			<span class="text-sm">Preferred Range</span>
			<div class="flex flex-row space-x-2">
				<!-- play this verse -->
				<div class="flex items-center {!['chapter', 'mushaf', 'supplications', 'bookmarks', 'juz'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playThisVerse" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playThisVerse' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">This {term('verse')}</div>
						</div>
					</Radio>
				</div>
				<!-- play from here -->
				<div class="flex items-center {!['chapter', 'mushaf', 'supplications', 'bookmarks', 'juz'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playFromHere" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playFromHere' && selectedRadioOrCheckboxClasses}">
							<div class="w-full">From Here</div>
						</div>
					</Radio>
				</div>
				<!-- play range -->
				<div class="flex items-center {!['chapter'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playRange" custom>
						<div class="{radioClasses} {$__audioSettings.audioRange === 'playRange' && selectedRadioOrCheckboxClasses}">
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
				<div class="flex flex-col space-y-4 py-4 border-t {window.theme('border')}">
					<!-- <span class="text-xs  ">Select the range of verses or words to be played.</span> -->
					<div class="flex flex-row space-x-4">
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm mr-2">From {term('verse')}</span>
							<input type="number" min="1" max={quranMetaData[$__chapterNumber].verses} bind:value={$__audioSettings.startVerse} id="startVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="bg-transparent w-16 text-xs rounded-3xl border {window.theme('border')} {window.theme('input')} {window.theme('placeholder')} block p-2.5 mb-0" placeholder="start" />
						</div>
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm mr-2">Till {term('verse')}</span>
							<input
								type="number"
								min={$__audioSettings.startVerse}
								max={quranMetaData[$__chapterNumber].verses}
								bind:value={quranMetaData[$__chapterNumber].verses}
								id="endVerse"
								on:change={updateAudioSettings}
								aria-describedby="helper-text-explanation"
								class="bg-transparent w-16 text-xs rounded-3xl border {window.theme('border')} {window.theme('input')} {window.theme('placeholder')} {window.theme('placeholder')} block p-2.5 mb-0"
								placeholder="end"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- repeat times -->
	{#if $__audioSettings.audioType === 'verse'}
		<div class="flex flex-col space-y-4 py-4 border-t {window.theme('border')}">
			<div class="flex flex-row space-x-4">
				<div class="flex flex-row space-x-2">
					<span class="m-auto text-sm mr-2">Repeat each {term($__audioSettings.audioType)}</span>
					<input id="timesToRepeat" type="number" bind:value={$__audioSettings.timesToRepeat} min="1" max="20" on:change={updateAudioSettings} class="bg-transparent w-16 text-xs rounded-3xl border {window.theme('border')} {window.theme('input')} block p-2.5 mb-0" />
					<span class="m-auto text-sm">{$__audioSettings.timesToRepeat > 1 ? 'times' : 'time'} </span>
				</div>
			</div>
		</div>
	{/if}

	<Checkbox checked={$__audioSettings.rememberSettings} on:click={() => ($__audioSettings.rememberSettings = !$__audioSettings.rememberSettings)} class="space-x-2 pb-2 font-normal {window.theme('bgMain')}">
		<span>Remember Settings</span>
	</Checkbox>

	<div class="mt-4">
		<button on:click={() => playButtonHandler($__audioSettings.playingKey)} class="w-full mr-2 {buttonClasses} {invalidStartVerse || invalidEndVerse || invalidTimesToRepeat ? disabledClasses : null}">Play</button>
	</div>
</Modal>
