import { get } from 'svelte/store';
import { __mushafMinimalModeEnabled, __topNavbarVisible, __bottomToolbarVisible } from '$utils/stores';

// function to toggle top navbar and bottom toolbar for minimal mode
export function toggleMushafMinimalMode() {
	if (!get(__mushafMinimalModeEnabled)) {
		__mushafMinimalModeEnabled.set(true);
		__topNavbarVisible.set(false);
		__bottomToolbarVisible.set(false);
	} else {
		__mushafMinimalModeEnabled.set(false);
		__topNavbarVisible.set(true);
		__bottomToolbarVisible.set(true);
	}
}
