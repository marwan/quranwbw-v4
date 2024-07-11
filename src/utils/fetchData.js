import { get } from 'svelte/store';
import { __fontType, __chapterData, __wordTranslation, __verseTranslations, __timestampData } from '$utils/stores';
import { apiEndpoint, staticEndpoint } from '$data/websiteSettings';
import { selectableFontTypes } from '$data/options';

// we first fetch specific verses (startVerse to endVerse), and then fetch the complete chapter data which will then be cached by the user's browser
export async function fetchChapterData(chapter, download = false) {
	const fontType = get(__fontType);
	const wordTranslation = get(__wordTranslation);
	const verseTranslations = get(__verseTranslations).toString();

	let apiURL =
		`${apiEndpoint}/chapter?` +
		new URLSearchParams({
			chapter: chapter,
			word_type: selectableFontTypes[fontType].apiId,
			word_translation: wordTranslation,
			verse_translation: verseTranslations
			// random: Math.floor(Math.random() * 999999999) + 0
		});

	// if the user is on the chapter page, fetch and set the data in store
	const response = await fetch(apiURL);
	const data = await response.json();

	// download = true means that we are just fetching api data without updating the __chapterData store (for downloadData)
	if (!download) __chapterData.set(data.data.verses);
	// if only the partial data was requested, load the complete data too
	else fetchChapterData(chapter);
}

// function to fetch individual verses
export async function fetchVersesData(verses, fontType, wordTranslation, verseTranslations) {
	const apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses: verses,
			word_type: selectableFontTypes[fontType].apiId,
			word_translation: wordTranslation,
			verse_translation: verseTranslations
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	__chapterData.set(data.data.verses);
	return data.data.verses;
}

// function to fetch timestamps for wbw highlighting
export async function fetchTimestampData(chapter) {
	const apiURL = `${staticEndpoint}/v4/timestamps/${chapter}.json?v=1`;
	const response = await fetch(apiURL);
	const data = await response.json();
	__timestampData.set(data);
}
