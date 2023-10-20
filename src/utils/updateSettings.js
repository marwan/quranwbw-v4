import { wordTypeStore, displayTypeStore } from "./stores";

// function to update website settings
export function updateSettings(type, value) {
  // get the settings from localStorage
  const localSettings = JSON.parse(localStorage.getItem("userSettings"));

  switch (type) {
    case "wordType":
      wordTypeStore.set(value);
      localSettings.displaySettings.wordType = value;
      break;
    case "displayType":
      displayTypeStore.set(value);
      localSettings.displaySettings.displayType = value;
      break;
  }

  // update the settings back into localStorage
  localStorage.setItem("userSettings", JSON.stringify(localSettings));
}
