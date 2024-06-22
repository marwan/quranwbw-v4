import { get } from 'svelte/store';
import { __englishTerminology } from '$utils/stores';

// using true/false structure to save my time and efforts
export const englishTerms = {
	// if English
	true: {
		chapter: 'Chapter',
		chapters: 'Chapters',
		verse: 'Verse',
		verses: 'Verses',
		supplications: 'Supplications',
		tafsir: 'Interpretation'
	},

	// if Arabic
	false: {
		chapter: 'Surah',
		chapters: 'Surahs',
		verse: 'Ayah',
		verses: 'Ayahs',
		supplications: 'Duas',
		tafsir: 'Tafsir'
	}
};

export function term(terminology) {
	return englishTerms[get(__englishTerminology)][terminology];
}
