export const displayOptions = {
	1: { displayID: 1, displayName: 'Word by Word', displayComponent: 'WBWDisplay', layout: 'wbw', continuous: false, customStyle: '' },
	2: { displayID: 2, displayName: 'Normal', displayComponent: 'NormalDisplay', layout: 'normal', continuous: false, customStyle: '' },
	3: { displayID: 3, displayName: 'Continuous Word by Word', displayComponent: 'ContinuousDisplay', layout: 'wbw', continuous: true, customStyle: 'text-center direction-rtl' },
	4: { displayID: 4, displayName: 'Continuous Normal', displayComponent: 'ContinuousDisplay', layout: 'normal', continuous: true, customStyle: 'text-center direction-rtl' },
	5: { displayID: 5, displayName: 'Side By Side', displayComponent: 'SideBySideDisplay', layout: 'normal', continuous: false, customStyle: '' }
};

export const selectableFontTypes = {
	1: { id: 1, font: 'Uthmanic Hafs Digital' },
	2: { id: 2, font: 'Uthmanic Hafs Mushaf' },
	3: { id: 3, font: 'Indopak Madinah' }
};

export const selectableThemes = {
	1: { id: 1, name: 'Light', palette: 2 },
	2: { id: 2, name: 'Blue', palette: 1 },
	3: { id: 3, name: 'Green', palette: 1 },
	4: { id: 4, name: 'Black', palette: 1 },
	5: { id: 5, name: 'Sepia', palette: 2 }
};

export const verseTranslationsLanguages = {
	1: { id: 1, language: 'Bangla' },
	2: { id: 2, language: 'English' },
	3: { id: 3, language: 'French' },
	4: { id: 4, language: 'Hindi' },
	5: { id: 5, language: 'Hindi Literal' },
	6: { id: 6, language: 'Indonesian' },
	7: { id: 7, language: 'Tamil' },
	8: { id: 8, language: 'Transliteration' },
	9: { id: 9, language: 'Turkish' },
	10: { id: 10, language: 'Urdu' },
	11: { id: 11, language: 'Urdu Literal' }
};

export const selectableVerseTranslations = {
	1: {
		id: 1,
		language: 'Transliteration',
		author: 'Tajweed Transliteration',
		slug: 'arb_transliteration_tajweed'
	},
	2: {
		id: 2,
		language: 'Transliteration',
		author: 'Transliteration',
		slug: 'transliteration_normal'
	},
	10: {
		id: 10,
		language: 'English',
		author: 'Hilali & Khan',
		slug: 'eng_muhammadtaqiudd'
	},
	11: {
		id: 11,
		language: 'English',
		author: 'Sahih International',
		slug: 'eng_ummmuhammad'
	},
	12: {
		id: 12,
		language: 'English',
		author: 'Abul Alaa Maududi',
		slug: 'eng_maududi'
	},
	13: {
		id: 13,
		language: 'English',
		author: 'Pickthall',
		slug: 'eng_mohammedmarmadu'
	},
	14: {
		id: 14,
		language: 'English',
		author: 'Yusuf Ali',
		slug: 'eng_yusufaliorig'
	},
	15: {
		id: 15,
		language: 'English',
		author: 'The Clear Quran (Mustafa Khattab)',
		slug: 'eng_mustafakhattaba'
	},
	16: {
		id: 16,
		language: 'English',
		author: 'Abdel Haleem',
		slug: 'eng_abdelhaleem'
	},
	17: {
		id: 17,
		language: 'English',
		author: 'Almuntakhab Fi Tafsir Alquran Alkarim',
		slug: 'eng_almuntakhabfita'
	},
	18: {
		id: 18,
		language: 'English',
		author: 'Mufti Taqi Usmani',
		slug: 'eng_muftitaqiusmani'
	},
	19: {
		id: 19,
		language: 'English',
		author: 'Tahfeem-ul-Quran by Abul Alaa Maududi',
		slug: 'eng_tafheem'
	},
	20: {
		id: 20,
		language: 'English',
		author: 'Tafsir al-Jalalayn',
		slug: 'eng_jalalayn'
	},
	30: {
		id: 30,
		language: 'Urdu',
		author: 'Ahmed Ali',
		slug: 'urd_ahmedali'
	},
	31: {
		id: 31,
		language: 'Urdu',
		author: 'Abul Alaa Maududi',
		slug: 'urd_abulaalamaududi'
	},
	32: {
		id: 32,
		language: 'Urdu',
		author: 'Muhammad Junagarhi',
		slug: 'urd_muhammadjunagar'
	},
	33: {
		id: 33,
		language: 'Urdu Literal',
		author: 'Abul Alaa Maududi',
		slug: 'urd_abulaalamaududi_la'
	},
	34: {
		id: 34,
		language: 'Hindi',
		author: 'Suhel Farooq & Saifur Rahman',
		slug: 'hin_suhelfarooqkhan'
	},
	35: {
		id: 35,
		language: 'Hindi Literal',
		author: 'Suhel Farooq & Saifur Rahman',
		slug: 'hin_suhelfarooqkhan_la'
	},
	36: {
		id: 36,
		language: 'Indonesian',
		author: 'Indonesian Islamic Affairs Ministry',
		slug: 'ind_indonesianislam'
	},
	37: {
		id: 37,
		language: 'Bangla',
		author: 'Zohurul Hoque',
		slug: 'ben_zohurulhoque'
	},
	38: {
		id: 38,
		language: 'Bangla',
		author: 'Muhiuddin Khan',
		slug: 'ben_muhiuddinkhan'
	},
	39: {
		id: 39,
		language: 'Turkish',
		author: 'Diyanet Isleri',
		slug: 'tur_diyanetisleri'
	},
	40: {
		id: 40,
		language: 'Turkish',
		author: 'Elmalili Hamdi Yazir',
		slug: 'tur_elmalilihamdiya'
	},
	41: {
		id: 41,
		language: 'Tamil',
		author: 'Jan Turst Foundation',
		slug: 'tam_janturstfoundat'
	},
	42: {
		id: 42,
		language: 'French',
		author: 'Muhammad Hamidullah',
		slug: 'fr_hamidullah'
	}
};

