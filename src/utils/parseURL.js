import { get } from 'svelte/store';
import { __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';

// function to parse the URL to get the starting and ending verses
export function parseURL() {
	const chapterTotalVerses = quranMetaData[get(__chapterNumber)].verses;
	const url = window.location.pathname;

	// example verses: /1, /2/255, /2:255, /2/285-286
	const urlParts = url.split(/[/:]/);
	let startVerse, endVerse;

	// for URLs with only chapter number or chapter and verses
	if (urlParts.length >= 2) {
		const chapter = parseInt(urlParts[1], 10) || 1;

		// limit chapter to valid range
		if (chapter < 1 || chapter > 114) {
			startVerse = 1;
			endVerse = chapterTotalVerses;
		} else if (urlParts.length === 2) {
			startVerse = 1;
			endVerse = quranMetaData[chapter].verses;
		} else {
			const verseRange = urlParts[2].split('-');
			startVerse = parseInt(verseRange[0], 10) || 1;
			endVerse = parseInt(verseRange[1], 10) || startVerse;

			// limit verses to valid range
			if (startVerse < 1) startVerse = 1;
			if (endVerse > quranMetaData[chapter].verses) endVerse = quranMetaData[chapter].verses;
			if (startVerse > endVerse) startVerse = endVerse;
		}
	}

	// fallback for URLs without valid verses or chapters
	if (!startVerse || !endVerse) {
		startVerse = 1;
		endVerse = chapterTotalVerses;
	}

	return [startVerse, endVerse];
}
