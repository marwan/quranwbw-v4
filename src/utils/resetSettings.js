import { updateSettings } from '$utils/updateSettings';

export function resetSettings() {
	let arabicTextSize;

	// for larger screens, make 4xl the default for arabic word, else make 2xl the default
	if (window.matchMedia('(min-width: 1280px)').matches || window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('(min-width: 768px)').matches) arabicTextSize = 'text-4xl';

	// display settings
	updateSettings({ type: 'websiteTheme', value: 1 });
	updateSettings({ type: 'displayType', value: 1 });
	updateSettings({ type: 'wordTooltip', value: 1 });
	updateSettings({ type: 'wordTranslationEnabled', value: true });
	updateSettings({ type: 'wordTransliterationEnabled', value: true });
	updateSettings({ type: 'wakeLockEnabled', value: false });

	// font type settings
	updateSettings({ type: 'fontType', value: 1 });

	// font size settings
	updateSettings({ type: 'arabicText', value: arabicTextSize });
	updateSettings({ type: 'wordTranslationText', value: 'text-sm' });
	updateSettings({ type: 'verseTranslationText', value: 'text-sm' });

	// translation settings
	updateSettings({ type: 'wordTranslation', value: 1 });
	updateSettings({ type: 'verseTranslation', value: [1, 15] });

	// audio settings
	updateSettings({ type: 'reciter', value: 10 });
	updateSettings({ type: 'playbackSpeed', value: 3 });

	// miscellaneous
	// updateSettings({ type: 'englishTerminology', value: false });
}
