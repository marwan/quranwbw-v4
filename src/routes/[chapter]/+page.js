import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { isValidVerseKey } from '$utils/validateKey';
import { quranMetaData } from '$data/quranMeta';

export async function load({ params }) {
	// // if a chapter slug was provided
	if (getIdByKeyword(params.chapter) !== null) {
		goto(`/${getIdByKeyword(params.chapter)}`, { replaceState: false });
	}

	// if a colon exists and the param is a valid key
	if (params.chapter.includes(':') && isValidVerseKey(params.chapter)) {
		goto(`/${params.chapter.split(':')[0]}/${params.chapter.split(':')[1]}`, { replaceState: false });
	}

	// basic chapter number check
	if (isNaN(params.chapter) || params.chapter < 1 || params.chapter > 114) {
		error(404, {
			message: 'Not found'
		});
	}

	return { chapter: params.chapter };
}

function getIdByKeyword(keyword) {
	// Basic checks
	if (keyword.length < 3 || typeof keyword !== 'string' || /\d/.test(keyword) || /\s/.test(keyword) || keyword.toLowerCase() === 'the' || keyword.toLowerCase() === 'of') {
		return null;
	}

	// Remove "the" if it exists at the beginning of the keyword
	if (keyword.toLowerCase().startsWith('the')) {
		keyword = keyword.substring(3);
	}

	keyword = keyword.toLowerCase();
	for (let item of quranMetaData) {
		if (item.id > 0) {
			const transliteration = item.transliteration.replace(/[^a-zA-Z]/g, '').toLowerCase();

			// First check alternate names
			if (item.alternateNames !== undefined && item.alternateNames.includes(keyword)) {
				return item.id;
			}

			// Then check other names
			if (item.arabic.toLowerCase().includes(keyword) || item.translation.toLowerCase().includes(keyword) || transliteration.includes(keyword)) {
				return item.id;
			}
		}
	}
	return null; // Return null if no match is found
}
