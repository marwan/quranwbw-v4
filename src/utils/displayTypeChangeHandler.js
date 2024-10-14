import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { __currentPage, __lastRead } from '$utils/stores';
import { updateSettings } from '$utils/updateSettings';

export function displayTypeChangeHandler(displayId) {
	// non-mushaf modes
	if ([1, 2, 3, 4, 5, 7].includes(displayId)) {
		if (get(__currentPage) === 'page') {
			const firstWordKey = document.getElementsByClassName('word')[0].id;
			const chapter = firstWordKey.split(':')[0];
			const verse = firstWordKey.split(':')[1];
			goto(`/${chapter}/${verse}`);
		}

		updateSettings({ type: 'displayType', value: displayId });
	}

	// mushaf mode
	else if ([6].includes(displayId)) {
		goto(`/page/${get(__lastRead).page}`);
	}
}
