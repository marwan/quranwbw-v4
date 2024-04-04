import { get } from "svelte/store";
import { __userToken, __userSettings, __wordType, __displayType, __websiteTheme, __wordTranslation, __verseTranslations, __wordTranslationEnabled, __wordTransliterationEnabled, __reciter, __playbackSpeed, __lastRead, __tajweedEnabled } from "$utils/stores";
import { selectableVerseTranslations } from "$data/options";

const userSettingsEndpoint = "https://api.quranwbw.com/v1/user/settings";

// function to update website settings
export function updateSettings(props) {
  // get the settings from localStorage
  const userSettings = JSON.parse(localStorage.getItem("userSettings"));

  switch (props.type) {
    // for word types
    case "wordType":
      __wordType.set(props.value);
      userSettings.displaySettings.wordType = props.value;
      break;

    // for display types
    case "displayType":
      __displayType.set(props.value);
      userSettings.displaySettings.displayType = props.value;
      break;

    // for website theme
    case "websiteTheme":
      __websiteTheme.set(props.value);
      userSettings.displaySettings.websiteTheme = props.value;
      document.documentElement.classList = "";
      document.documentElement.classList = `theme-${props.value}`;
      break;

    // for word translation view
    case "wordTranslationEnabled":
      __wordTranslationEnabled.set(props.value);
      userSettings.displaySettings.wordTranslationEnabled = props.value;
      break;

    // for word transliteration view
    case "wordTransliterationEnabled":
      __wordTransliterationEnabled.set(props.value);
      userSettings.displaySettings.wordTransliterationEnabled = props.value;
      break;

    // for tajweed fonts
    case "tajweedEnabled":
      __tajweedEnabled.set(props.value);
      userSettings.displaySettings.tajweedEnabled = props.value;
      break;

    // for word translation
    case "wordTranslation":
      __wordTranslation.set(props.value);
      userSettings.translations.word = props.value;
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

      // if the value is an array
      if (props.value instanceof Array) verseTranslationsArray = props.value;

      __verseTranslations.set(verseTranslationsArray);
      userSettings.translations.verse = verseTranslationsArray;
      break;

    // for verse reciter
    case "reciter":
      __reciter.set(props.value);
      userSettings.audioSettings.reciter = props.value;
      break;

    // for playback speed
    case "playbackSpeed":
      __playbackSpeed.set(props.value);
      userSettings.audioSettings.playbackSpeed = props.value;
      break;

    // for Initial Setup
    case "initialSetupCompleted":
      userSettings.initialSetupCompleted = props.value;
      break;

    case "userBookmarks":
      const key = props.key;
      let userBookmarks = userSettings["userBookmarks"];

      // for old imports, only push if bookmark doesn't exist
      if (props.oldCheck === true) {
        if (userBookmarks.includes(key) === false) userBookmarks.push(key);
      }

      // for existing bookmarks...
      // if the bookmark (key) already exists, then remove it, else add it
      else userBookmarks.includes(key) ? (userBookmarks = userBookmarks.filter((x) => x !== key)) : userBookmarks.push(key);

      // update the bookmarks
      userSettings.userBookmarks = userBookmarks;
      break;

    // for last read
    case "lastRead":
      __lastRead.set(props.value);
      userSettings.lastRead = props.value;
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
        let newSize = fontSizePresets[newIndex];

        // perform the action
        if (newSize !== undefined) {
          if (props.value !== undefined) newSize = props.value;

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
  }

  // update the settings back into localStorage and global store
  __userSettings.set(JSON.stringify(userSettings));
  localStorage.setItem("userSettings", JSON.stringify(userSettings));

  // push to cloud if token exists
  // if (get(__userToken)) {
  //   uploadSettings(JSON.stringify(userSettings));
  // }
}

function uploadSettings(settings) {
  fetch("https://api.quranwbw.com/v1/user/settings", {
    method: "POST",
    headers: {
      "user-token": get(__userToken),
      "Content-Type": "application/json",
    },
    body: settings,
  });
}
