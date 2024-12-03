export const tajweedColorIds = {
	// colorId : tajweed ruling Id

	// grays
	1: 2,
	2: 4,
	3: 5,
	4: 6,
	5: 7,
	6: 8,
	7: 9,
	8: 10,

	// maroon
	9: 13,
	10: 14,
	11: 15,

	// reds
	12: 17,
	13: 18,
	14: 19,

	// oranges
	15: 21,
	16: 22,

	// gold
	17: 24,
	18: 25,

	// greens
	19: 27,
	20: 28,
	21: 29,
	22: 30,

	// symbol
	23: 31,
	24: 32,

	// assorted
	25: 33,
	26: 34,
	27: 35,

	// blacks
	28: 36,
	29: 37,
	30: 38,

	// icons
	31: 39,
	32: 41
};

export const tajweedRulings = {
	1: {
		code: 'ﱇ',
		title: 'Normal Text',
		description: null
	},

	// grays
	2: {
		code: 'B',
		title: 'Alif Hamzat Wasl',
		description: 'Alif Hamzatul-wasl is represented by small (ص) on top of it and it is read when the verse is started by it. However, if it comes in the middle of verse or word, then it is silent. But, if it comes after a Waqf (Pause) sign and you stop at it, then it is read.'
	},
	3: {
		code: 'C',
		title: 'Idghaam / Silent (action: to merge)',
		description: 'Represents letters that are not pronounced. For instance, the silent “L” in “اَلشَّمْس” (ash-shams) is never pronounced. Similarly, the Noon in “كَأَن لَّمْ” (ka’an lamma) is pronounced like “كَأَلَّمْ” (ka’allam).'
	},
	4: {
		code: 'C',
		title: 'Lam Ash-Shamsiyyah - (اللام الشمسية)',
		description: 'Silent Laam within a word.'
	},
	5: {
		code: 'C',
		title: 'Alif Tafriq (Grouped) - (الألف المحذوفة (الخنجرية))',
		description: 'The silent Alif, usually at the end of the word or sometimes in the middle.'
	},
	6: {
		code: 'C',
		title: 'Hamzat Al Wasl within words - (همزة الوصل داخل الكلمة)',
		description: 'Silencing the Alif with a small (ص)  on top of it found within the words.'
	},
	7: {
		code: 'C',
		title: 'Marsum Khilaf Al Lafz - (المرسوم خلاف اللفظ)',
		description: 'Words which are drawn not like how they are pronounced having vowel/diacritic.'
	},
	8: {
		code: 'C',
		title: 'Idghaam kaamil (without Ghunna) - (الإدغام الكامل (بلاغنّه))',
		description: 'Letters complete silent and without Ghunna (Nazalization). Some letters with no nasalization exist. With Noon Sakinah or Tanween. The Idgham rule of joining words apply to those. It is also called the Idgham Rule without Ghunnah.'
	},
	9: {
		code: 'C',
		title: 'Idghaam Mutajaanis - (والإدغام المتجانس)',
		description: 'The homogeneous Idghaam. Mutajaanis is when letters merge two Makhaarij of different characteristics without closeness in proximity. E.g. Taa & Daa, Taa & Toa'
	},
	10: {
		code: 'C',
		title: 'Idghaam Mutaqaarib - (والإدغام المتقارب)',
		description: 'The convergent Idghaam. Mutaqaarib is when letters merge two Makhaarij with different characteristics. E.g. Laam & Raa, Qaaf & Khaaf'
	},

	// maroons
	11: {
		code: 'DJE',
		title: 'Indicates compulsory lengthening (Madd)',
		description: 'When you encounter red letters, it signifies that you should elongate the pronunciation of the vowel. There are three variations:'
	},
	12: {
		code: 'D',
		title: 'Madd Lazim (6 Harakah) (Heavy Words)',
		description: 'Necessary prolongation (six vowels), which is about half a second, as seen in “الْحَآجّ” (al-haajj).'
	},
	13: {
		code: 'D',
		title: 'Madd Lazim (Heavy Words) – (المدّ اللازم (الكلمي المثقل))',
		description: 'Necessary prolongation (six vowels) when the next letter has a Tashdid.'
	},
	14: {
		code: 'D',
		title: 'Madd Lazim (Literal) – (المدّ اللازم (الحرفي))',
		description: 'Necessary prolongation (six vowels) for the Separate letter words (e.g. Alif Laam Meem).'
	},
	15: {
		code: 'D',
		title: 'Madd Farq (Merged) – (المدّ اللازم (الحرفي))',
		description: 'Necessary prolongation (six vowels) is in continuation of Hamza at the beginning of the word causing the prolongation effect unnoticeable.'
	},

	// reds
	16: {
		code: 'J',
		title: 'Madd Wajib (4-5 Harakah)',
		description: 'Obligatory prolongation (four or five vowels), such as in words like “أَوْلِيَآء” (awliyaa).'
	},
	17: {
		code: 'J',
		title: 'Madd Wajib (Muttasil) – (المدّ الواجب (المتصل))',
		description: 'Obligatory prolongation (four or five vowels) in between the words.'
	},
	18: {
		code: 'J',
		title: 'Madd Wajib (Munfasil) – (المدّ الواجب (المنفصل))',
		description: 'Obligatory prolongation (four or five vowels) at the end of the words.'
	},
	19: {
		code: 'J',
		title: 'Madd (Silah Kubra) – المدّ (الصلة الكبرى)))',
		description: 'Obligatory prolongation (four or five vowels) while connecting next word .'
	},

	// oranges
	20: {
		code: 'E',
		title: 'Madd Arid Lis-sukoon (2-4 or 6 Harakah)',
		description: 'Permissible prolongation (two, four, or six vowels).'
	},
	21: {
		code: 'E',
		title: 'Madd Arid Lis-sukoon – (المدّ العارض للسكون)',
		description: 'Prolonging the last word’s ending before stop either at the end of the Ayah or a Waqf (Pause) Sign. (2-4 or 6 vowels)'
	},
	22: {
		code: 'E',
		title: 'Madd Linn – (مدّ اللين)',
		description: 'Prolonging the last word’s ending softly before stop either at the end of the Ayah or a Waqf (Pause) Sign having Sukoon. (2-4 or 6 vowels)'
	},

	// golds
	23: {
		code: 'F',
		title: 'Madd (2 Harakah)',
		description: 'Normal prolongation (two vowels).'
	},
	24: {
		code: 'F',
		title: 'Alif Khanjariyyah – (الألف الخنجرية)',
		description: 'The dagger Alif or standing Fatha denoting general prolongation. (2 vowels)'
	},
	25: {
		code: 'F',
		title: 'Madd Silah Sughra – (مدّ الصِّلَة الصغرى)',
		description: 'Extend the minor connection with general prolongation. (2 vowels)'
	},

	// greens
	26: {
		code: 'G',
		title: 'Ghunnah',
		description: 'Denotes nasalization. The sound comes from the nose and continues as long as two vowels.'
	},
	27: {
		code: 'G',
		title: 'Ghunnah Ikhfa’a (to hide) – (غنّة الإخفاء)',
		description: 'Nasalization with silence. It pronounces through noon as Sakinah or the tanween that is apart from the Shaddah. Its characterization lies between the Izhar and Idgham.'
	},
	28: {
		code: 'G',
		title: 'Ghunnah Ikhfa’a Shafawy (to hide) – (إخفاء شفوي)',
		description: 'Nasalization with Verbal silence (stretching sound of the end letter). If a [ب] is followed after a meem sakinah, then apply a ghunnah while hiding the meem sakin before continuing to the [ب].'
	},
	29: {
		code: 'G',
		title: 'Ghunnah Noon Tashdid – (النون المشددة - (غنة مع الشدة))',
		description: 'Nasalization on Noon with Tashdid.'
	},
	30: {
		code: 'G',
		title: 'Ghunnah Meem Tashdid – (الميم المشددة - (غنة مع الشدة))',
		description: 'Nasalization on Meem with Tashdid.'
	},

	// 2 symbols
	31: {
		code: 'M',
		title: 'Iqlab (to convert) – (الإقلاب)',
		description: 'Ghunna / Nasalization over small Meem. It changes the shekinah or tanween into the Meem due to Ghunnah on meem. It follows through Baa. Meem recites through closing the lips and holding it for the length of Ghunnah.'
	},
	32: {
		code: 'M',
		title: 'ldgham Bi-Ghunnah – (الإدغام بغنّة)',
		description: 'Ghunnah / Nasalization after the idgham (silent - grayyy) letter in previous word.'
	},

	// 3 assorted colors
	33: {
		code: 'G',
		title: 'ldgham Mutasil – (الإدغام المتماثل)',
		description: 'Letter with Tashdid having previous word’s ending letter same as that letter.'
	},
	34: {
		code: 'H',
		title: 'Tafkhim (Thickening) – (التفخيم)',
		description: 'Used for letters that require emphatic pronunciation. When you encounter dark blue letters, emphasize their sound. For example, “الحرام” (al-haraam).'
	},
	35: {
		code: 'I',
		title: 'Qalqalah (Echoing) – (القلقلة)',
		description: 'Indicates the sound of Qalqalah (a echoing sound). When pronounced, these letters appear to have an echoing quality. For instance, “لقد” (laqad).'
	},

	// 3 blacks
	36: {
		code: 'A',
		title: "Madd I'wadh – (مدّ العِوَض)",
		description: 'Normal prolongation (two vowels). Compensated prolongation, occurs only at the end of a word that has Tanween fatha.'
	},
	37: {
		code: 'A',
		title: 'At-Tarqiq (Thinning) – (الترقيق)',
		description: 'Thinning pronunciation while the vowels remain black.'
	},
	38: {
		code: 'A',
		title: 'Izhar (to make clear) – (الإظهار)',
		description: '(Noon and Tanween remain black.) The rule pronounces the Sakinah or Tanween clearly without the addition of extra Ghunnah. We pronounce Sakinah or tanween through normal short Ghunnah.'
	},

	// 3 symbols
	39: {
		code: 'L',
		title: 'Waqf Mark with Shapes Outline',
		description: 'Indicating end diacritic to be silenced/ignored when stopping at the Waqf Sign (its purpose is to understand the meaning).'
	},
	40: {
		code: 'W',
		title: 'Normal Ayah Icon with number',
		description: 'Indicating the end of the Ayah. (e.g. 1:1)'
	},
	41: {
		code: 'Y',
		title: 'Special Ayah Icon with number',
		description: 'Indicating preferred continuation without stopping (e.g. 110:1) and also continuation of meaning from previous Ayah.'
	}
};
