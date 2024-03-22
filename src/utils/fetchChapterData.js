import { get } from "svelte/store";
import { currentPageStore, wordTypeStore, chapterDataStore, wordTranslationStore, verseTranslationsStore } from "$utils/stores";
import { apiEndpoint } from "$utils/websiteSettings";
import { quranMetaData } from "$data/quranMeta";

// QuranWBW.com always loads the complete chapter data rather than verses on demand (like Quran.com)
// though the initial loading time might be higher, but for the subsequent visits it will be lower and we get some benefits like:
// - the whole chapter and all its verses can be viewed without ever making another request to the API (eg: /2 or /2/255) unless there'a a change in settings
// - offline capabilities
// Other option would be to load the few initial verses on page load and then the complete data for faster loading times, might think about it later.
export async function fetchChapterData(chapter) {
  const apiURL =
    apiEndpoint +
    new URLSearchParams({
      verses: `${chapter}:1,${chapter}:${quranMetaData[chapter].verses}`,
      word_type: get(wordTypeStore),
      word_translation: get(wordTranslationStore),
      verse_translation: get(verseTranslationsStore).toString(),
      between: true,
    });

  // if the user is on homepage, just fetch the chapter data
  if (get(currentPageStore) === "home") {
    fetch(apiURL);
  }

  // if the user is on other pages, fetch and set the data in store
  else {
    const response = await fetch(apiURL);
    const data = await response.json();
    chapterDataStore.set(data.data.verses);
  }
}
