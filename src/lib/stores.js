import { writable } from "svelte/store";

// to store the current page
export const currentPageStore = writable("home");

// to store the chapter number
export const chapterNumberStore = writable(1);

// to store the chapter data fetched from the API
export const chapterDataStore = writable(null);

// to store the word type - Uthmani, IndoPak, etc...
export const wordTypeStore = writable(1);

// to store the display type - WBW, Normal, Continuous, etc...
export const displayTypeStore = writable(0);

// to store the local user settings from LocalStorage
export const userSettingsStore = writable(JSON.stringify(JSON.parse(localStorage.getItem("userSettings"))));

// to store a random number (for now) when changing verses due to some issues while re-rendering the component (probably because I'm still learning Svelte)
export const pageURLStore = writable(null);
