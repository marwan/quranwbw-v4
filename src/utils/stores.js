import { writable } from 'svelte/store';

const userSettings = JSON.parse(localStorage.getItem('userSettings'));

// to store the current page
export const __currentPage = writable('home');

// to store the chapter number
export const __chapterNumber = writable(1);

// to store the page number
export const __pageNumber = writable(1);

// to store the chapter data fetched from the API
export const __chapterData = writable(null);

// to store the user notes data fetched from the API
export const __notesData = writable(null);

// to store the verse key
export const __verseKey = writable('1:1');

// to store the local user settings from LocalStorage
export const __userSettings = writable(JSON.stringify(userSettings));

// to store the local user settings from LocalStorage
export const __userNotes = writable(JSON.parse(localStorage.getItem('userNotes')));

// to store the user bookmarks
export const __userBookmarks = writable(userSettings.userBookmarks);

// to store the token
export const __userToken = writable(localStorage.getItem('userToken'));

// to store the word type - Uthmani, IndoPak, etc...
export const __wordType = writable(userSettings.displaySettings.wordType);

// to store the word translation
export const __wordTranslation = writable(userSettings.translations.word);

// to store the verse translations
export const __verseTranslations = writable(userSettings.translations.verse);

// to store the word translation toggle
export const __wordTranslationEnabled = writable(userSettings.displaySettings.wordTranslationEnabled);

// to store the word transliteration toggle
export const __wordTransliterationEnabled = writable(userSettings.displaySettings.wordTransliterationEnabled);

// to store the v4 font tajweed boolean
export const __tajweedEnabled = writable(userSettings.displaySettings.tajweedEnabled);

// to store reciter
export const __reciter = writable(userSettings.audioSettings.reciter);

// to store playback speed
export const __playbackSpeed = writable(userSettings.audioSettings.playbackSpeed);

// to store the display type - WBW, Normal, Continuous, etc...
export const __displayType = writable(userSettings.displaySettings.displayType);

// to store the website theme
export const __websiteTheme = writable(userSettings.displaySettings.websiteTheme);

// to store the last read key
export const __lastRead = writable(userSettings.lastRead);

// to store the user's favourite chapters
export const __favouriteChapters = writable(userSettings.favouriteChapters);

// to store a random number (for now) when changing verses due to some issues while re-rendering the component (probably because I'm still learning Svelte)
export const __pageURL = writable(null);

// to store the toggle boolean settings drawer
export const __settingsDrawerHidden = writable(true);

// to store the toggle boolean for top navbar,
export const __topNavbarVisible = writable(true);

// to store the toggle boolean for bottom navbar
export const __bottomNavbarVisible = writable(true);

// to store the chapters and juz info of a mushaf page
export const __mushafPageDivisions = writable(null);

// to store the word tooltip type
export const __wordTooltip = writable(userSettings.displaySettings.wordTooltip);

// to store the bottom alert info
export const __bottomAlert = writable({
	visible: false,
	message: '...'
});

// to store all the audio settings
export const __audioSettings = writable({
	isPlaying: false,
	timesToRepeat: 1,
	timesRepeated: 0,
	delay: 0
});

// to store the morphology verse/word key
export const __morphologyKey = writable(null);

// to store all the offline data settings
export const __downloadedDataSettings = writable({
	allChaptersDownloaded: false,
	downloadedChapters: []
});

// to store the auto scroll speed
export const __autoScrollSpeed = writable(userSettings.displaySettings.autoScrollSpeed);
