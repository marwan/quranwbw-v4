import { updateSettings } from '$utils/updateSettings';

// check if the user has any bookmarks from the old v3 update and transfer them to the new website's local settings
export function checkOldBookmarks() {
	const oldBookmarks = localStorage.getItem('bookmarks');

	if (oldBookmarks) {
		const bookmarkList = oldBookmarks.slice(0, -1).split('|');

		bookmarkList.forEach((bookmark) => {
			updateSettings({ type: 'userBookmarks', key: bookmark, oldCheck: true, set: true });
		});

		// remove the old bookmarks from localStorage as they're no longer needed
		localStorage.removeItem('bookmarks');
	}
}
