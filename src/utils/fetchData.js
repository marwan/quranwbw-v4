import { get } from 'svelte/store';
import { __wordType, __chapterData, __wordTranslation, __verseTranslations, __timestampData, __chapterDataLoaded } from '$utils/stores';
import { apiEndpoint, staticEndpoint } from '$data/websiteSettings';
import { quranMetaData } from '$data/quranMeta';

// we first fetch specific verses (startVerse to endVerse), and then fetch the complete chapter data which will then be cached by the user's browser
export async function fetchChapterData(complete = false, chapter, startVerse, endVerse, download = false) {
	const wordType = get(__wordType);
	const wordTranslation = get(__wordTranslation);
	const verseTranslations = get(__verseTranslations).toString();

	// if complete = true, fetch all the verses, else fetch from startVerse to endVerse
	const verses = complete ? `${chapter}:1,${chapter}:${quranMetaData[chapter].verses}` : `${chapter}:${startVerse},${chapter}:${endVerse}`;

	let apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses,
			word_type: wordType,
			word_translation: wordTranslation,
			verse_translation: verseTranslations,
			between: true
			// random: Math.floor(Math.random() * 999999999) + 0
		});

	// if the user is on the chapter page, fetch and set the data in store
	const response = await fetch(apiURL);
	const data = await response.json();

	// download = true means that we are just fetching api data without updating the __chapterData store (for downloadData)
	if (!download) __chapterData.set(data.data.verses);

	// if the complete data was requested
	if (complete) {
		__chapterDataLoaded.set(true);
		localStorage.setItem('chapterDataLoaded', true);
	}
	// if only the partial data was requested, load the complete data too
	else fetchChapterData(true, chapter);
}

// function to fetch individual verses
export async function fetchVersesData(verses, wordType, wordTranslation, verseTranslations) {
	const apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses: verses,
			word_type: wordType,
			word_translation: wordTranslation,
			verse_translation: verseTranslations
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	__chapterData.set(data.data.verses);
	return data.data.verses;
}

export async function fetchTimestampData(chapter) {
	const apiURL = `${staticEndpoint}/timestamp/${chapter}.json?v=1`;
	const response = await fetch(apiURL);
	const data = await response.json();

	__timestampData.set(data);
}
