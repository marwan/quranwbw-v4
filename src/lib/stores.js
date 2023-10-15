import { writable } from "svelte/store";

// for toggling elements depending on page
export const currentPage = writable("home");

// self explanatory
export const chapterNumber = writable(1);

// Uthmani, IndoPak, etc...
export const wordType = writable(1);

// local user settings
export const userSettingsStore = writable(JSON.stringify(JSON.parse(localStorage.getItem("userSettings"))));
