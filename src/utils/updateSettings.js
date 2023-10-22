import { userSettingsStore, wordTypeStore, displayTypeStore, verseTranslationsStore } from "./stores";
import { selectableVerseTranslations } from "./options";

// function to update website settings
export function updateSettings(props) {
  // get the settings from localStorage
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));

  switch (props.type) {
    // for word types
    case "wordType":
      wordTypeStore.set(props.value);
      userSettings.displaySettings.wordType = props.value;
      break;

    // for display types
    case "displayType":
      displayTypeStore.set(props.value);
      userSettings.displaySettings.displayType = props.value;
      break;

    // for verse translations
    case "verseTranslation":
      let verseTranslationsArray = [];

      // loop through all the available verse translations
      for (const key of Object.keys(selectableVerseTranslations)) {
        const translationID = selectableVerseTranslations[key].id;
        try {
          // we check if this translation is checked, if true, push to array
          if (document.getElementById(`verseTranslationCheckbox-${translationID}`).checked) {
            verseTranslationsArray.push(translationID);
          }
        } catch (error) {
          console.error(error);
        }
      }

      verseTranslationsStore.set(verseTranslationsArray);
      userSettings.translations.verse = verseTranslationsArray;
      break;
  }

  // update the settings back into localStorage
  userSettingsStore.set(JSON.stringify(userSettings));
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
}
