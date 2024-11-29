import { get } from 'svelte/store';
import { __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';

// function to parse the URL to get the starting and ending verses
// Example URL patterns:
// /1 (chapter 1)
// /2/255 (chapter 2, verse 255)
// /2:255 (alternative format for the same)
// /2#255 (hash alternative)
// /2/285-286 (chapter 2, verses 285-286)
export function parseURL() {
	const chapterTotalVerses = quranMetaData[get(__chapterNumber)].verses;
	const url = window.location.pathname;
	const hash = window.location.hash.slice(1); // Get the hash part of the URL
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

	// check for hash-based verse
	if (hash) {
		const hashVerse = parseInt(hash, 10);
		if (!isNaN(hashVerse)) {
			startVerse = hashVerse;
			endVerse = hashVerse;

			// limit hash-based verse to valid range
			const chapter = parseInt(urlParts[1], 10) || 1;
			if (startVerse < 1) startVerse = 1;
			if (endVerse > quranMetaData[chapter].verses) endVerse = quranMetaData[chapter].verses;
		}
	}

	// fallback for URLs without valid verses or chapters
	if (!startVerse || !endVerse) {
		startVerse = 1;
		endVerse = chapterTotalVerses;
	}

	return [startVerse, endVerse];
}
