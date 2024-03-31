import { writable } from "svelte/store";

const localSettings = JSON.parse(localStorage.getItem("userSettings"));

// to store the current page
export const __currentPage = writable("home");

// to store the chapter number
export const __chapterNumber = writable(1);

// to store the chapter data fetched from the API
export const __chapterData = writable(null);

// to store the local user settings from LocalStorage
export const __userSettings = writable(JSON.stringify(localSettings));

// to store the word type - Uthmani, IndoPak, etc...
export const __wordType = writable(localSettings.displaySettings.wordType);

// to store the word translation
export const __wordTranslation = writable(localSettings.translations.word);

// to store the verse translations
export const __verseTranslations = writable(localSettings.translations.verse);

// to store the word translation toggle
export const __wordTranslationEnabled = writable(localSettings.displaySettings.wordTranslationEnabled);

// to store the word transliteration toggle
export const __wordTransliterationEnabled = writable(localSettings.displaySettings.wordTransliterationEnabled);

// to store reciter
export const __reciter = writable(localSettings.audioSettings.reciter);

// to store playback speed
export const __playbackSpeed = writable(localSettings.audioSettings.playbackSpeed);

// to store the display type - WBW, Normal, Continuous, etc...
export const __displayType = writable(localSettings.displaySettings.displayType);

// to store the website theme
export const __websiteTheme = writable(localSettings.displaySettings.websiteTheme);

// to store the last read key
export const __lastRead = writable(localSettings.lastRead);

// to store the user's favourite chapters
export const __favouriteChapters = writable(localSettings.favouriteChapters);

// to store a random number (for now) when changing verses due to some issues while re-rendering the component (probably because I'm still learning Svelte)
export const __pageURL = writable(null);

// to store the toggle boolean for top navbar,
export const __topNavbarVisible = writable(true);

// to store the toggle boolean for bottom navbar
export const __bottomNavbarVisible = writable(true);

// to store all the audio settings
export const __audioSettings = writable({
  isPlaying: false,
  timesToRepeat: 1,
  timesRepeated: 0,
  delay: 0,
});

// to store the morphology verse/word key
export const __morphologyKey = writable(null);
