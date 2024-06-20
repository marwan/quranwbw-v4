import { get } from 'svelte/store';
import { __currentPage, __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';
import { staticEndpoint } from '$data/websiteSettings';

export async function validateKey(key) {
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

	if (await validateWordKey(key)) results.word = key;

	return Object.keys(results).length === 0 ? false : results;
}

// function for verse key (chapter:verse) validation
export function validateVerseKey(key) {
	// should not contain any whitespaces
	if (key.indexOf(' ') >= 0) return false;

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

	return true;
}

// function for word key (chapter:verse:word) validation
export async function validateWordKey(key) {
	// should not contain any whitespaces
	if (key.indexOf(' ') >= 0) return false;

	// basic
	if (key === null || key === undefined || key === '') return false;

	// key should not be a number
	if (!isNaN(key)) return false;

	const keySplit = key.split(':');

	// we need only 2 ":"
	if (keySplit.length !== 3) return false;

	const chapter = +keySplit[0],
		verse = +keySplit[1],
		word = +keySplit[2];

	// chapter and verse should be numbers
	if (isNaN(chapter) || isNaN(verse) || isNaN(word)) return false;

	// min-max chapter number
	if (chapter < 1 || chapter > 114) return false;

	// min-max verse number
	if (verse < 1 || verse > quranMetaData[chapter].verses) return false;

	const verseKey = `${chapter}:${verse}`;

	// chapter:verse should be a valid key
	if (!validateVerseKey(verseKey)) return false;

	const response = await fetch(`${staticEndpoint}/v4/meta/wordsInVerse.json`);
	const data = await response.json();

	if (word < 1 || word > data[verseKey]) return false;

	return true;
}

// https://stackoverflow.com/a/24457420
function isNumeric(value) {
	return /^-?\d+$/.test(value);
}
