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
		tafsir: 'Exegesis',
		tajweed: 'Pronunciation',
		juz: 'Part'
	},

	// if Arabic
	false: {
		chapter: 'Surah',
		chapters: 'Surahs',
		verse: 'Ayah',
		verses: 'Ayahs',
		supplications: 'Duas',
		tafsir: 'Tafsir',
		tajweed: 'Tajweed',
		juz: 'Juz'
	}
};

export function term(terminology) {
	return englishTerms[get(__englishTerminology)][terminology];
}
