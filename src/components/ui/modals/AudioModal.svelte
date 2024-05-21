<script>
	import { quranMetaData } from '$data/quranMeta';
	import { __currentPage, __chapterNumber, __audioSettings, __userSettings, __audioModalVisible } from '$utils/stores';
	import { initializeAudio, updateAudioSettings } from '$utils/audioController';
	import { disabledElement, buttonElement } from '$data/commonStyles';
	import { updateSettings } from '$utils/updateSettings';
	import { Modal, Radio } from 'flowbite-svelte';

	// icons
	import Play from '$svgs/Play.svelte';
	import Bookmark from '$svgs/Bookmark.svelte';
	import Bookmarked from '$svgs/Bookmarked.svelte';

	// update userBookmarks whenever the __userSettings changes
	$: userBookmarks = JSON.parse($__userSettings).userBookmarks;

	$: console.table($__audioSettings);
</script>

<Modal id="audioModal" bind:open={$__audioModalVisible} size="xs" class="rounded-3xl theme-grayscale" bodyClass="p-6" placement="center" autoclose outsideclose>
	<!-- Modal content -->
	<div class="flex flex-row space-x-4 mb-4 text-xl" style="margin-top: 0px;">
		<h3 id="audio-modal-title" class="font-medium text-gray-900">{quranMetaData[$__audioSettings.playingChapter || 1].transliteration}, {$__audioSettings.playingKey}</h3>

		<button on:click={() => updateSettings({ type: 'userBookmarks', key: $__audioSettings.playingKey })} class="mt-1">
			<div class="opacity-50">
				<svelte:component this={userBookmarks.includes($__audioSettings.playingKey) ? Bookmarked : Bookmark} />
			</div>
		</button>
	</div>
	<div class="flex flex-col">
		<!-- verse or words -->
		<div class="flex flex-col space-y-4 py-4">
			<span class="text-xs text-gray-500">Either play the whole verse or individual words.</span>
			<div class="flex flex-row space-x-4">
				<!-- play verse -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="verse" on:change={(event) => updateAudioSettings}>Play Verse</Radio>
				</div>
				<!-- play word -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioType} value="word" on:change={(event) => updateAudioSettings}>Play Word</Radio>
				</div>
			</div>

			{#if $__audioSettings.audioType === 'word'}
				<span class="inline-flex items-center text-xs space-x-1 pt-2 text-gray-500 opacity-80">
					<!-- <Info /> -->
					<span>This option would play all the words in the verse one by one with your selected repeat options. If you would like to listen to individual words, click on them.</span>
				</span>
			{/if}
		</div>

		<!-- single or range -->
		<div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700 {$__audioSettings.audioType === 'word' ? 'hidden' : ''}">
			<span class="text-xs text-gray-500">Your preferred range.</span>
			<div class="flex flex-row space-x-4">
				<!-- play this verse -->
				<div class="flex items-center">
					<Radio bind:group={$__audioSettings.audioRange} value="playThisVerse" on:change={(event) => updateAudioSettings}>This Verse</Radio>
				</div>
				<!-- play from here -->
				<div class="flex items-center {$__currentPage !== 'chapter' && disabledElement}">
					<Radio bind:group={$__audioSettings.audioRange} value="playFromHere" on:change={(event) => updateAudioSettings}>From Here</Radio>
				</div>
				<!-- play range -->
				<div class="flex items-center {$__currentPage !== 'chapter' && disabledElement}">
					<Radio bind:group={$__audioSettings.audioRange} value="playRange" on:change={(event) => updateAudioSettings}>Verses Range</Radio>
				</div>
			</div>
		</div>

		<!-- audio range options -->
		{#if $__currentPage === 'chapter' && $__audioSettings.audioType === 'verse'}
			<div id="audio-range-options" class={$__audioSettings.audioRange === 'playRange' ? 'block' : 'hidden'}>
				<!-- from / till -->
				<div class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700">
					<!-- <span class="text-xs text-gray-500 ">Select the range of verses or words to be played.</span> -->
					<div class="flex flex-row space-x-4">
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm font-medium text-gray-900 mr-2">Start Verse</span>
							<input type="number" min="1" max={quranMetaData[$__chapterNumber].verses} value={$__audioSettings.startVerse} id="startVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-gray-300 text-gray-900 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="start" />
						</div>
						<div class="flex flex-row space-x-2">
							<span class="m-auto text-sm font-medium text-gray-900 mr-2">End Verse</span>
							<input type="number" min={$__audioSettings.startVerse} max={quranMetaData[$__chapterNumber].verses} value={$__audioSettings.endVerse} id="endVerse" on:change={updateAudioSettings} aria-describedby="helper-text-explanation" class="w-16 text-xs border border-gray-300 text-gray-900 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" placeholder="end" />
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- repeat times -->
	<div class="flex flex-col space-y-4 py-4 border-t dark:border-slate-700">
		<span class="text-xs text-gray-500">Number of times a verse or word has to be repeated.</span>
		<div class="flex flex-row space-x-4">
			<div class="flex flex-row space-x-2">
				<span class="m-auto text-sm font-medium text-gray-900 mr-2">Repeat each {$__audioSettings.audioType} </span>
				<input id="timesToRepeat" type="number" value="1" min="1" max="20" on:change={updateAudioSettings} class="w-16 text-xs border border-gray-300 text-gray-900 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5 mb-0" />
				<span class="m-auto text-sm font-medium text-gray-900">{$__audioSettings.timesToRepeat < 2 ? 'time' : 'times'} </span>
			</div>
		</div>
	</div>

	<div>
		<button on:click={initializeAudio} class="w-full mr-2 {buttonElement}">
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
</Modal>
