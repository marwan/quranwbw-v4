<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Radio from '$ui/flowbite-svelte/forms/Radio.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __userSettings, __audioModalVisible } from '$utils/stores';
	import { playVerseAudio, playWordAudio, updateAudioSettings, setVersesToPlay } from '$utils/audioController';
	import { disabledClasses, buttonClasses } from '$data/commonClasses';
	import { term } from '$utils/terminologies';

	$: {
		if ($__audioModalVisible) {
			const thisChapter = $__audioSettings.playingKey.split(':')[0];
			const thisVerse = $__audioSettings.playingKey.split(':')[1];

			// allow only playThisVerse option for non-chapter pages
			if (!['chapter', 'page'].includes($__currentPage)) $__audioSettings.audioRange = 'playThisVerse';

			// this verse
			if ($__audioSettings.audioRange === 'playThisVerse') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: thisVerse });
			}

			// from here
			else if ($__audioSettings.audioRange === 'playFromHere') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: thisVerse, endVerse: quranMetaData[thisChapter].verses, audioRange: 'playFromHere' });
			}

			// range
			else if ($__audioSettings.audioRange === 'playRange') {
				setVersesToPlay({ location: 'verseOptionsOrModal', chapter: thisChapter, startVerse: $__audioSettings.startVerse, endVerse: $__audioSettings.endVerse });
			}

			// make the endVerse same as startVerse initially
			if ($__audioSettings.endVerse === undefined) $__audioSettings.endVerse = $__audioSettings.startVerse;
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

<Modal id="audioModal" bind:open={$__audioModalVisible} size="xs" class="rounded-3xl !text-black theme" bodyClass="p-6" placement="center" autoclose outsideclose>
	<!-- Modal content -->
	<div class="flex flex-row space-x-4 mb-4 text-xl" style="margin-top: 0px;">
		<h3 id="audio-modal-title" class="font-medium">{quranMetaData[$__audioSettings.playingChapter || 1].transliteration}, {$__audioSettings.playingKey}</h3>
	</div>
	<div class="flex flex-col">
		<!-- verse or words -->
		<div class="flex flex-col space-y-4 py-4">
			<span class="text-xs opacity-70">Either play the whole {term('verse')} or individual words.</span>
			<div class="flex flex-row space-x-4">
				<!-- play verse -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="verse" class="text-black">Play {term('verse')}</Radio>
				</div>
				<!-- play word -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="word" class="text-black">Play Words</Radio>
				</div>
			</div>

			{#if $__audioSettings.audioType === 'word'}
				<span class="flex flex-col space-y-3 text-xs pt-2 opacity-70">
					<span>This option would play all the words in the {term('verse')} one by one. If you would like to listen to individual words, click on them.</span>
					<span>Note that this option just plays the words in sequence without considering the connecting silent letters between the words. For correct and connected recitation, play the complete {term('verse')} instead.</span>
				</span>
			{/if}
		</div>

		<!-- single or range -->
		<div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700 {$__audioSettings.audioType === 'word' ? 'hidden' : null}">
			<span class="text-xs opacity-70">Your preferred range.</span>
			<div class="flex flex-row space-x-4">
				<!-- play this verse -->
				<div class="flex items-center {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playThisVerse" class="text-black">This {term('verse')}</Radio>
				</div>
				<!-- play from here -->
				<div class="flex items-center {!['chapter', 'page'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playFromHere" class="text-black">From Here</Radio>
				</div>
				<!-- play range -->
				<div class="flex items-center {!['chapter'].includes($__currentPage) && disabledClasses}">
					<Radio bind:group={$__audioSettings.audioRange} value="playRange" o class="text-black">{term('verses')} Range</Radio>
				</div>
			</div>
		</div>

		<!-- audio range options -->
		{#if $__currentPage === 'chapter' && $__audioSettings.audioType === 'verse'}
			<div id="audio-range-options" class={$__audioSettings.audioRange === 'playRange' ? 'block' : 'hidden'}>
				<!-- from / till -->
				<div class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700">
					<!-- <span class="text-xs  ">Select the range of verses or words to be played.</span> -->
					<div class="flex flex-row space-x-4">
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm font-medium mr-2">Start {term('verse')}</span>
							<input type="number" min="1" max={quranMetaData[$__chapterNumber].verses} value={$__audioSettings.startVerse} id="startVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="start" />
						</div>
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm font-medium mr-2">End {term('verse')}</span>
							<input type="number" min={$__audioSettings.startVerse} max={quranMetaData[$__chapterNumber].verses} value={$__audioSettings.endVerse} id="endVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="end" />
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- repeat times -->
	{#if $__audioSettings.audioType === 'verse'}
		<div class="flex flex-col space-y-4 py-4 border-t">
			<span class="text-xs opacity-70">Number of times a {term('verse')} or word has to be repeated.</span>
			<div class="flex flex-row space-x-4">
				<div class="flex flex-row space-x-2">
					<span class="m-auto text-sm font-medium mr-2">Repeat each {term($__audioSettings.audioType)}</span>
					<input id="timesToRepeat" type="number" value="1" min="1" max="20" on:change={updateAudioSettings} class="w-16 text-xs border border-black/10 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" />
					<span class="m-auto text-sm font-medium">{$__audioSettings.timesToRepeat < 2 ? 'time' : 'times'} </span>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-4">
		<button on:click={playButtonHandler} class="w-full mr-2 {buttonClasses}">
			<span class="capitalize">Play</span>
			<div class="hidden">
				{#if $__audioSettings.startVerse !== null}
					{$__audioSettings.startVerse}
				{/if}
				{#if $__audioSettings.endVerse !== undefined}
					to {$__audioSettings.endVerse}
				{/if}
			</div>
		</button>
	</div>
</Modal>
