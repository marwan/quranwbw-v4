import { writable } from "svelte/store";

// for toggling elements depending on page
export const currentPageStore = writable("home");

// self explanatory
export const chapterNumberStore = writable(1);

// Uthmani, IndoPak, etc...
export const wordTypeStore = writable(1);

// WBW, Normal, etc...
export const displayTypeStore = writable(0);

// local user settings
export const userSettingsStore = writable(JSON.stringify(JSON.parse(localStorage.getItem("userSettings"))));

// to store a random number (for now) when changing verses due to some issues while re-rending the component (probably because I'm still learning Svelte)
export const pageURLStore = writable(null);
