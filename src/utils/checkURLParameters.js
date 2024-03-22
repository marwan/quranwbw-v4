import { updateSettings } from "$utils/updateSettings";
import { displayOptions, selectableFontTypes, selectableThemes, selectableWordTranslations } from "$data/options";

const params = new URLSearchParams(window.location.search);

const wordType = +params.get("wordType");
const displayType = +params.get("displayType");
const websiteTheme = +params.get("websiteTheme");
const wordTranslation = +params.get("wordTranslation");

const initialSetup = params.get("initialSetupCompleted");
const initialSetupCompleted = initialSetup === "true";

// word_type
if (wordType !== null && selectableFontTypes[wordType] !== undefined) {
  updateSettings({ type: "wordType", value: wordType });
}

// display_type
if (displayType !== null && displayOptions[displayType] !== undefined) {
  updateSettings({ type: "displayType", value: displayType });
}

// website_theme
if (websiteTheme !== null && selectableThemes[websiteTheme] !== undefined) {
  updateSettings({ type: "websiteTheme", value: websiteTheme });
}

// word_translation
if (wordTranslation !== null && selectableWordTranslations[wordTranslation] !== undefined) {
  updateSettings({ type: "wordTranslation", value: wordTranslation });
}

// initial_setup_completed
if (initialSetup !== null && typeof initialSetupCompleted == "boolean") {
  updateSettings({ type: "initialSetupCompleted", value: initialSetupCompleted });
}
