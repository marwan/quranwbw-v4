import { getTailwindBreakpoint } from '$utils/getTailwindBreakpoint';
import { __quranNavigationModalVisible, __quranNavigationDrawerHidden } from '$utils/stores';

export function toggleQuranNavigation(action) {
	if (action === 'show') {
		// sm size - drawer
		if (getTailwindBreakpoint() === 'default') {
			__quranNavigationDrawerHidden.set(false);
		}

		// md and above - modal
		else if (getTailwindBreakpoint() !== 'default') {
			__quranNavigationModalVisible.set(true);
		}
	} else if (action === 'hide') hideAll();

	// hide all
	function hideAll() {
		__quranNavigationDrawerHidden.set(false);
		__quranNavigationDrawerHidden.set(true);
		__quranNavigationModalVisible.set(true);
		__quranNavigationModalVisible.set(false);
	}
}
