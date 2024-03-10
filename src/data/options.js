export const displayOptions = {
  1: { displayID: 1, displayName: "WBW", displayComponent: "WBWDisplay", layout: "wbw", continuous: false },
  2: { displayID: 2, displayName: "Normal", displayComponent: "NormalDisplay", layout: "normal", continuous: false },
  3: { displayID: 3, displayName: "Continuous WBW", displayComponent: "ContinuousNormalDisplay", layout: "wbw", continuous: true },
  4: { displayID: 4, displayName: "Continuous Normal", displayComponent: "ContinuousNormalDisplay", layout: "normal", continuous: true },
  5: { displayID: 5, displayName: "Side By Side", displayComponent: "SideBySideDisplay", layout: "normal", continuous: false },
};

export const selectableFontTypes = {
  1: { id: 1, font: "Uthmanic Hafs Digital" },
  2: { id: 2, font: "Indopak Madinah" },
  3: { id: 3, font: "Uthmanic Hafs Mushaf V4" },
  4: { id: 4, font: "Uthmanic Hafs Mushaf V4 (Tajweed)" },
};

export const selectableVerseTranslations = {
  1: {
    id: 1,
    language: "Arabic",
    author: "Transliteration (Tajweed)",
    slug: "arb_transliteration_tajweed",
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
    language: "Urdu",
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
    language: "Hindi",
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
  1: { id: 1, language: "English" },
  2: { id: 2, language: "Urdu" },
  3: { id: 3, language: "Hindi" },
  4: { id: 4, language: "Indonesian" },
  5: { id: 5, language: "Bangla" },
  6: { id: 6, language: "Turkish" },
  7: { id: 7, language: "Tamil" },
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
