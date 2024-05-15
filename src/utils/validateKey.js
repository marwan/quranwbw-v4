import { quranMetaData } from '$data/quranMeta';

// function for basic key validation
export function validateKey(key) {
	// basic
	if (key === null || key === undefined || key === '') return false;

	// key should not be a number
	if (isNaN(key) === false) return false;

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
