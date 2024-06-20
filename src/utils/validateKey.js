import { get } from 'svelte/store';
import { __currentPage, __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';

// function for basic key (chapter:verse) validation
export function validateVerseKey(key) {
	// basic
	if (key === null || key === undefined || key === '') return false;

	// key should not be a number
	if (!isNaN(key)) return false;

	const keySplit = key.split(':');

	// we need only one ":"
	if (keySplit.length !== 2) return false;

	const chapter = +keySplit[0],
		verse = +keySplit[1];

	// chapter and verse should be numbers
	if (isNaN(chapter) || isNaN(verse)) return false;

	// min-max chapter number
	if (chapter < 1 || chapter > 114) return false;

	// min-max verse number
	if (verse < 1 || verse > quranMetaData[chapter].verses) return false;

	// should not contain any whitespaces
	if (key.indexOf(' ') >= 0) return false;

	return true;
}

export function validateKey(key) {
	let results = {};

	if (isNumeric(key)) {
		if (key >= 1 && key <= 114) results.chapter = key;

		if (get(__currentPage) === 'chapter') {
			if (key >= 1 && key <= quranMetaData[get(__chapterNumber)].verses) results.verse = key;
		}

		if (key >= 1 && key <= 604) results.page = key;
		if (key >= 1 && key <= 30) results.juz = key;
	}

	if (validateVerseKey(key)) results.key = key;

	return Object.keys(results).length === 0 ? false : results;
}

// https://stackoverflow.com/a/24457420
function isNumeric(value) {
	return /^-?\d+$/.test(value);
}
