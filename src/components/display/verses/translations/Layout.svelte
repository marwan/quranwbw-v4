<script>
	export let verseTranslationID;
	export let verseTranslation;
	export let value;

	import CrossSolid from '$svgs/CrossSolid.svelte';
	import { __userSettings, __verseTranslations, __currentPage } from '$utils/stores';
	import { selectableVerseTranslations, rightToLeftVerseTranslations } from '$data/options';

	const translationFootnoteClasses = `hidden my-2 footnote-block px-2 py-2 border-2 border-gray-200 rounded-2xl theme-grayscale footnote-${value.meta.chapter}-${value.meta.verse}-${verseTranslationID}`;
	const footnoteSupClasses = 'ml-1 mt-1 px-2 py-1 bg-gray-200 rounded-full font-semibold cursor-pointer system-font';

	let footnoteId,
		footnoteChapter,
		footnoteVerse,
		footnoteTranslation,
		footnoteText = 'loading...',
		footnoteNumber = '...';

	async function supClick(event) {
		footnoteText = 'loading...';
		footnoteId = +event.getAttribute('foot_note');
		footnoteChapter = +event.getAttribute('data-chapter');
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
			const selector = `.footnote-${footnoteChapter}-${footnoteVerse}-${footnoteTranslation}`;
			const footnoteBlock = document.querySelectorAll(`${selector}`)[0];
			let footnoteBlockNumber = document.querySelectorAll(`${selector} .footnote-header .title .footnote-number`)[0];
			let footnoteBlockText = document.querySelectorAll(`${selector} .text`)[0];

			// update the footnote number, text and unhide this verse's footnote block
			footnoteBlockNumber.innerText = footnoteNumber;
			footnoteBlockText.innerHTML = footnoteText;
			footnoteBlock.classList.remove('hidden');
			footnoteBlock.classList.add('block');
		}
	}

	function hideFootnote(chapter, verse, translation) {
		const selector = `.footnote-${chapter}-${verse}-${translation}`;
		const footnoteBlock = document.querySelectorAll(`${selector}`);

		footnoteBlock.forEach((element) => {
			element.classList.remove('hidden', 'block');
			element.classList.add('hidden');
		});
	}

	function isTranslationUrduOrPersian(id) {
		return [43, 174].includes(selectableVerseTranslations[id].language_id) && !selectableVerseTranslations[id].is_roman;
	}

	function isTranslationRTL(id) {
		return rightToLeftVerseTranslations.includes(selectableVerseTranslations[id].resource_id);
	}

	// function detectVersesInFootnote(footnote) {
	// 	const regex = /\d{0,9}(:\d{0,9})*/g;
	// 	let matches = footnote.match(regex);
	// 	matches = matches.filter(function (e) {
	// 		return e;
	// 	});
	// 	if (matches.length > 0) console.log(matches);
	// }

	window.supClick = supClick;
</script>

<div class="flex flex-col print:break-inside-avoid">
	<span class="{isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'} {isTranslationUrduOrPersian(verseTranslation.resource_id) && 'font-Urdu'}">
		{@html verseTranslation.text.replace(/<sup/g, `<sup onclick='supClick(this)' title='Show footnote' data-chapter='${value.meta.chapter}' data-verse='${value.meta.verse}' data-translation=${verseTranslationID} class='${footnoteSupClasses}' `)}
	</span>

	<!-- translation footnotes -->
	<div class={translationFootnoteClasses}>
		<div class="footnote-header flex flex-row justify-between font-semibold">
			<div class="title">
				<span>Footnote #</span>
				<span class="footnote-number">...</span>
			</div>

			<!-- close footnote button -->
			<button on:click={() => hideFootnote(value.meta.chapter, value.meta.verse, verseTranslationID)} class="opacity-70" title="Close footnote"><CrossSolid size={6} /></button>
		</div>
		<div class="text {isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'} {isTranslationUrduOrPersian(verseTranslation.resource_id) && 'font-Urdu'}">...</div>
	</div>

	<!-- show translaton author name only if more than 1 was selected -->
	{#if $__verseTranslations.length > 1}
		<span class="opacity-70 {isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'}">&mdash; {selectableVerseTranslations[verseTranslation.resource_id].resource_name}</span>
	{/if}
</div>
