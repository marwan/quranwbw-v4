import { updateSettings } from '$utils/updateSettings';

// checking if the user have any bookmarks from the old v3 update and transfer them to the new website's local settings
export function checkOldBookmarks() {
	let oldBookmarks = localStorage.getItem('bookmarks');

	if (oldBookmarks !== null) {
		const bookmarks = oldBookmarks.slice(0, -1).split('|');

		bookmarks.forEach((bookmark) => {
			updateSettings({ type: 'userBookmarks', key: bookmark, oldCheck: true, set: true });
		});
	}

	// remove the old bookmarks localStorage as it's no longer needed
	localStorage.removeItem('bookmarks');
}
