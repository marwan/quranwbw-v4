<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { quranMetaData } from '$data/quranMeta';
	import { __tafsirModalVisible, __verseKey } from '$utils/stores';
	import { buttonClasses } from '$data/commonClasses';
	import { selectableTafsirs } from '$data/selectableTafsirs';
	import { term } from '$utils/terminologies';

	const tafsirUrls = {
		1: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir',
		2: 'https://static.quranwbw.com/data/v4/tafsirs'
	};

	let selectedTafirId = 12;
	let tafsirData;

	$: chapter = +$__verseKey.split(':')[0];
	$: verse = +$__verseKey.split(':')[1];

	$: {
		tafsirData = (async () => {
			const selectedTafsir = selectableTafsirs[selectedTafirId];
			const response = await fetch(`${tafsirUrls[selectedTafsir.url]}/${selectedTafsir.slug}/${chapter}.json`);
			const data = await response.json();
			return data.ayahs;
		})();
	}

	$: tafsirTextClasses = `
		flex flex-col space-y-4
		${['Arabic', 'Urdu'].includes(selectableTafsirs[selectedTafirId].language) && 'direction-rtl text-lg'}
		${['Urdu'].includes(selectableTafsirs[selectedTafirId].language) && 'font-Urdu'}
	`;
</script>

<Modal title="{quranMetaData[chapter].transliteration}, {chapter}:{verse}" id="tafsirModal" bind:open={$__tafsirModalVisible} class="rounded-3xl theme" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayscale" size="lg" center outsideclose>
	{#await tafsirData}
		<Spinner />
	{:then tafsirData}
		<div class="text-sm text-black flex flex-col space-y-6">
			<div class="flex flex-row items-center">
				<span class="mr-2">Tafsir: </span>
				<select id="dropdown" bind:value={selectedTafirId} on:change={(event) => (selectedTafirId = +event.target.value)} class="mt-2 w-56 rounded-3xl focus:border-gray-500 text-black theme-grayscale truncate">
					{#each Object.entries(selectableTafsirs) as [id, tafsir]}
						<option value={+id}>{tafsir.language} - {tafsir.name} by {tafsir.author}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col space-y-4">
				<div class={tafsirTextClasses}>
					{#each Object.entries(tafsirData) as [id, tafsir]}
						{#if tafsir.surah === chapter && tafsir.ayah === verse}
							{@html tafsir.text.replace(/[\n]/g, '<br /><br />')}
						{/if}
					{/each}
				</div>
			</div>

			<div class="flex flex-row justify-between">
				{#if verse > 1}
					<button class={buttonClasses} on:click={() => (verse = verse - 1)}>Previous {term('verse')}</button>
				{/if}

				{#if verse < quranMetaData[chapter].verses}
					<button class={buttonClasses} on:click={() => (verse = verse + 1)}>Next {term('verse')}</button>
				{/if}
			</div>
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</Modal>
