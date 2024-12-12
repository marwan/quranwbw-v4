import { updateSettings } from '$utils/updateSettings';
import { __userBookmarks, __userNotes, __lastRead } from '$utils/stores';
import { setUserSettings, defaultSettings } from '$src/hooks.client';
import { get } from 'svelte/store';

export function resetSettings() {
	const userBookmarks = get(__userBookmarks);
	const userNotes = get(__userNotes);
	const lastRead = get(__lastRead);

	// Remove current settings from localStorage and set new ones
	localStorage.removeItem('userSettings');
	setUserSettings(defaultSettings);

	// Restore important data
	updateSettings({ type: 'userBookmarks', key: userBookmarks, override: true, set: true });
	updateSettings({ type: 'userNotes', key: userNotes, override: true });
	updateSettings({ type: 'lastRead', value: lastRead });

	// Reload the page
	location.reload();
}
