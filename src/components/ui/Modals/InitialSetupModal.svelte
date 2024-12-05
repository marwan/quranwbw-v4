<script>
	import Chapter from '$display/verses/modes/Chapter.svelte';
	import { __currentPage, __chapterData, __fontType, __displayType } from '$utils/stores';
	import { selectableDisplays, selectableFontTypes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { toggleModal } from '$utils/toggleModal';
	import { buttonClasses } from '$data/commonClasses';

	// show the setup modal on first visit except on the home page
	$: {
		if ($__currentPage === 'chapter') {
			const userSettings = JSON.parse(localStorage.getItem('userSettings'));

			// // if the setup was not already done
			// if (userSettings.initialSetupCompleted === false) {
			//   toggleModal("initialSetupModal", "show");

			//   // set initialSetupCompleted to true
			//   updateSettings({ type: "initialSetupCompleted", value: true });
			// }
		}
	}
</script>

<!-- Main modal -->
<div id="initialSetupModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full theme-grayscale">
	<div class="relative w-full max-w-2xl max-h-full sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
		<!-- Modal content -->
		<div class="max-h-full overflow-hidden flex flex-col bg-white rounded-3xl shadow">
			<!-- Modal header -->
			<div class="flex items-start justify-between p-4 border-b rounded-t">
				<h3 class="text-xl font-semibold text-gray-900">Initial Setup</h3>
				<button on:click={() => toggleModal('initialSetupModal', 'hide')} type="button" class="bg-transparent hover:bg-lightGray hover:text-gray-900 rounded-3xl text-sm w-8 h-8 ml-auto inline-flex justify-center items-center">
					<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
					</svg>
					<span class="sr-only">Close modal</span>
				</button>
			</div>
			<!-- Modal body -->
			<div class="p-6 space-y-6 overflow-y-auto">
				<p>If it's your first time visiting QuranWBW.com, we suggest you set the font and display type as per your preference. These options, including many more, can be changed later from the settings.</p>

				<!-- selectors -->
				<div class="flex flex-row space-x-6">
					<div class="flex flex-col">
						<label for="quran-font-list" class="block mb-2 text-sm font-medium text-gray-900">Quran Font</label>
						<select id="quran-font-list" on:change={(event) => updateSettings({ type: 'fontType', value: +event.target.value })} bind:value={$__fontType} class="w-32 border border-black/10 text-gray-900 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5">
							{#each Object.entries(selectableFontTypes) as [id, font]}
								<option value={font.id}>{font.font}</option>
							{/each}
						</select>
					</div>

					<div class="flex flex-col">
						<label for="display-style-list" class="block mb-2 text-sm font-medium text-gray-900">Display Style</label>
						<select id="display-style-list" bind:value={$__displayType} on:change={(event) => updateSettings({ type: 'displayType', value: +event.target.selectedIndex + 1 })} class="w-32 border border-black/10 text-gray-900 rounded-3xl focus:ring-gray-500 focus:border-gray-500 block p-2.5">
							{#each Object.entries(selectableDisplays) as [id, displayOption]}
								<option value={displayOption.displayID}>{displayOption.displayName}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- example verse -->
				{#key $__chapterData}
					{#if $__chapterData !== null}
						<div class="flex flex-col pt-8 space-y-4">
							<span class="text-center text-xs">Example Verse:</span>
							<div id="exampleVerse" style="zoom: 60%;" class={selectableDisplays[`${$__displayType}`].customClasses}>
								<Chapter startVerse={1} endVerse={1} isExampleVerse={true} />
							</div>
						</div>
					{/if}
				{/key}
			</div>
			<!-- Modal footer -->
			<div class="flex justify-end p-6 space-x-2 border-t border-black/10 rounded-b">
				<button on:click={() => toggleModal('initialSetupModal', 'hide')} type="button" class={buttonClasses}>Close</button>
			</div>
		</div>
	</div>
</div>
