import { updateSettings } from '$utils/updateSettings';
import { __userBookmarks, __userNotes, __lastRead } from '$utils/stores';
import { setUserSettings } from '$src/hooks.client';
import { get } from 'svelte/store';

export function resetSettings() {
	const currentUserBookmarks = get(__userBookmarks);
	const currentUserNotes = get(__userNotes);
	const currentLastRead = get(__lastRead);

	// remove current settings from localStorage and set new one
	localStorage.removeItem('userSettings');
	setUserSettings();

	// restore important data
	updateSettings({ type: 'userBookmarks', key: currentUserBookmarks, overide: true, set: true });
	updateSettings({ type: 'userNotes', key: currentUserNotes, overide: true });
	updateSettings({ type: 'lastRead', value: currentLastRead });

	// reload the page
	location.reload();
}
