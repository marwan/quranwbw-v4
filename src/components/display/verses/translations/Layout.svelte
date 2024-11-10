<script>
	export let verseTranslationID;
	export let verseTranslation;
	export let value;

	import CrossSolid from '$svgs/CrossSolid.svelte';
	import { __userSettings, __verseTranslations } from '$utils/stores';
	import { selectableVerseTranslations, rightToLeftVerseTranslations } from '$data/options';

	const translationFootnoteClasses = `hidden my-2 footnote-block px-2 py-2 border-2 border-gray-200 rounded-2xl theme-grayscale footnote-${value.meta.verse}-${verseTranslationID}`;
	const footnoteSupClasses = 'ml-1 mt-1 px-2 py-1 bg-gray-200 rounded-full font-semibold cursor-pointer system-font';

	let footnoteId,
		footnoteVerse,
		footnoteTranslation,
		footnoteText = 'loading...',
		footnoteNumber = '...';

	async function supClick(event) {
		footnoteText = 'loading...';
		footnoteId = +event.getAttribute('foot_note');
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
			let footnoteBlockNumber = document.querySelectorAll(`${selector} .footnote-header .title .footnote-number`);
			let footnoteBlockText = document.querySelectorAll(`${selector} .text`);

			// update the footnote number, text and unhide this verse's footnote block
			footnoteBlockNumber[nodeId].innerText = footnoteNumber;
			footnoteBlockText[nodeId].innerHTML = footnoteText;
			footnoteBlock[nodeId].classList.remove('hidden');
			footnoteBlock[nodeId].classList.remove('block');
		}
	}

	function hideFootnote(verse, translation) {
		const nodeId = verse === 1 ? 1 : 0;
		const selector = `.footnote-${verse}-${translation}`;
		document.querySelectorAll(selector)[nodeId].classList.remove('block');
		document.querySelectorAll(selector)[nodeId].classList.add('hidden');
	}

	function isTranslationUrdu(id) {
		return selectableVerseTranslations[id].language_id === 174 && !selectableVerseTranslations[id].is_roman;
	}

	function isTranslationRTL(id) {
		return rightToLeftVerseTranslations.includes(selectableVerseTranslations[id].resource_id);
	}

	window.supClick = supClick;
</script>

<div class="flex flex-col print:break-inside-avoid">
	<span class="{isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'} {isTranslationUrdu(verseTranslation.resource_id) && 'font-Urdu'}">
		{@html verseTranslation.text.replace(/<sup/g, `<sup onclick='supClick(this)' title='Show footnote' data-verse='${value.meta.verse}' data-translation=${verseTranslationID} class='${footnoteSupClasses}' `)}
	</span>

	<!-- translation footnotes -->
	<div class={translationFootnoteClasses}>
		<div class="footnote-header flex flex-row justify-between font-semibold">
			<div class="title">
				<span>Footnote #</span>
				<span class="footnote-number">...</span>
			</div>

			<!-- close footnote button -->
			<button on:click={() => hideFootnote(value.meta.verse, verseTranslationID)} class="opacity-70" title="Close footnote"><CrossSolid size={6} /></button>
		</div>
		<div class="text {isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'} {isTranslationUrdu(verseTranslation.resource_id) && 'font-Urdu'}">...</div>
	</div>

	<!-- show translaton author name only if more than 1 was selected -->
	{#if $__verseTranslations.length > 1}
		<span class="opacity-70 {isTranslationRTL(verseTranslation.resource_id) && 'direction-rtl'}">&mdash; {selectableVerseTranslations[verseTranslation.resource_id].resource_name}</span>
	{/if}
</div>
