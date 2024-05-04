import { __downloadedDataSettings } from '$utils/stores';
import { fetchChapterData } from '$utils/fetchChapterData';

const chaptersToDownload = 5;

export async function downloadData() {
	let downloadedChapters = [];

	for (let chapter = 1; chapter <= chaptersToDownload; chapter++) {
		await fetchChapterData(chapter, true);
		downloadedChapters.push(chapter);
		__downloadedDataSettings.set({ downloadedChapters: downloadedChapters });
		console.log(`Fetched chapter ${chapter}`);
	}
}
