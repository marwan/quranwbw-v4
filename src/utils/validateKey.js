import { get } from 'svelte/store';
import { __currentPage, __chapterNumber } from '$utils/stores';
import { quranMetaData } from '$data/quranMeta';
import { staticEndpoint } from '$data/websiteSettings';

// Validate search terms in the Quran navigation modal
export async function validateKey(key) {
	let results = {};

	// Check if the key is a number
	if (isNumeric(key)) {
		handleNumericKey(key, results);
	} else if (isSpecialCharKey(key)) {
		await handleSpecialCharKey(key, results);
	} else {
		await handleStringKey(key, results);
	}

	// Remove chapters key if it's empty
	if (results.chapters && Object.keys(results.chapters).length === 0) {
		delete results.chapters;
	}

	return Object.keys(results).length ? results : false;
}

function handleNumericKey(key, results) {
	if (key >= 1 && key <= 114) results.chapter = key;
	if (get(__currentPage) === 'chapter' && key >= 1 && key <= quranMetaData[get(__chapterNumber)].verses) {
		results.verse = key;
	}
	if (key >= 1 && key <= 604) results.page = key;
	if (key >= 1 && key <= 30) results.juz = key;
}

function isSpecialCharKey(key) {
	return [':', '-', '.'].some((char) => key.includes(char));
}

async function handleSpecialCharKey(key, results) {
	const modifiedKey = key.replace(/[-.]/g, ':');
	if (isValidVerseKey(modifiedKey)) results.key = modifiedKey;
	if (await isValidWordKey(modifiedKey)) results.word = modifiedKey;
}

async function handleStringKey(key, results) {
	const keySplit = key.split(' ');

	if (keySplit.length === 2 && isValidVerseKey(formatVerseKey(keySplit))) {
		results.key = formatVerseKey(keySplit);
	} else if (keySplit.length === 3 && (await isValidWordKey(formatWordKey(keySplit)))) {
		results.word = formatWordKey(keySplit);
	} else if (key.length > 2) {
		results.chapters = findChapters(key);
	}
}

function formatVerseKey(keySplit) {
	return `${+keySplit[0]}:${+keySplit[1]}`;
}

function formatWordKey(keySplit) {
	return `${+keySplit[0]}:${+keySplit[1]}:${+keySplit[2]}`;
}

function findChapters(key) {
	let chapters = {};

	for (let chapter = 1; chapter <= 114; chapter++) {
		const { arabic, transliteration, translation, alternateNames } = quranMetaData[chapter];
		if ([arabic, transliteration, translation, alternateNames].some((term) => term.toLowerCase().includes(key.toLowerCase()))) {
			chapters[chapter] = { transliteration, translation };
		}
	}

	return chapters;
}

// Validate verse key (chapter:verse)
export function isValidVerseKey(key) {
	if (hasWhitespace(key) || !isNonEmptyString(key) || !containsOnlyTwoParts(key)) return false;

	const [chapter, verse] = key.split(':').map(Number);
	return isValidChapter(chapter) && isValidVerse(chapter, verse);
}

// Validate word key (chapter:verse:word)
export async function isValidWordKey(key) {
	if (hasWhitespace(key) || !isNonEmptyString(key) || !containsOnlyThreeParts(key)) return false;

	const [chapter, verse, word] = key.split(':').map(Number);
	if (!isValidChapter(chapter) || !isValidVerse(chapter, verse)) return false;

	const verseKey = `${chapter}:${verse}`;
	const data = await fetchVerseKeyData();

	return word >= 1 && word <= data[verseKey].words;
}

function hasWhitespace(key) {
	return key.includes(' ');
}

function isNonEmptyString(key) {
	return key !== null && key !== undefined && key !== '';
}

function containsOnlyTwoParts(key) {
	return key.split(':').length === 2;
}

function containsOnlyThreeParts(key) {
	return key.split(':').length === 3;
}

function isValidChapter(chapter) {
	return chapter >= 1 && chapter <= 114;
}

function isValidVerse(chapter, verse) {
	return verse >= 1 && verse <= quranMetaData[chapter].verses;
}

async function fetchVerseKeyData() {
	const response = await fetch(`${staticEndpoint}/v4/meta/verseKeyData.json`);
	return response.json();
}

// Check if a value is numeric
function isNumeric(value) {
	return /^-?\d+$/.test(value);
}
