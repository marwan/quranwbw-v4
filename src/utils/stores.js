import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let __websiteOnline,
	__currentPage,
	__chapterNumber,
	__pageNumber,
	__chapterData,
	__notesData,
	__verseKey,
	__userSettings,
	__userNotes,
	__userBookmarks,
	__userToken,
	__wordType,
	__wordTranslation,
	__verseTranslations,
	__wordTranslationEnabled,
	__wordTransliterationEnabled,
	__tajweedEnabled,
	__reciter,
	__playbackSpeed,
	__displayType,
	__websiteTheme,
	__lastRead,
	__favouriteChapters,
	__pageURL,
	__settingsDrawerHidden,
	__topNavbarVisible,
	__bottomNavbarVisible,
	__mushafPageDivisions,
	__wordTooltip,
	__bottomAlert,
	__audioSettings,
	__morphologyKey,
	__downloadedDataSettings,
	__autoScrollSpeed,
	__firstVerseOnPage,
	__audioModalVisible,
	__notesModalVisible,
	__tajweedRulesModalVisible,
	__tokenModalVisible,
	__wakeLockEnabled;

if (browser) {
	const userSettings = JSON.parse(localStorage.getItem('userSettings'));

	// to store network status of website
	__websiteOnline = writable(true);

	// to store the current page
	__currentPage = writable('home');

	// to store the chapter number
	__chapterNumber = writable(1);

	// to store the page number
	__pageNumber = writable(1);

	// to store the chapter data fetched from the API
	__chapterData = writable(null);

	// to store the user notes data fetched from the API
	__notesData = writable(null);

	// to store the verse key
	__verseKey = writable('1:1');

	// to store the local user settings from LocalStorage
	__userSettings = writable(JSON.stringify(userSettings));

	// to store the user notes
	__userNotes = writable(userSettings.userNotes);

	// to store the user bookmarks
	__userBookmarks = writable(userSettings.userBookmarks);

	// to store the token
	__userToken = writable(localStorage.getItem('userToken'));

	// to store the word type - Uthmani, IndoPak, etc...
	__wordType = writable(userSettings.displaySettings.wordType);

	// to store the word translation
	__wordTranslation = writable(userSettings.translations.word);

	// to store the verse translations
	__verseTranslations = writable(userSettings.translations.verse);

	// to store the word translation toggle
	__wordTranslationEnabled = writable(userSettings.displaySettings.wordTranslationEnabled);

	// to store the word transliteration toggle
	__wordTransliterationEnabled = writable(userSettings.displaySettings.wordTransliterationEnabled);

	// to store the v4 font tajweed boolean
	__tajweedEnabled = writable(userSettings.displaySettings.tajweedEnabled);

	// to store reciter
	__reciter = writable(userSettings.audioSettings.reciter);

	// to store playback speed
	__playbackSpeed = writable(userSettings.audioSettings.playbackSpeed);

	// to store the display type - WBW, Normal, Continuous, etc...
	__displayType = writable(userSettings.displaySettings.displayType);

	// to store the website theme
	__websiteTheme = writable(userSettings.displaySettings.websiteTheme);

	// to store the last read key
	__lastRead = writable(userSettings.lastRead);

	// to store the user's favourite chapters
	__favouriteChapters = writable(userSettings.favouriteChapters);

	// to store a random number (for now) when changing verses due to some issues while re-rendering the component (probably because I'm still learning Svelte)
	__pageURL = writable(null);

	// to store the toggle boolean settings drawer
	__settingsDrawerHidden = writable(true);

	// to store the toggle boolean for top navbar,
	__topNavbarVisible = writable(true);

	// to store the toggle boolean for bottom navbar
	__bottomNavbarVisible = writable(true);

	// to store the chapters and juz info of a mushaf page
	__mushafPageDivisions = writable(null);

	// to store the word tooltip type
	__wordTooltip = writable(userSettings.displaySettings.wordTooltip);

	// to store the bottom alert info
	__bottomAlert = writable({
		visible: false,
		message: '...'
	});

	// to store all the audio settings
	__audioSettings = writable({
		isPlaying: false,
		timesToRepeat: 1,
		timesRepeated: 0,
		delay: 0
	});

	// to store the morphology verse/word key
	__morphologyKey = writable(null);

	// to store all the offline data settings
	__downloadedDataSettings = writable({
		allChaptersDownloaded: false,
		downloadedChapters: []
	});

	// to store the auto scroll speed
	__autoScrollSpeed = writable(userSettings.displaySettings.autoScrollSpeed);

	// to store the first verse on page
	__firstVerseOnPage = writable(1);

	// modals ===============
	__audioModalVisible = writable(false);
	__notesModalVisible = writable(false);
	__tajweedRulesModalVisible = writable(false);
	__tokenModalVisible = writable(false);

	__wakeLockEnabled = writable(userSettings.displaySettings.wakeLockEnabled);
}

export {
	__websiteOnline,
	__currentPage,
	__chapterNumber,
	__pageNumber,
	__chapterData,
	__notesData,
	__verseKey,
	__userSettings,
	__userNotes,
	__userBookmarks,
	__userToken,
	__wordType,
	__wordTranslation,
	__verseTranslations,
	__wordTranslationEnabled,
	__wordTransliterationEnabled,
	__tajweedEnabled,
	__reciter,
	__playbackSpeed,
	__displayType,
	__websiteTheme,
	__lastRead,
	__favouriteChapters,
	__pageURL,
	__settingsDrawerHidden,
	__topNavbarVisible,
	__bottomNavbarVisible,
	__mushafPageDivisions,
	__wordTooltip,
	__bottomAlert,
	__audioSettings,
	__morphologyKey,
	__downloadedDataSettings,
	__autoScrollSpeed,
	__firstVerseOnPage,
	__audioModalVisible,
	__notesModalVisible,
	__tajweedRulesModalVisible,
	__tokenModalVisible,
	__wakeLockEnabled
};
