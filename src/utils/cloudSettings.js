import { get } from 'svelte/store';
import { __websiteOnline, __userToken, __userSettings } from '$utils/stores';
import { apiEndpoint } from '$data/websiteSettings';
import { updateSettings } from '$utils/updateSettings';

// download user's settings from cloud
export async function downloadSettingsFromCloud() {
	// basic checks
	if (!get(__websiteOnline)) return;
	if (get(__userToken) === null) return;

	const response = await fetch(`${apiEndpoint}/user/settings`, {
		method: 'GET',
		headers: {
			'user-token': get(__userToken)
		}
	});

	const responseJSON = await response.json();

	if (responseJSON.code === 200) {
		updateSettings({ type: 'userBookmarks', key: responseJSON.data[0].user_settings.userBookmarks, overide: true });
		updateSettings({ type: 'userNotes', key: responseJSON.data[0].user_settings.userNotes, overide: true });
		console.log('settings have been downloaded from cloud.');
	} else {
		console.error('error downloading settings from cloud.');
	}

	return responseJSON;
}

// upload user's settings to cloud
export async function uploadSettingsToCloud() {
	// basic checks
	if (!get(__websiteOnline)) return;
	if (get(__userToken) === null) return;

	const response = await fetch(`${apiEndpoint}/user/settings`, {
		method: 'POST',
		headers: {
			'user-token': get(__userToken),
			'Content-Type': 'application/json'
		},
		body: get(__userSettings)
	});

	const responseJSON = await response.json();

	if (responseJSON.code === 200) console.log('settings have been uploaded to cloud.');
	else console.error('error uploading settings to cloud.');

	return responseJSON;
}
