// setting default user settings in localStorage
(async function () {
	let userSettings = JSON.parse(localStorage.getItem('userSettings'));

	// init if not set
	if (userSettings === undefined || userSettings === null || userSettings === '') userSettings = {};

	// display settings
	if (userSettings.displaySettings === undefined) userSettings.displaySettings = {}; // parent
	if (userSettings.displaySettings.websiteTheme === undefined) userSettings.displaySettings.websiteTheme = 1; // light
	if (userSettings.displaySettings.displayType === undefined) userSettings.displaySettings.displayType = 1; // WBW
	if (userSettings.displaySettings.wordType === undefined) userSettings.displaySettings.wordType = 1; // Uthmani
	if (userSettings.displaySettings.wordTranslationEnabled === undefined) userSettings.displaySettings.wordTranslationEnabled = true; // shown
	if (userSettings.displaySettings.wordTransliterationEnabled === undefined) userSettings.displaySettings.wordTransliterationEnabled = true; // shown
	if (userSettings.displaySettings.tajweedEnabled === undefined) userSettings.displaySettings.tajweedEnabled = true; // shown
	if (userSettings.displaySettings.wordTooltip === undefined) userSettings.displaySettings.wordTooltip = 1; // none

	// font size settings (child of display settings)
	if (userSettings.displaySettings.fontSizes === undefined) userSettings.displaySettings.fontSizes = {}; // parent
	if (userSettings.displaySettings.fontSizes.arabicText === undefined) userSettings.displaySettings.fontSizes.arabicText = 'text-4xl';
	if (userSettings.displaySettings.fontSizes.wordTranslationText === undefined) userSettings.displaySettings.fontSizes.wordTranslationText = 'text-sm';
	if (userSettings.displaySettings.fontSizes.verseTranslationText === undefined) userSettings.displaySettings.fontSizes.verseTranslationText = 'text-sm';

	// translation settings
	if (userSettings.translations === undefined) userSettings.translations = {}; // parent
	if (userSettings.translations.word === undefined) userSettings.translations.word = 1; // English
	if (userSettings.translations.verse === undefined) userSettings.translations.verse = [1, 15]; // Transliteration (Tajweed), The Clear Quran (Mustafa Khattab)

	// audio settings
	if (userSettings.audioSettings === undefined) userSettings.audioSettings = {}; // parent
	if (userSettings.audioSettings.reciter === undefined) userSettings.audioSettings.reciter = 10; // Mishary Rashid Alafasy
	if (userSettings.audioSettings.playbackSpeed === undefined) userSettings.audioSettings.playbackSpeed = 3; // x1

	// last read
	if (userSettings.lastRead === undefined) userSettings.lastRead = '1:1';

	// user bookmarks
	if (userSettings.userBookmarks === undefined) userSettings.userBookmarks = [];

	// favourite chapters
	if (userSettings.favouriteChapters === undefined) userSettings.favouriteChapters = [1, 5, 18];

	// Initial Setup
	if (userSettings.initialSetupCompleted === undefined) userSettings.initialSetupCompleted = false;

	// chapter number
	if (userSettings.chapter === undefined) userSettings.chapter = 1;

	localStorage.setItem('userSettings', JSON.stringify(userSettings));

	// user notes
	let userNotes = JSON.parse(localStorage.getItem('userNotes'));
	if (userNotes === undefined || userNotes === null || userNotes === '') userNotes = {};
	localStorage.setItem('userNotes', JSON.stringify(userNotes));
})();
