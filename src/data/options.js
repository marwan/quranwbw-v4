export const displayOptions = {
  1: { displayID: 1, displayName: "WBW", displayComponent: "WBWDisplay", layout: "wbw", continuous: false },
  2: { displayID: 2, displayName: "Normal", displayComponent: "NormalDisplay", layout: "normal", continuous: false },
  3: { displayID: 3, displayName: "Continuous WBW", displayComponent: "ContinuousNormalDisplay", layout: "wbw", continuous: true },
  4: { displayID: 4, displayName: "Continuous Normal", displayComponent: "ContinuousNormalDisplay", layout: "normal", continuous: true },
  5: { displayID: 5, displayName: "Side By Side", displayComponent: "SideBySideDisplay", layout: "normal", continuous: false },
};

export const selectableFontTypes = {
  1: { id: 1, font: "Uthmanic Hafs Digital" },
  2: { id: 2, font: "Uthmanic Hafs Mushaf" },
  3: { id: 3, font: "Indopak Madinah" },
};

export const selectableThemes = {
  1: { id: 1, name: "Light", palette: 2 },
  2: { id: 2, name: "Blue", palette: 1 },
  3: { id: 3, name: "Green", palette: 1 },
  4: { id: 4, name: "Black", palette: 1 },
  5: { id: 5, name: "Sepia", palette: 2 },
};

export const verseTranslationsLanguages = {
  1: { id: 1, language: "Bangla" },
  2: { id: 2, language: "English" },
  3: { id: 3, language: "Hindi" },
  4: { id: 4, language: "Hindi Literal" },
  5: { id: 5, language: "Indonesian" },
  6: { id: 6, language: "Tamil" },
  7: { id: 7, language: "Transliteration" },
  8: { id: 8, language: "Turkish" },
  9: { id: 9, language: "Urdu" },
  10: { id: 10, language: "Urdu Literal" },
};

export const selectableVerseTranslations = {
  1: {
    id: 1,
    language: "Transliteration",
    author: "Tajweed Transliteration",
    slug: "arb_transliteration_tajweed",
  },
  2: {
    id: 2,
    language: "Transliteration",
    author: "Transliteration",
    slug: "transliteration_normal",
  },
  10: {
    id: 10,
    language: "English",
    author: "Hilali & Khan",
    slug: "eng_muhammadtaqiudd",
  },
  11: {
    id: 11,
    language: "English",
    author: "Sahih International",
    slug: "eng_ummmuhammad",
  },
  12: {
    id: 12,
    language: "English",
    author: "Abul Alaa Maududi",
    slug: "eng_maududi",
  },
  13: {
    id: 13,
    language: "English",
    author: "Pickthall",
    slug: "eng_mohammedmarmadu",
  },
  14: {
    id: 14,
    language: "English",
    author: "Yusuf Ali",
    slug: "eng_yusufaliorig",
  },
  15: {
    id: 15,
    language: "English",
    author: "The Clear Quran (Mustafa Khattab)",
    slug: "eng_mustafakhattaba",
  },
  16: {
    id: 16,
    language: "English",
    author: "Abdel Haleem",
    slug: "eng_abdelhaleem",
  },
  17: {
    id: 17,
    language: "English",
    author: "Almuntakhab Fi Tafsir Alquran Alkarim",
    slug: "eng_almuntakhabfita",
  },
  18: {
    id: 18,
    language: "English",
    author: "Mufti Taqi Usmani",
    slug: "eng_muftitaqiusmani",
  },
  19: {
    id: 19,
    language: "English",
    author: "Tahfeem-ul-Quran by Abul Alaa Maududi",
    slug: "eng_tafheem",
  },
  20: {
    id: 20,
    language: "English",
    author: "Tafsir al-Jalalayn",
    slug: "eng_jalalayn",
  },
  30: {
    id: 30,
    language: "Urdu",
    author: "Ahmed Ali",
    slug: "urd_ahmedali",
  },
  31: {
    id: 31,
    language: "Urdu",
    author: "Abul Alaa Maududi",
    slug: "urd_abulaalamaududi",
  },
  32: {
    id: 32,
    language: "Urdu",
    author: "Muhammad Junagarhi",
    slug: "urd_muhammadjunagar",
  },
  33: {
    id: 33,
    language: "Urdu Literal",
    author: "Abul Alaa Maududi",
    slug: "urd_abulaalamaududi_la",
  },
  34: {
    id: 34,
    language: "Hindi",
    author: "Suhel Farooq & Saifur Rahman",
    slug: "hin_suhelfarooqkhan",
  },
  35: {
    id: 35,
    language: "Hindi Literal",
    author: "Suhel Farooq & Saifur Rahman",
    slug: "hin_suhelfarooqkhan_la",
  },
  36: {
    id: 36,
    language: "Indonesian",
    author: "Indonesian Islamic Affairs Ministry",
    slug: "ind_indonesianislam",
  },
  37: {
    id: 37,
    language: "Bangla",
    author: "Zohurul Hoque",
    slug: "ben_zohurulhoque",
  },
  38: {
    id: 38,
    language: "Bangla",
    author: "Muhiuddin Khan",
    slug: "ben_muhiuddinkhan",
  },
  39: {
    id: 39,
    language: "Turkish",
    author: "Diyanet Isleri",
    slug: "tur_diyanetisleri",
  },
  40: {
    id: 40,
    language: "Turkish",
    author: "Elmalili Hamdi Yazir",
    slug: "tur_elmalilihamdiya",
  },
  41: {
    id: 41,
    language: "Tamil",
    author: "Jan Turst Foundation",
    slug: "tam_janturstfoundat",
  },
};

