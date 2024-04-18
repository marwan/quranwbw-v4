<script>
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings } from '$utils/stores';
	import { initializeAudio, updateAudioSettings } from '$utils/audioController';
	import { toggleModal } from '$utils/toggleModal';
	import { disabledElement, buttonElement } from '$data/commonStyles';

	// icons
	// import Info from "$svgs/Info.svelte";
	import Play from '$svgs/Play.svelte';

	// fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full grayscale
</script>

<!-- Audio modal -->
<div id="audio-modal" data-chapter data-verse tabindex="-1" aria-hidden="true" class="flex fixed bottom-0 left-0 right-0 z-50 hidden w-full overflow-x-hidden overflow-y-auto md:inset-0 theme-grayscale justify-center items-center">
	<div class="relative w-full max-w-md max-h-full">
		<!-- Modal content -->
		<div class="relative bg-white rounded-b-none md:rounded-b-lg rounded-lg shadow dark:bg-slate-800">
			<button type="button" on:click={() => toggleModal('audio-modal', 'hide')} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-[#ebebeb] hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="audio-modal">
				<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
				<span class="sr-only">Close modal</span>
			</button>
			<div class="px-6 py-6 lg:px-8">
				<h3 id="audio-modal-title" class="mb-4 text-xl font-medium text-gray-900 dark:text-slate-400">{quranMetaData[$__audioSettings.playingChapter || 1].transliteration}, {$__audioSettings.playingKey}</h3>
				<div class="flex flex-col">
					<!-- verse or words -->
					<div class="flex flex-col space-y-4 py-4">
						<span class="text-xs text-gray-500 dark:text-gray-400">Either play the whole verse or individual words.</span>
						<div class="flex flex-row space-x-4">
							<!-- play verse -->
							<div class="flex items-center">
								<input checked={$__audioSettings.audioType === 'verse' ? true : false} id="playVerse" type="radio" value="" on:click={updateAudioSettings} name="radio-audio-type" class="radio-play-type w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-slate-700" />
								<label for="playVerse" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Play Verse</label>
							</div>
							<!-- play word -->
							<div class="flex items-center">
								<input checked={$__audioSettings.audioType === 'word' ? true : false} id="playWord" type="radio" value="" on:click={updateAudioSettings} name="radio-audio-type" class="radio-play-type w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-slate-700" />
								<label for="playWord" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Play Words</label>
							</div>
						</div>

						{#if $__audioSettings.audioType === 'word'}
							<span class="inline-flex items-center text-xs space-x-1 pt-2 text-gray-500 dark:text-gray-400 opacity-80">
								<!-- <Info /> -->
								<span>This option would play all the words in the verse one by one with your selected repeat options. If you would like to listen to individual words, click on them.</span>
							</span>
						{/if}
					</div>

					<!-- single or range -->
					<div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700 {$__audioSettings.audioType === 'word' ? 'hidden' : ''}">
						<span class="text-xs text-gray-500 dark:text-gray-400">The playing range that you prefer.</span>
						<div class="flex flex-row space-x-4">
							<!-- play this verse -->
							<div class="flex items-center">
								<input checked={$__audioSettings.audioRange === 'playThisVerse' ? true : false} id="playThisVerse" type="radio" value="" on:click={updateAudioSettings} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-slate-700" />
								<label for="playThisVerse" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">This Verse</label>
							</div>
							<!-- play from here -->
							<div class="flex items-center {$__currentPage !== 'chapter' && disabledElement}">
								<input checked={$__audioSettings.audioRange === 'playFromHere' ? true : false} id="playFromHere" type="radio" value="" on:click={updateAudioSettings} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-slate-700" />
								<label for="playFromHere" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">From Here</label>
							</div>
							<!-- play range -->
							<div class="flex items-center {$__currentPage !== 'chapter' && disabledElement}">
								<input checked={$__audioSettings.audioRange === 'playRange' ? true : false} id="playRange" type="radio" value="" on:click={updateAudioSettings} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-slate-700" />
								<label for="playRange" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Verses Range</label>
							</div>
						</div>
					</div>

					<!-- audio range options -->
					{#if $__currentPage === 'chapter' && $__audioSettings.audioType === 'verse'}
						<div id="audio-range-options" class={$__audioSettings.audioRange === 'playRange' ? 'block' : 'hidden'}>
							<!-- from / till -->
							<div class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700">
								<!-- <span class="text-xs text-gray-500 dark:text-gray-400">Select the range of verses or words to be played.</span> -->
								<div class="flex flex-row space-x-4">
									<div class="flex flex-row space-x-2">
										<span class="m-auto text-sm font-medium text-gray-900 dark:text-gray-300">Start Verse</span>
										<input
											type="number"
											min="1"
											max={quranMetaData[$__chapterNumber].verses}
											value={$__audioSettings.startVerse}
											id="startVerse"
											on:change={updateAudioSettings}
											aria-describedby="helper-text-explanation"
											class="w-16 text-xs border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-gray-500 dark:focus:border-gray-500"
											placeholder="start"
										/>
									</div>
									<div class="flex flex-row space-x-2">
										<span class="m-auto text-sm font-medium text-gray-900 dark:text-gray-300">End Verse</span>
										<input
											type="number"
											min={$__audioSettings.startVerse}
											max={quranMetaData[$__chapterNumber].verses}
											value={$__audioSettings.endVerse}
											id="endVerse"
											on:change={updateAudioSettings}
											aria-describedby="helper-text-explanation"
											class="w-16 text-xs border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-gray-500 dark:focus:border-gray-500"
											placeholder="end"
										/>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- repeat times -->
				<div class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700">
					<span class="text-xs text-gray-500 dark:text-gray-400">Number of times a verse or word has to be repeated.</span>
					<div class="flex flex-row space-x-4">
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm font-medium text-gray-900 dark:text-gray-300">Repeat each {$__audioSettings.audioType} </span>
							<input id="timesToRepeat" type="number" value="1" min="1" max="20" on:change={updateAudioSettings} class="w-16 text-xs border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-slate-700 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-gray-500 dark:focus:border-gray-500" />
							<span class="m-auto text-sm font-medium text-gray-900 dark:text-gray-300">{$__audioSettings.timesToRepeat < 2 ? 'time' : 'times'} </span>
						</div>
					</div>
				</div>

				<div>
					<button on:click={initializeAudio} class="w-full mr-2 mt-6 {buttonElement}">
						<Play />

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
			</div>
		</div>
	</div>
</div>
