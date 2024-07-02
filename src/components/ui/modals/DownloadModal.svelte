<script>
	import { buttonClasses, disabledClasses } from '$data/commonClasses';
	import { toggleModal } from '$utils/toggleModal';
	import { __fontType, __verseTranslations, __wordTranslation, __downloadedDataSettings } from '$utils/stores';
	import { downloadData } from '$utils/downloadData';
	import { selectableFontTypes, selectableWordTranslations } from '$data/options';

	const chaptersToDownload = 5;
	let downloadInProgress = false;

	$: {
		if ($__downloadedDataSettings.downloadedChapters.length === chaptersToDownload) {
			__downloadedDataSettings.set({
				downloadedChapters: $__downloadedDataSettings.downloadedChapters,
				allChaptersDownloaded: true
			});

			downloadInProgress = false;
		}
	}

	function downloadHandler() {
		__downloadedDataSettings.set({ downloadedChapters: [], allChaptersDownloaded: false });
		downloadInProgress = true;
		downloadData();
	}

	$: wordTranslationKey = Object.keys(selectableWordTranslations).filter((item) => selectableWordTranslations[item].id === $__wordTranslation);
</script>

<!-- download modal -->
<div id="downloadModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full text-sm p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full theme-grayscale">
	<div class="relative w-full max-w-xl max-h-full">
		<!-- Modal content -->
		<div class="relative bg-white rounded-3xl shadow">
			<button type="button" on:click={() => toggleModal('downloadModal', 'hide')} class="absolute top-3 right-2.5 bg-transparent hover:bg-lightGray hover:text-gray-900 rounded-3xl text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="downloadModal">
				<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
				<span class="sr-only">Close modal</span>
			</button>
			<div class="px-6 py-6 space-y-8 lg:px-8">
				<h3 id="downloadModal-title" class="mb-8 text-xl font-medium text-gray-900">Download Data</h3>
				<div id="download-info" class="flex flex-col space-y-4 text-sm">
					<span>This option can be used to download all the chapters data which are cached or downloaded for offline view.</span>
					<span>The data which are downloaded will be based on your settings as per below:</span>

					<div class="flex flex-col space-y-2">
						<span><b>Quran Font:</b> {selectableFontTypes[$__fontType].font}</span>
						<span><b>Word Translation:</b> {selectableWordTranslations[wordTranslationKey].language}</span>
						<span><b>Verse Translations:</b> {$__verseTranslations.length} selected</span>
					</div>

					<span>If you decide to change your font or translation settings, you will have to manually re-download the chapters data again.</span>

					{#if downloadInProgress}
						<div class="flex flex-col space-y-2">
							{#if $__downloadedDataSettings.allChaptersDownloaded}
								Download completed.
							{:else}
								Downloaded Chapters: {$__downloadedDataSettings.downloadedChapters.length}/{chaptersToDownload}...
							{/if}
						</div>
					{/if}
				</div>

				<button class="w-full {buttonClasses} {downloadInProgress === true && disabledClasses}" on:click={() => downloadHandler()}> Download </button>
			</div>
		</div>
	</div>
</div>
