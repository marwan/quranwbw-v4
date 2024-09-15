// setting default user settings in localStorage
(async function () {
	setUserSettings();
})();

// this function will also be used by resetSettings.js
export function setUserSettings() {
	let userSettings = JSON.parse(localStorage.getItem('userSettings'));
	let arabicTextSize = 'text-2xl';

	// for larger screens, make 4xl the default for arabic word, else keep the 2xl as default
	if (window.matchMedia('(min-width: 1280px)').matches || window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('(min-width: 768px)').matches) arabicTextSize = 'text-4xl';

	// init if not set
	if (userSettings === undefined || userSettings === null || userSettings === '') userSettings = {};

	// display settings
	if (userSettings.displaySettings === undefined) userSettings.displaySettings = {}; // parent
	if (userSettings.displaySettings.websiteTheme === undefined) userSettings.displaySettings.websiteTheme = 1; // light
	if (userSettings.displaySettings.displayType === undefined) userSettings.displaySettings.displayType = 1; // WBW
	if (userSettings.displaySettings.fontType === undefined) userSettings.displaySettings.fontType = 1; // Uthmanic Hafs Digital
	if (userSettings.displaySettings.wordTranslationEnabled === undefined) userSettings.displaySettings.wordTranslationEnabled = true; // shown
	if (userSettings.displaySettings.wordTransliterationEnabled === undefined) userSettings.displaySettings.wordTransliterationEnabled = true; // shown
	if (userSettings.displaySettings.wordTooltip === undefined) userSettings.displaySettings.wordTooltip = 1; // none
	if (userSettings.displaySettings.autoScrollSpeed === undefined) userSettings.displaySettings.autoScrollSpeed = 40; // x1
	if (userSettings.displaySettings.wakeLockEnabled === undefined) userSettings.displaySettings.wakeLockEnabled = false; // false = enable sleep (default behaviour)
	if (userSettings.displaySettings.englishTerminology === undefined) userSettings.displaySettings.englishTerminology = false; // Quran terminologies langauge (default is Arabic)
	if (userSettings.displaySettings.hideNonDuaPart === undefined) userSettings.displaySettings.hideNonDuaPart = false; // show all words

	// font size settings (child of display settings)
	if (userSettings.displaySettings.fontSizes === undefined) userSettings.displaySettings.fontSizes = {}; // parent
	if (userSettings.displaySettings.fontSizes.arabicText === undefined) userSettings.displaySettings.fontSizes.arabicText = arabicTextSize;
	if (userSettings.displaySettings.fontSizes.wordTranslationText === undefined) userSettings.displaySettings.fontSizes.wordTranslationText = 'text-sm';
	if (userSettings.displaySettings.fontSizes.verseTranslationText === undefined) userSettings.displaySettings.fontSizes.verseTranslationText = 'text-sm';

	// translation settings
	if (userSettings.translations === undefined) userSettings.translations = {}; // parent
	if (userSettings.translations.word === undefined) userSettings.translations.word = 1; // English
	if (userSettings.translations.verse_v1 === undefined) userSettings.translations.verse_v1 = [1, 131]; // Transliteration, The Clear Quran
	if (userSettings.translations.tafsir === undefined) userSettings.translations.tafsir = 30; // tafisr ibn kathir

	// audio settings
	if (userSettings.audioSettings === undefined) userSettings.audioSettings = {}; // parent
	if (userSettings.audioSettings.reciter === undefined) userSettings.audioSettings.reciter = 10; // Mishary Rashid Alafasy
	if (userSettings.audioSettings.translationReciter === undefined) userSettings.audioSettings.translationReciter = 1; // English - Ibrahim Walk (Sahih International)
	if (userSettings.audioSettings.playbackSpeed === undefined) userSettings.audioSettings.playbackSpeed = 3; // x1
	if (userSettings.audioSettings.playTranslation === undefined) userSettings.audioSettings.playTranslation = false; // verse translation
	if (userSettings.audioSettings.versePlayButton === undefined) userSettings.audioSettings.versePlayButton = 1; // play selected verse

	// quiz settings
	if (userSettings.quiz === undefined) userSettings.quiz = {}; // parent
	if (userSettings.quiz.correctAnswers === undefined) userSettings.quiz.correctAnswers = 0;
	if (userSettings.quiz.wrongAnswers === undefined) userSettings.quiz.wrongAnswers = 0;

	// last read
	if (userSettings.lastRead === undefined) userSettings.lastRead = {};

	// user bookmarks
	if (userSettings.userBookmarks === undefined) userSettings.userBookmarks = [];

	// user bookmarks
	if (userSettings.userNotes === undefined) userSettings.userNotes = {};

	// favourite chapters
	if (userSettings.favouriteChapters === undefined) userSettings.favouriteChapters = [1, 5, 18];

	// Initial Setup
	if (userSettings.initialSetupCompleted === undefined) userSettings.initialSetupCompleted = false;

	// chapter number
	if (userSettings.chapter === undefined) userSettings.chapter = 1;

	localStorage.setItem('userSettings', JSON.stringify(userSettings));
}
