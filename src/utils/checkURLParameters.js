import { updateSettings } from "$utils/updateSettings";
import { displayOptions, selectableFontTypes, selectableThemes, selectableWordTranslations } from "$data/options";

const params = new URLSearchParams(window.location.search);

const wordType = +params.get("word_type");
const displayType = +params.get("display_type");
const websiteTheme = +params.get("website_theme");
const wordTranslation = +params.get("word_translation");

const initialSetup = params.get("initial_setup_completed");
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
