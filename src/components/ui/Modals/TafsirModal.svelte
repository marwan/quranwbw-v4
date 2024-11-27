<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import SingleArabicVerse from '$display/verses/SingleArabicVerse.svelte';
	import { errorLoadingDataMessage } from '$data/websiteSettings';
	import { quranMetaData } from '$data/quranMeta';
	import { __tafsirModalVisible, __verseKey, __verseTafsir } from '$utils/stores';
	import { buttonClasses } from '$data/commonClasses';
	import { selectableTafsirs } from '$data/selectableTafsirs';
	import { term } from '$utils/terminologies';

	let tafsirData;
	const tafsirUrls = {
		1: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir',
		2: 'https://static.quranwbw.com/data/v4/tafsirs'
	};

	$: selectedTafirId = $__verseTafsir || 30;
	$: chapter = +$__verseKey.split(':')[0];
	$: verse = +$__verseKey.split(':')[1];

	$: {
		if ($__tafsirModalVisible) {
			tafsirData = (async () => {
				const selectedTafsir = selectableTafsirs[selectedTafirId];
				const response = await fetch(`${tafsirUrls[selectedTafsir.url]}/${selectedTafsir.slug}/${chapter}.json`);
				const data = await response.json();
				return data.ayahs;
			})();
		}
	}

	$: tafsirTextClasses = `
		flex flex-col space-y-4
		${['Arabic', 'Urdu'].includes(selectableTafsirs[selectedTafirId].language) && 'direction-rtl text-lg'}
		${['Urdu'].includes(selectableTafsirs[selectedTafirId].language) && 'font-Urdu'}
	`;

	// scroll to top if verse changes
	$: {
		try {
			if ($__tafsirModalVisible && verse) document.getElementById('tafsirModal').getElementsByTagName('div')[1].scrollTop = 0;
		} catch (error) {
			// ignore errors
		}
	}
</script>

<Modal
	bind:open={$__tafsirModalVisible}
	title="{quranMetaData[chapter].transliteration}, {chapter}:{verse}"
	id="tafsirModal"
	class="!rounded-b-none md:!rounded-3xl theme"
	bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain theme-grayscale"
	headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayscale"
	classFooter="rounded-b-3xl flex flex-row justify-between"
	size="lg"
	position="bottom"
	center
	outsideclose
>
	<div class="flex flex-col space-y-4">
		{#key verse}
			<div class="py-4">
				<SingleArabicVerse key="{chapter}:{verse}" />
			</div>
		{/key}

		{#await tafsirData}
			<Spinner />
		{:then tafsirData}
			<div class="text-sm text-black flex flex-col space-y-6">
				<div class="flex flex-col space-y-4">
					<div class={tafsirTextClasses}>
						{#each Object.entries(tafsirData) as [id, tafsir]}
							{#if tafsir.surah === chapter && tafsir.ayah === verse}
								{@html tafsir.text.replace(/[\n]/g, '<br /><br />')}
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{:catch error}
			<p>{errorLoadingDataMessage}</p>
		{/await}
	</div>

	<svelte:fragment slot="footer">
		{#if verse > 1}
			<button class="text-sm {buttonClasses}" on:click={() => (verse = verse - 1)}>Previous {term('verse')}</button>
		{/if}

		{#if verse < quranMetaData[chapter].verses}
			<button class="text-sm {buttonClasses}" on:click={() => (verse = verse + 1)}>Next {term('verse')}</button>
		{/if}
	</svelte:fragment>
</Modal>
