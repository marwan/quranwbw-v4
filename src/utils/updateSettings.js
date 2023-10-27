import { userSettingsStore, wordTypeStore, displayTypeStore, verseTranslationsStore } from "$utils/stores";
import { selectableVerseTranslations } from "$data/options";

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

    // for increasing/decreasing font sizes
    case "arabicText": // Arabic words
    case "wordTranslationText": // word translations & transliterations
    case "verseTranslationText": // verse translations & transliterations
      // based upon Tailwind CSS
      const fontSizePresets = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl"];

      // change the font size for each 'element'
      document.querySelectorAll(`.${props.type}`).forEach((element) => {
        const currentSize = element.getAttribute("data-fontSize");
        const currentIndex = fontSizePresets.indexOf(currentSize);

        // set the new index and size
        const newIndex = props.action === "increase" ? currentIndex + 1 : currentIndex - 1;
        const newSize = fontSizePresets[newIndex];

        // perform the action
        if (newSize !== undefined) {
          // remove the current class
          element.classList.remove(currentSize);

          // add the new class
          element.classList.add(newSize);

          // update the attribute
          element.setAttribute("data-fontSize", newSize);

          // update it in localSettings
          userSettings.displaySettings.fontSizes[`${props.type}`] = newSize;
        }
      });

      break;

    // for first time setup
    case "firstTimeSetupCompleted":
      userSettings.firstTimeSetupCompleted = props.value;
      break;
  }

  // update the settings back into localStorage and global store
  userSettingsStore.set(JSON.stringify(userSettings));
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
}
