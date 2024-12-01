import { get } from 'svelte/store';
import { __fontType, __chapterData, __verseTranslationData, __wordTranslation, __wordTransliteration, __verseTranslations, __timestampData } from '$utils/stores';
import { apiEndpoint, staticEndpoint, apiVersion } from '$data/websiteSettings';
import { selectableFontTypes } from '$data/options';

// Fetch specific verses (startVerse to endVerse) and then fetch the complete chapter data to be cached by the user's browser
export async function fetchChapterData(chapter, download = false) {
	__chapterData.set(null);
	const fontType = get(__fontType);
	const wordTranslation = get(__wordTranslation);
	const wordTransliteration = get(__wordTransliteration);

	const apiURL =
		`${apiEndpoint}/chapter?` +
		new URLSearchParams({
			chapter: chapter,
			word_type: selectableFontTypes[fontType].apiId,
			word_translation: wordTranslation,
			word_transliteration: wordTransliteration,
			verse_translation: '1,3',
			version: apiVersion
		});

	// Fetch and set the data in store if the user is on the chapter page
	const response = await fetch(apiURL);
	const data = await response.json();

	// 'download' = true means we are just fetching API data without updating the __chapterData store (for downloadData)
	if (!download) {
		__chapterData.set(data.data.verses);
	} else {
		fetchChapterData(chapter);
	}
}

// Get verse translations from Quran.com's API as a separate request compared to the rest of the verse data (from our API)
export async function fetchVerseTranslationData(chapter) {
	__verseTranslationData.set(null);

	const apiURL =
		`https://api.qurancdn.com/api/qdc/verses/by_chapter/${chapter}?` +
		new URLSearchParams({
			per_page: 286,
			translations: get(__verseTranslations).toString()
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	__verseTranslationData.set(data.verses);
	return data.verses;
}

// Fetch individual verses
export async function fetchVersesData(verses, fontType, wordTranslation, extras) {
	__chapterData.set(null);

	// we don't actuall need this data, but just have to pass it in this function so the page can re-render
	console.log(extras);

	const apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses: verses,
			word_type: selectableFontTypes[fontType].apiId,
			word_translation: wordTranslation,
			word_transliteration: get(__wordTransliteration),
			verse_translation: '1,3',
			version: apiVersion
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	__chapterData.set(data.data.verses);
	return data.data.verses;
}

// Fetch single verses
export async function fetchSingleVerseData(verses, fontType) {
	const apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses: verses,
			word_type: selectableFontTypes[fontType].apiId,
			version: apiVersion
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	return data.data.verses;
}

// Fetch timestamps for word-by-word highlighting
export async function fetchTimestampData(chapter) {
	const apiURL = `${staticEndpoint}/v4/timestamps/${chapter}.json?version=1`;
	const response = await fetch(apiURL);
	const data = await response.json();
	__timestampData.set(data);
}
