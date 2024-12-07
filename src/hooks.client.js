// Setting default user settings in localStorage
(async function () {
	setUserSettings();
})();

/**
 * Sets the default user settings in localStorage.
 * This function is also used by resetSettings.js.
 */
export function setUserSettings() {
	let userSettings = JSON.parse(localStorage.getItem('userSettings'));
	let arabicTextSize = 'text-2xl';

	// For larger screens, make 'text-4xl' the default for Arabic word, else keep 'text-2xl' as default.
	if (window.matchMedia('(min-width: 1280px)').matches || window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('(min-width: 768px)').matches) {
		arabicTextSize = 'text-4xl';
	}

	// Initialize userSettings if not set
	if (!userSettings) userSettings = {};

	// Display settings
	if (!userSettings.displaySettings) userSettings.displaySettings = {}; // Parent

	userSettings.displaySettings.websiteTheme = userSettings.displaySettings.websiteTheme || 1; // Gold
	userSettings.displaySettings.displayType = userSettings.displaySettings.displayType || 1; // WBW
	userSettings.displaySettings.fontType = userSettings.displaySettings.fontType || 1; // Uthmanic Hafs Digital
	userSettings.displaySettings.wordTranslationEnabled = userSettings.displaySettings.wordTranslationEnabled !== undefined ? userSettings.displaySettings.wordTranslationEnabled : true; // Shown
	userSettings.displaySettings.wordTransliterationEnabled = userSettings.displaySettings.wordTransliterationEnabled !== undefined ? userSettings.displaySettings.wordTransliterationEnabled : true; // Shown
	userSettings.displaySettings.wordTooltip = userSettings.displaySettings.wordTooltip || 1; // None
	userSettings.displaySettings.autoScrollSpeed = userSettings.displaySettings.autoScrollSpeed || 40; // x1
	userSettings.displaySettings.wakeLockEnabled = userSettings.displaySettings.wakeLockEnabled !== undefined ? userSettings.displaySettings.wakeLockEnabled : false; // Enable sleep (default behaviour)
	userSettings.displaySettings.englishTerminology = userSettings.displaySettings.englishTerminology !== undefined ? userSettings.displaySettings.englishTerminology : false; // Quran terminologies language (default is Arabic)
	userSettings.displaySettings.hideNonDuaPart = userSettings.displaySettings.hideNonDuaPart !== undefined ? userSettings.displaySettings.hideNonDuaPart : false; // Show all words

	// Font size settings (child of display settings)
	if (!userSettings.displaySettings.fontSizes) userSettings.displaySettings.fontSizes = {}; // Parent

	userSettings.displaySettings.fontSizes.arabicText = userSettings.displaySettings.fontSizes.arabicText || arabicTextSize;
	userSettings.displaySettings.fontSizes.wordTranslationText = userSettings.displaySettings.fontSizes.wordTranslationText || 'text-sm';
	userSettings.displaySettings.fontSizes.verseTranslationText = userSettings.displaySettings.fontSizes.verseTranslationText || 'text-sm';

	// Translation settings
	if (!userSettings.translations) userSettings.translations = {}; // Parent

	userSettings.translations.word = userSettings.translations.word || 1; // English
	userSettings.translations.verse_v1 = userSettings.translations.verse_v1 || [1, 131]; // Transliteration, The Clear Quran
	userSettings.translations.tafsir = userSettings.translations.tafsir || 30; // Tafsir Ibn Kathir

	// Transliteration settings
	if (!userSettings.transliteration) userSettings.transliteration = {}; // Parent

	userSettings.transliteration.word = userSettings.transliteration.word || 1; // Normal

	// Audio settings
	if (!userSettings.audioSettings) userSettings.audioSettings = {}; // Parent

	userSettings.audioSettings.reciter = userSettings.audioSettings.reciter || 10; // Mishary Rashid Alafasy
	userSettings.audioSettings.translationReciter = userSettings.audioSettings.translationReciter || 1; // English - Ibrahim Walk (Sahih International)
	userSettings.audioSettings.playbackSpeed = userSettings.audioSettings.playbackSpeed || 3; // x1
	userSettings.audioSettings.playTranslation = userSettings.audioSettings.playTranslation !== undefined ? userSettings.audioSettings.playTranslation : false; // Verse translation
	userSettings.audioSettings.versePlayButton = userSettings.audioSettings.versePlayButton || 1; // Play selected verse

	// Quiz settings
	if (!userSettings.quiz) userSettings.quiz = {}; // Parent

	userSettings.quiz.correctAnswers = userSettings.quiz.correctAnswers || 0;
	userSettings.quiz.wrongAnswers = userSettings.quiz.wrongAnswers || 0;

	// Last read
	userSettings.lastRead = userSettings.lastRead || {};

	// User bookmarks
	userSettings.userBookmarks = userSettings.userBookmarks || [];

	// User notes
	userSettings.userNotes = userSettings.userNotes || {};

	// Favourite chapters
	userSettings.favouriteChapters = userSettings.favouriteChapters || [1, 5, 18];

	// Initial setup
	userSettings.initialSetupCompleted = userSettings.initialSetupCompleted !== undefined ? userSettings.initialSetupCompleted : false;

	// Chapter number
	userSettings.chapter = userSettings.chapter || 1;

	// One-time modals (is shown?)
	if (!userSettings.oneTimeModals) userSettings.oneTimeModals = {}; // Parent

	userSettings.oneTimeModals.changelogModal = userSettings.oneTimeModals.changelogModal !== undefined ? userSettings.oneTimeModals.changelogModal : false;

	// Save updated userSettings to localStorage
	localStorage.setItem('userSettings', JSON.stringify(userSettings));
}
