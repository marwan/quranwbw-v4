// setting default user settings in localStorage
(async function () {
  let userSettings = JSON.parse(localStorage.getItem("userSettings"));

  // init if not set
  if (userSettings === undefined || userSettings === null || userSettings === "") userSettings = {};

  // display settings
  if (userSettings.displaySettings === undefined) userSettings.displaySettings = {}; // parent
  if (userSettings.displaySettings.displayType === undefined) userSettings.displaySettings.displayType = 1; // WBW
  if (userSettings.displaySettings.wordType === undefined) userSettings.displaySettings.wordType = 1; // Uthmani

  // font size settings (child of display settings)
  if (userSettings.displaySettings.fontSizes === undefined) userSettings.displaySettings.fontSizes = {}; // parent
  if (userSettings.displaySettings.fontSizes.arabicText === undefined) userSettings.displaySettings.fontSizes.arabicText = "text-4xl";
  if (userSettings.displaySettings.fontSizes.wordTranslationText === undefined) userSettings.displaySettings.fontSizes.wordTranslationText = "text-sm";
  if (userSettings.displaySettings.fontSizes.verseTranslationText === undefined) userSettings.displaySettings.fontSizes.verseTranslationText = "text-sm";

  // translation settings
  if (userSettings.translations === undefined) userSettings.translations = {}; // parent
  if (userSettings.translations.word === undefined) userSettings.translations.word = 1; // English
  if (userSettings.translations.verse === undefined) userSettings.translations.verse = [1, 15]; // Transliteration (Tajweed), The Clear Quran (Mustafa Khattab)

  // user bookmarks
  if (userSettings.userBookmarks === undefined) userSettings.userBookmarks = [];

  localStorage.setItem("userSettings", JSON.stringify(userSettings));
})();
