import { updateSettings } from "$utils/updateSettings";

export function resetSettings() {
  // display settings
  updateSettings({ type: "websiteTheme", value: 1 });
  updateSettings({ type: "wordType", value: 1 });
  updateSettings({ type: "displayType", value: 1 });
  updateSettings({ type: "wordTranslationEnabled", value: true });
  updateSettings({ type: "wordTransliterationEnabled", value: true });

  // font size settings
  updateSettings({ type: "arabicText", value: "text-4xl" });
  updateSettings({ type: "wordTranslationText", value: "text-sm" });
  updateSettings({ type: "verseTranslationText", value: "text-sm" });

  // translation settings
  updateSettings({ type: "wordTranslation", value: 1 });
  updateSettings({ type: "verseTranslation", value: [1, 15] });

  // audio settings
  updateSettings({ type: "reciter", value: 10 });
  updateSettings({ type: "playbackSpeed", value: 3 });
}
