<script>
	import party from 'party-js';
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import { __newSiteChangelogModalVisible } from '$utils/stores';
	import { linkClasses } from '$data/commonClasses';
	import { updateSettings } from '$utils/updateSettings';

	const newFeatures = [
		'<span class="font-semibold">Expanded Language Options:</span> Word-by-word translations now available in Chinese, Divehi, French, German, Ingush, Malayalam, and Russian.',
		'<span class="font-semibold">King Fahad Quran Printing Complex Fonts:</span> Includes Tajweed color-coded support based on Dar Al Marifa Easy Quran Mushaf.',
		'<span class="font-semibold">New Themes and Styles:</span> Fresh themes in Blue, Green, and Sepia, along with enhanced Light and Black themes.',
		'<span class="font-semibold">Tooltip and Popup Features:</span> Tooltips for word meanings and transliterations.',
		'<span class="font-semibold">Screen Sleep Prevention:</span> Option to prevent the screen from sleeping.',
		'<span class="font-semibold">Multiple Verse/Ayah Translations:</span> Select multiple verse/Ayah translations simultaneously, an improvement from the previous limit of two.',
		'<span class="font-semibold">Comprehensive Footnotes:</span> Added to Ayah/verse translations across multiple translations.',
		'<span class="font-semibold">Tajweed and Transliteration:</span> New Tajweed transliterations for verses and words, ensuring correct pronunciation.',
		'<span class="font-semibold">Tafsir Al Quran:</span> Access Tafsir by multiple authors in various languages.',
		'<span class="font-semibold">Flexible Display Options:</span> Includes Mushaf (page mode) and other display layouts.',
		'<span class="font-semibold">Verse Annotation:</span> Option to add personal notes to verses.',
		'<span class="font-semibold">Morphology Mode:</span> Provides detailed word information for learning and research.',
		'<span class="font-semibold">Sequential Word Playback:</span> Play words one-by-one for better learning.',
		'<span class="font-semibold">Terminology Customization:</span> Switch website terminologies to fit user preferences.',
		'<span class="font-semibold">Tajweed Rules Modal:</span> Learn about Tajweed rules on the fly without leaving the Surah reading.',
		'<span class="font-semibold">Translation Audio:</span> Experience translation audio alongside Arabic recitation.',
		'<span class="font-semibold">Direct Link Sharing:</span> Share links directly to Ayah/verse.'
	];

	const enhancedFeatures = [
		'<span class="font-semibold">Word Highlight Feature:</span> Expanded to include more reciters.',
		'<span class="font-semibold">Mini Status Bar:</span> Now displays progress and other relevant information.',
		'<span class="font-semibold">Redesigned Homepage:</span> Features two columns of Surah cards to reduce scrolling.',
		'<span class="font-semibold">Search Feature:</span> Enhanced with additional options.',
		'<span class="font-semibold">Duas Page:</span> Displays only the Dua portion of the Ayah in focus with the ability to hide non-Dua portions.',
		'<span class="font-semibold">Suggested Surahs/Ayah:</span> Improved suggestions on the homepage.',
		'<span class="font-semibold">Bookmarks Page/Tab:</span> Enhanced appearance and management of bookmarks.',
		'<span class="font-semibold">Font Size and Recitation Speed Adjustment:</span> Improved user experience.',
		'<span class="font-semibold">Advanced Audio Play:</span> Enhanced audio play features.'
	];

	// show the setup modal on first visit
	$: {
		const userSettings = JSON.parse(localStorage.getItem('userSettings'));

		if (userSettings.oneTimeModals.newSiteChangelogModal === false) {
			setTimeout(function () {
				__newSiteChangelogModalVisible.set(true);
				updateSettings({ type: 'newSiteChangelogModal', value: true });
			}, 2000);

			// confettis for the update? why not!
			setTimeout(function () {
				party.confetti(document.body, {
					count: 80,
					spread: 100,
					size: 2
				});
			}, 2500);
		}
	}
</script>

<Modal id="newSiteChangelogModal" bind:open={$__newSiteChangelogModalVisible} size="md" class="rounded-3xl text-black theme" bodyClass="p-6" dialogClass="fixed top-0 start-0 end-0 h-[-webkit-fill-available] md:inset-0 md:h-full z-50 w-full p-4 flex" center outsideclose>
	<div class="flex flex-col space-y-4">
		<div class="flex flex-col space-y-2">
			<div class="font-medium text-lg">QuranWBW v4 Update</div>
			<div class="flex flex-col space-y-4 text-sm max-h-[60vh] overflow-y-scroll pr-2">
				<span>Alhamdulillah, we are thrilled to announce the release of QuranWBW v4, featuring a completely redesigned website with significant performance enhancements and a multitude of new and improved features. Here are the highlights of this update:</span>

				<!-- new features -->
				<span class="font-bold">New Features</span>
				<ul class="list-disc ml-5 space-y-2">
					{#each newFeatures as feature}
						<li>{@html feature}</li>
					{/each}
				</ul>

				<!-- enhanced features -->
				<span class="font-bold">Enhanced Features</span>
				<ul class="list-disc ml-5 space-y-2">
					{#each enhancedFeatures as feature}
						<li>{@html feature}</li>
					{/each}
				</ul>

				<span>We hope you enjoy the new and improved QuranWBW experience! In case you'd still like to use the old website, you may visit <a class={linkClasses} target="_blank" rel="noreferrer" href="https://v3.quranwbw.com">v3.quranwbw.com</a> </span>
				<br />
			</div>
		</div>
	</div>
</Modal>
