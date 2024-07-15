<script>
	export let value;
	import { __userSettings, __verseTranslations } from '$utils/stores';
	import { selectableVerseTranslations } from '$data/options';

	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
	const footnoteSupClasses = 'ml-1 mt-1 px-2 py-1 bg-gray-200 rounded-full font-semibold cursor-pointer';
	// const verseTranslationReplace = {
	// 	search: /<sup/g,
	// 	replace: `<sup onclick='supClick(this)' title='Click to show footnote' data-verse='${value.meta.verse}' class='${footnoteSupClasses}' `
	// };

	let footnoteId,
		footnoteVerse,
		footnoteTranslation,
		footnoteText = 'loading...',
		footnoteNumber = '...';

	async function supClick(event) {
		resetFootnoteBlock();
		footnoteId = +event.getAttribute('id');
		footnoteVerse = +event.getAttribute('data-verse');
		footnoteTranslation = +event.getAttribute('data-translation');
		footnoteNumber = +event.innerText;

		// fetch footnote
		const response = await fetch(`https://api.qurancdn.com/api/qdc/foot_notes/${footnoteId}`);
		const data = await response.json();
		footnoteText = data.foot_note.text;
	}

	$: {
		if (footnoteId !== undefined) {
			const nodeId = footnoteVerse === 1 ? 1 : 0;
			const selector = `.footnote-${footnoteVerse}-${footnoteTranslation}`;
			const footnoteBlock = document.querySelectorAll(`${selector}`);
			let footnoteBlockNumber = document.querySelectorAll(`${selector} .title .footnote-number`);
			let footnoteBlockText = document.querySelectorAll(`${selector} .text`);

			// update the footnote number, text and unhide this verse's footnote block
			footnoteBlockNumber[nodeId].innerText = footnoteNumber;
			footnoteBlockText[nodeId].innerText = footnoteText;
			footnoteBlock[nodeId].classList.remove('hidden');
			footnoteBlock[nodeId].classList.remove('block');
		}
	}

	function resetFootnoteBlock() {
		footnoteText = 'loading...';
		// document.querySelectorAll('.footnote-block').forEach((element) => {
		// 	element.classList.remove('block');
		// 	element.classList.add('hidden');
		// });
	}

	window.supClick = supClick;
</script>

{#if value.translations != undefined}
	<div class="verseTranslationText flex flex-col space-y-4 leading-normal theme {fontSizes.verseTranslationText}" data-fontSize={fontSizes.verseTranslationText}>
		{#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
			<div class="flex flex-col print:break-inside-avoid">
				<span class={selectableVerseTranslations[verseTranslationID].language === 'Urdu' ? 'font-Urdu direction-rtl' : 'direction-ltr'}>{@html verseTranslation.replace(/<sup/g, `<sup onclick='supClick(this)' title='Click to show footnote' data-verse='${value.meta.verse}' data-translation=${verseTranslationID} class='${footnoteSupClasses}' `)}</span>

				<!-- translation footnotes -->
				<div class="hidden my-2 footnote-block px-2 py-2 border-2 border-gray-200 rounded-2xl footnote-{value.meta.verse}-{verseTranslationID}">
					<div class="title font-semibold text-xs">
						<span>Footnote #</span>
						<span class="footnote-number">...</span>
					</div>
					<div class="text">...</div>
				</div>

				<!-- author name -->
				{#if $__verseTranslations.length > 1}
					<span class="opacity-70">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
				{/if}
			</div>
		{/each}

		<!-- <div id="footnote-verse-{value.meta.verse}" class="hidden footnote-block footnote-verse-{value.meta.verse}">
			<div class="title font-semibold">
				<span>Footnote</span>
				<span class="footnote-number">...</span>
			</div>
			<div class="text">...</div>
		</div> -->
	</div>
{/if}
