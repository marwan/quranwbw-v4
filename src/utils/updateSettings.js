/* eslint-disable no-case-declarations */
import { get } from 'svelte/store';
import {
	__currentPage,
	__userSettings,
	__fontType,
	__displayType,
	__websiteTheme,
	__wordTranslation,
	__verseTranslations,
	__wordTranslationEnabled,
	__wordTransliterationEnabled,
	__reciter,
	__translationReciter,
	__playbackSpeed,
	__playTranslation,
	__lastRead,
	__wordTooltip,
	__userBookmarks,
	__autoScrollSpeed,
	__wakeLockEnabled,
	__userNotes,
	__quizCorrectAnswers,
	__quizWrongAnswers,
	__englishTerminology,
	__hideNonDuaPart
} from '$utils/stores';
import { selectableVerseTranslations } from '$data/options';
// import { uploadSettingsToCloud } from '$utils/cloudSettings';

// function to update website settings
export function updateSettings(props) {
	// get the settings from localStorage
	const userSettings = JSON.parse(localStorage.getItem('userSettings'));
	// let uploadSettings = false;

	switch (props.type) {
		// for chapter number
		case 'chapter':
			userSettings.chapter = props.value;
			break;

		// for font types
		case 'fontType':
			__fontType.set(props.value);
			if (props.skipSave) return;
			userSettings.displaySettings.fontType = props.value;
			break;

		// for display types
		case 'displayType':
			__displayType.set(props.value);
			if (props.skipSave) return;
			userSettings.displaySettings.displayType = props.value;
			break;

		// for word tooltip
		case 'wordTooltip':
			__wordTooltip.set(props.value);
			userSettings.displaySettings.wordTooltip = props.value;
			break;

		// for terminologies language
		case 'englishTerminology':
			__englishTerminology.set(props.value);
			userSettings.displaySettings.englishTerminology = props.value;
			location.reload();
			break;

		// for website theme
		case 'websiteTheme':
			__websiteTheme.set(props.value);
			userSettings.displaySettings.websiteTheme = props.value;
			document.documentElement.classList = '';
			document.documentElement.classList = `theme-${props.value} ${window.bodyColors[props.value]}`;
			break;

		// for word translation view
		case 'wordTranslationEnabled':
			__wordTranslationEnabled.set(props.value);
			userSettings.displaySettings.wordTranslationEnabled = props.value;
			break;

		// for word transliteration view
		case 'wordTransliterationEnabled':
			__wordTransliterationEnabled.set(props.value);
			userSettings.displaySettings.wordTransliterationEnabled = props.value;
			break;

		// for word translation
		case 'wordTranslation':
			__wordTranslation.set(props.value);
			userSettings.translations.word = props.value;
			break;

		// for verse translations
		case 'verseTranslation':
			let verseTranslationsArray = [];

			// loop through all the available verse translations
			for (const key of Object.keys(selectableVerseTranslations)) {
				const translationID = selectableVerseTranslations[key].resource_id;
				try {
					// we check if this translation is checked, if true, push to array
					if (document.getElementById(`verseTranslationCheckbox-${translationID}`).checked) {
						verseTranslationsArray.push(translationID);
					}
				} catch (error) {
					console.error(error);
				}
			}

			// if the value is an array
			if (props.value instanceof Array) verseTranslationsArray = props.value;

			__verseTranslations.set(verseTranslationsArray);
			userSettings.translations.verse = verseTranslationsArray;
			break;

		// for verse reciter
		case 'reciter':
			__reciter.set(props.value);
			userSettings.audioSettings.reciter = props.value;
			break;

		// for translation reciter
		case 'translationReciter':
			__translationReciter.set(props.value);
			userSettings.audioSettings.translationReciter = props.value;
			break;

		// for playback speed
		case 'playbackSpeed':
			__playbackSpeed.set(props.value);
			userSettings.audioSettings.playbackSpeed = props.value;
			break;

		// for play translation toggle
		case 'playTranslation':
			__playTranslation.set(props.value);
			userSettings.audioSettings.playTranslation = props.value;
			break;

		// for Initial Setup
		case 'initialSetupCompleted':
			userSettings.initialSetupCompleted = props.value;
			break;

		case 'userBookmarks':
			const key = props.key;
			let userBookmarks = userSettings['userBookmarks'];

			// if overide key was set, then just set the value key in localStorage
			if (props.overide) {
				userSettings.userBookmarks = key;
			}

			// else just set what was provided as key invidually post validation
			else {
				// for old imports, only push if bookmark doesn't exist
				if (props.oldCheck) {
					if (!userBookmarks.includes(key)) userBookmarks.push(key);
				}

				// for existing bookmarks...
				// if the bookmark (key) already exists, then remove it, else add it
				else userBookmarks.includes(key) ? (userBookmarks = userBookmarks.filter((x) => x !== key)) : userBookmarks.push(key);

				// update the bookmarks
				userSettings.userBookmarks = userBookmarks;
			}

			__userBookmarks.set(userBookmarks);

			// upload settings to cloud on every update
			// if (props.set === true) uploadSettings = true;
			break;

		case 'userNotes':
			const value = props.value;
			const notes_key = props.key;
			const isWhitespaceString = (str) => !str.replace(/\s/g, '').length;
			let userNotes = userSettings['userNotes'];

			// if overide key was set, then just set the value key in localStorage
			if (props.overide) {
				userSettings.userNotes = notes_key;
			}

			// else just set what was provided as key invidually post validation
			else {
				// we only save the note if it's not just only whitespace
				if (!isWhitespaceString(value)) {
					userNotes[notes_key] = {
						note: value,
						modified_at: new Date().toISOString()
					};
				} else if (value.length === 0) {
					if (Object.prototype.hasOwnProperty.call(userNotes, notes_key)) delete userNotes[notes_key];
				}

				// update the notes
				userSettings.userNotes = userNotes;
			}

			__userNotes.set(userNotes);

			// upload settings to cloud on every update
			// if (props.set === true) uploadSettings = true;
			break;

		// for last read
		case 'lastRead':
			if (['chapter', 'page'].includes(get(__currentPage))) {
				__lastRead.set(props.value);
				userSettings.lastRead = props.value;
			}
			break;

		// for auto scroll
		case 'autoScrollSpeed':
			__autoScrollSpeed.set(props.value);
			userSettings.displaySettings.autoScrollSpeed = props.value;
			break;

		// for toggling wakeLock
		case 'wakeLockEnabled':
			__wakeLockEnabled.set(props.value);
			userSettings.displaySettings.wakeLockEnabled = props.value;
			break;

		// for toggling non-dua words
		case 'hideNonDuaPart':
			__hideNonDuaPart.set(props.value);
			userSettings.displaySettings.hideNonDuaPart = props.value;
			break;

		// for quiz correct answers
		case 'quizCorrectAnswers':
			__quizCorrectAnswers.set(props.value);
			userSettings.quiz.correctAnswers = props.value;
			break;

		// for quiz wrong answers
		case 'quizWrongAnswers':
			__quizWrongAnswers.set(props.value);
			userSettings.quiz.wrongAnswers = props.value;
			break;

		// for increasing/decreasing font sizes
		case 'arabicText': // Arabic words
		case 'wordTranslationText': // word translations & transliterations
		case 'verseTranslationText': // verse translations & transliterations
			// based upon Tailwind CSS
			const fontSizePresets = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl'];

			// change the font size for each 'element'
			document.querySelectorAll(`.${props.type}`).forEach((element) => {
				const currentSize = element.getAttribute('data-fontSize');
				const currentIndex = fontSizePresets.indexOf(currentSize);

				// set the new index and size
				const newIndex = props.action === 'increase' ? currentIndex + 1 : currentIndex - 1;
				let newSize = fontSizePresets[newIndex];

				// perform the action
				if (newSize !== undefined) {
					// if font value/size was provided in props, use that
					if (props.value !== undefined) newSize = props.value;

					// remove the current class
					element.classList.remove(currentSize);

					// add the new class
					element.classList.add(newSize);

					// update the attribute
					element.setAttribute('data-fontSize', newSize);

					// update it in localSettings
					userSettings.displaySettings.fontSizes[`${props.type}`] = newSize;
				}
			});

			break;
	}

	// update the settings back into localStorage and global store
	__userSettings.set(JSON.stringify(userSettings));
	localStorage.setItem('userSettings', JSON.stringify(userSettings));

	// upload settings to cloud if uploadSettings was set to true, which we only do for bookmarks and notes at the moment
	// if (uploadSettings === true) uploadSettingsToCloud();
}