export const selectableWordTranslations = {
  1: { id: 5, language: "Bangla" },
  2: { id: 1, language: "English" },
  3: { id: 3, language: "Hindi" },
  4: { id: 4, language: "Indonesian" },
  5: { id: 6, language: "Turkish" },
  6: { id: 7, language: "Tamil" },
  7: { id: 2, language: "Urdu" },
};

export const selectableReciters = {
  1: { id: 1, reciter: "Abdul Basit (Mujawwad)", url: "https://verses.quran.com/AbdulBaset/Mujawwad/mp3/" },
  2: { id: 2, reciter: "Abdul Basit (Murattal)", url: "https://verses.quran.com/AbdulBaset/Murattal/mp3/" },
  3: { id: 3, reciter: "Abdul-Rahman Al-Sudais", url: "https://mirrors.quranicaudio.com/everyayah/Abdurrahmaan_As-Sudais_192kbps/" },
  4: { id: 4, reciter: "Abu Bakr Ash-Shaatree", url: "https://mirrors.quranicaudio.com/everyayah/Abu_Bakr_Ash-Shaatree_128kbps/" },
  5: { id: 5, reciter: "Dr. Farhat Hashmi (Urdu/Hindi WBW)", url: "https://everyayah.com/data/translations/urdu_farhat_hashmi/" },
  6: { id: 6, reciter: "Hani Ar-Rifai", url: "https://everyayah.com/data/Hani_Rifai_192kbps/" },
  7: { id: 7, reciter: "Maher Al-Muaiqly", url: "https://mirrors.quranicaudio.com/everyayah/Maher_AlMuaiqly_64kbps/" },
  8: { id: 8, reciter: "Mahmoud Khalil Al-Husary", url: "https://everyayah.com/data/Husary_128kbps/" },
  9: { id: 9, reciter: "Mahmoud Khalil Al-Husary (with gaps)", url: "https://everyayah.com/data/Husary_Muallim_128kbps/" },
  10: { id: 10, reciter: "Mishary Rashid Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  11: { id: 11, reciter: "Mohamed El-Minshawi (Mujawwad)", url: "https://mirrors.quranicaudio.com/everyayah/Minshawy_Mujawwad_192kbps/" },
  12: { id: 12, reciter: "Mohamed El-Minshawi (Teacher)", url: "https://everyayah.com/data/Minshawy_Teacher_128kbps/" },
  13: { id: 13, reciter: "Muhammad Ayyub", url: "https://mirrors.quranicaudio.com/everyayah/Muhammad_Ayyoub_128kbps/" },
  14: { id: 14, reciter: "Nasser Al Qatami", url: "https://everyayah.com/data/Nasser_Alqatami_128kbps/" },
  15: { id: 15, reciter: "Saood Ash-Shuraym", url: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/" },
  16: { id: 16, reciter: "Yasser Ad-Dossari", url: "https://mirrors.quranicaudio.com/everyayah/Yasser_Ad-Dussary_128kbps/" },
};

export const selectablePlaybackSpeeds = {
  1: { id: 1, speed: 0.5 },
  2: { id: 2, speed: 0.75 },
  3: { id: 3, speed: 1 },
  4: { id: 4, speed: 1.5 },
  5: { id: 5, speed: 1.75 },
  6: { id: 6, speed: 2 },
};

// export const selectableSearchTranslations = {
//   // english
//   1: { id: 1, language: "English", author: "Ahmed Ali", code: "en.ahmedali" },
//   2: { id: 2, language: "English", author: "Ahmed Raza Khan", code: "en.ahmedraza" },
//   3: { id: 3, language: "English", author: "Arberry", code: "en.arberry" },
//   4: { id: 4, language: "English", author: "Asad", code: "en.asad" },
//   5: { id: 5, language: "English", author: "Daryabadi", code: "en.daryabadi" },
//   6: { id: 6, language: "English", author: "Hilali & Khan", code: "en.hilali" },
//   7: { id: 7, language: "English", author: "Pickthall", code: "en.pickthall" },
//   8: { id: 8, language: "English", author: "Qaribullah & Darwish", code: "en.qaribullah" },
//   9: { id: 9, language: "English", author: "Saheeh International", code: "en.sahih" },
//   10: { id: 10, language: "English", author: "Sarwar", code: "en.sarwar" },
//   11: { id: 11, language: "English", author: "Yusuf Ali", code: "en.yusufali" },
//   12: { id: 12, language: "English", author: "Maududi", code: "en.maududi" },
//   13: { id: 13, language: "English", author: "Shakir", code: "en.shakir" },
//   14: { id: 14, language: "English", author: "Transliteration", code: "en.transliteration" },
//   15: { id: 15, language: "English", author: "Ibrahim Walk", code: "en.walk" },
//   16: { id: 16, language: "English", author: "Clear Qur'an - Talal Itani", code: "en.itani" },
//   17: { id: 17, language: "English", author: "Mubarakpuri", code: "en.mubarakpuri" },
//   18: { id: 18, language: "English", author: "Qarai", code: "en.qarai" },
//   19: { id: 19, language: "English", author: "Wahiduddin Khan", code: "en.wahiduddin" },
//   20: { id: 20, language: "English", author: "All English Translations", code: "en" },
// };
