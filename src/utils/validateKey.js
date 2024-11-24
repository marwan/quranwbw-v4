import { get } from 'svelte/store';
import { __currentPage, __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';
import { staticEndpoint } from '$data/websiteSettings';

// for the search terms in Quran navigation modal
export async function validateKey(key) {
	let results = {};

	// if key is a number, check for chapter, verse, page, or juz number
	if (isNumeric(key)) {
		if (key >= 1 && key <= 114) results.chapter = key;
		if (get(__currentPage) === 'chapter') {
			if (key >= 1 && key <= quranMetaData[get(__chapterNumber)].verses) results.verse = key;
		}
		if (key >= 1 && key <= 604) results.page = key;
		if (key >= 1 && key <= 30) results.juz = key;
	}

	// we allow keys with ":", "-", "."
	else if ([':', '-', '.'].some((char) => key.includes(char))) {
		const modifiedKey = key.replace(/[-.]/g, ':');
		if (isValidVerseKey(modifiedKey)) results.key = modifiedKey;
		if (await isValidWordKey(modifiedKey)) results.word = modifiedKey;
	}

	// for strings having spaces (or not) - could be keys or normal search terms like chapter names
	else if (key.includes(' ') || !key.includes(' ')) {
		const keySplit = key.split(' ');

		// verse key
		if (keySplit.length === 2) {
			const key = `${+keySplit[0]}:${+keySplit[1]}`;
			if (isValidVerseKey(key)) results.key = key.replace('-', ':');
		}

		// word key
		else if (keySplit.length === 3) {
			const key = `${+keySplit[0]}:${+keySplit[1]}:${+keySplit[2]}`;
			if (await isValidWordKey(key)) results.word = key.replace(/-/g, ':');
		}

		// check for chapter names
		if (key.length > 2) {
			results['chapters'] = {};

			for (let chapter = 1; chapter <= 114; chapter++) {
				const arabic = quranMetaData[chapter].arabic;
				const transliteration = quranMetaData[chapter].transliteration;
				const translation = quranMetaData[chapter].translation;
				const alternateNames = quranMetaData[chapter].alternateNames;

				if (arabic.includes(key) || transliteration.toLowerCase().includes(key.toLowerCase()) || translation.toLowerCase().includes(key.toLowerCase()) || alternateNames.toLowerCase().includes(key.toLowerCase())) {
					results['chapters'][`${chapter}`] = {
						transliteration,
						translation
					};
				}
			}
		}
	}

	// remoove chapters key if empty
	if (Object.prototype.hasOwnProperty.call(results, 'chapters')) {
		if (Object.keys(results['chapters']).length === 0) delete results['chapters'];
	}

	const validationResults = Object.keys(results).length === 0 ? false : results;

	return validationResults;
}

// for verse key (chapter:verse) validation
export function isValidVerseKey(key) {
	// should not contain any whitespaces
	if (key.indexOf(' ') >= 0) return false;

	// basic
	if (key === null || key === undefined || key === '') return false;

	// key should not be a number
	if (!isNaN(key)) return false;

	const keySplit = key.split(':');

	// we only need 2 parts
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

// for word key (chapter:verse:word) validation
export async function isValidWordKey(key) {
	// should not contain any whitespaces
	if (key.indexOf(' ') >= 0) return false;

	// basic
	if (key === null || key === undefined || key === '') return false;

	// key should not be a number
	if (!isNaN(key)) return false;

	const keySplit = key.split(':');

	// we only need 3 parts
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
	if (!isValidVerseKey(verseKey)) return false;

	const response = await fetch(`${staticEndpoint}/v4/meta/verseKeyData.json`);
	const data = await response.json();

	if (word < 1 || word > data[verseKey].words) return false;

	return true;
}

// https://stackoverflow.com/a/24457420
function isNumeric(value) {
	return /^-?\d+$/.test(value);
}
