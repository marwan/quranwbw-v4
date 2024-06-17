<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Select from '$ui/flowbite-svelte/forms/Select.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { quranMetaData } from '$data/quranMeta';
	import { __tafsirModalVisible, __verseKey } from '$utils/stores';
	import { buttonClasses, linkClasses } from '$data/commonClasses';

	let tasfirsList = [
		{ value: 'en-tafisr-ibn-kathir', name: 'Ibn Kathir (Abridged)' },
		{ value: 'en-tafsir-maarif-ul-quran', name: "Ma'arif al-Qur'an" }
	];

	let selectedTafsir = tasfirsList[0].value;
	let tafsirData;

	$: chapter = +$__verseKey.split(':')[0];
	$: verse = +$__verseKey.split(':')[1];

	$: {
		tafsirData = (async () => {
			const response = await fetch(`https://api.qurancdn.com/api/qdc/tafsirs/${selectedTafsir}/by_ayah/${chapter}:${verse}?locale=en`);
			const data = await response.json();
			return data;
		})();
	}
</script>

<Modal title="{quranMetaData[chapter].transliteration}, {chapter}:{verse}" id="tafsirModal" bind:open={$__tafsirModalVisible} class="rounded-3xl theme" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayscale" size="lg" center outsideclose>
	{#await tafsirData}
		<Spinner />
	{:then tafsirData}
		<div class="text-sm text-black flex flex-col space-y-6">
			<div class="flex flex-row items-center">
				<span class="mr-2">Tafsir: </span>
				<Select class="mt-2 w-fit rounded-3xl focus:border-gray-500 text-black theme-grayscale" items={tasfirsList} bind:value={selectedTafsir} />
			</div>

			<div class="flex flex-col space-y-4">
				{#if Object.keys(tafsirData.tafsir.verses).length > 1}
					<div class="font-bold">You are reading a tafsir for the group of verses - {Object.keys(tafsirData.tafsir.verses)[0]} to {Object.keys(tafsirData.tafsir.verses)[Object.keys(tafsirData.tafsir.verses).length - 1]}.</div>
				{/if}

				<div class="flex flex-col space-y-4">
					{@html tafsirData.tafsir.text}
				</div>
			</div>

			<div>Credits: <a href="https://quran.com" class={linkClasses} target="_blank">Quran.com</a>.</div>

			<div class="flex flex-row justify-between">
				{#if verse > 1}
					<button class={buttonClasses} on:click={() => (verse = verse - 1)}>Previous Verse</button>
				{/if}

				{#if verse < quranMetaData[chapter].verses}
					<button class={buttonClasses} on:click={() => (verse = verse + 1)}>Next Verse</button>
				{/if}
			</div>
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</Modal>