export const selectableWordTranslations = {
	1: { id: 5, language: 'Bangla' },
	2: { id: 1, language: 'English' },
	3: { id: 11, language: 'French' },
	4: { id: 8, language: 'German' },
	5: { id: 3, language: 'Hindi' },
	6: { id: 4, language: 'Indonesian' },
	7: { id: 10, language: 'Ingush' },
	8: { id: 9, language: 'Russian' },
	9: { id: 7, language: 'Tamil' },
	10: { id: 6, language: 'Turkish' },
	11: { id: 2, language: 'Urdu' }
};

export const selectableReciters = {
	1: { id: 1, reciter: 'Abdul Basit (Mujawwad)', url: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/' },
	2: { id: 2, reciter: 'Abdul Basit (Murattal)', url: 'https://verses.quran.com/AbdulBaset/Murattal/mp3/' },
	3: { id: 3, reciter: 'Abdul-Rahman Al-Sudais', url: 'https://mirrors.quranicaudio.com/everyayah/Abdurrahmaan_As-Sudais_192kbps/' },
	4: { id: 4, reciter: 'Abu Bakr Ash-Shaatree', url: 'https://mirrors.quranicaudio.com/everyayah/Abu_Bakr_Ash-Shaatree_128kbps/' },
	5: { id: 5, reciter: 'Dr. Farhat Hashmi (Urdu/Hindi WBW)', url: 'https://everyayah.com/data/translations/urdu_farhat_hashmi/' },
	6: { id: 6, reciter: 'Hani Ar-Rifai', url: 'https://everyayah.com/data/Hani_Rifai_192kbps/' },
	7: { id: 7, reciter: 'Maher Al-Muaiqly', url: 'https://mirrors.quranicaudio.com/everyayah/Maher_AlMuaiqly_64kbps/' },
	8: { id: 8, reciter: 'Mahmoud Khalil Al-Husary', url: 'https://everyayah.com/data/Husary_128kbps/' },
	9: { id: 9, reciter: 'Mahmoud Khalil Al-Husary (with gaps)', url: 'https://everyayah.com/data/Husary_Muallim_128kbps/' },
	10: { id: 10, reciter: 'Mishary Rashid Alafasy', url: 'https://everyayah.com/data/Alafasy_128kbps/' },
	11: { id: 11, reciter: 'Mohamed El-Minshawi (Mujawwad)', url: 'https://mirrors.quranicaudio.com/everyayah/Minshawy_Mujawwad_192kbps/' },
	12: { id: 12, reciter: 'Mohamed El-Minshawi (Teacher)', url: 'https://everyayah.com/data/Minshawy_Teacher_128kbps/' },
	13: { id: 13, reciter: 'Muhammad Ayyub', url: 'https://mirrors.quranicaudio.com/everyayah/Muhammad_Ayyoub_128kbps/' },
	14: { id: 14, reciter: 'Nasser Al Qatami', url: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/' },
	15: { id: 15, reciter: 'Saood Ash-Shuraym', url: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps/' },
	16: { id: 16, reciter: 'Yasser Ad-Dossari', url: 'https://mirrors.quranicaudio.com/everyayah/Yasser_Ad-Dussary_128kbps/' }
};

export const selectablePlaybackSpeeds = {
	1: { id: 1, speed: 0.5 },
	2: { id: 2, speed: 0.75 },
	3: { id: 3, speed: 1 },
	4: { id: 4, speed: 1.25 },
	5: { id: 5, speed: 1.5 },
	6: { id: 6, speed: 1.75 },
	7: { id: 7, speed: 2 }
};

export const selectableTooltipOptions = {
	1: { id: 1, name: 'None' },
	2: { id: 2, name: 'Transliteration' },
	3: { id: 3, name: 'Translation' },
	4: { id: 4, name: 'Both' }
};

export const screenBreakpoints = {
	sm: 640,
	md: 768,
	lg: 1024
};

export const mushafFontLinks = {
	COLRv1: 'https://fonts.quranwbw.com/Hafs/KFGQPC-v4/COLRv1',
	'OT-SVG-TAJWEED-LIGHT': 'https://fonts.quranwbw.com/Hafs/KFGQPC-v4/OT-SVG/OT-SVG - TAJWEED-TEXT - LIGHT',
	'OT-SVG-TAJWEED-DARK': 'https://fonts.quranwbw.com/Hafs/KFGQPC-v4/OT-SVG/OT-SVG - TAJWEED-TEXT - DARK',
	'OT-SVG-BLACK-LIGHT': 'https://fonts.quranwbw.com/Hafs/KFGQPC-v4/OT-SVG/OT-SVG - BLACK-TEXT - LIGHT',
	'OT-SVG-BLACK-DARK': 'https://fonts.quranwbw.com/Hafs/KFGQPC-v4/OT-SVG/OT-SVG - TAJWEED-TEXT - DARK'
};
