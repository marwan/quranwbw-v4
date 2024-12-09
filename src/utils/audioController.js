import { get } from 'svelte/store';
import { quranMetaData } from '$data/quranMeta';
import { __reciter, __translationReciter, __playbackSpeed, __audioSettings, __audioModalVisible, __currentPage, __chapterNumber, __playTranslation, __timestampData } from '$utils/stores';
import { wordsAudioURL } from '$data/websiteSettings';
import { selectableReciters, selectableTranslationReciters, selectablePlaybackSpeeds } from '$data/options';
import { fetchTimestampData } from '$utils/fetchData';
import { scrollSmoothly } from '$utils/scrollSmoothly';

// Getting the audio element
let audio = document.querySelector('#player');
const audioSettings = get(__audioSettings);

// Function to play verse audio, either one time, or multiple times
export async function playVerseAudio(props) {
	resetAudioSettings();
	const [playChapter, playVerse] = props.key.split(':').map(Number);

	await fetchTimestampData(playChapter);

	const reciterAudioUrl = props.language === 'arabic' ? selectableReciters[get(__reciter)].url : selectableTranslationReciters[get(__translationReciter)].url;

	const currentVerseFileName = `${String(playChapter).padStart(3, '0')}${String(playVerse).padStart(3, '0')}.mp3`;

	// Prefetch the next verse audio
	fetch(`${reciterAudioUrl}/${String(playChapter).padStart(3, '0')}${String(playVerse + 1).padStart(3, '0')}.mp3`);

	audio.src = `${reciterAudioUrl}/${currentVerseFileName}`;
	audio.currentTime = 0;
	audio.load();
	audio.playbackRate = selectablePlaybackSpeeds[get(__playbackSpeed)].speed;
	audio.play();

	audioSettings.isPlaying = true;
	audioSettings.playingKey = props.key;
	audioSettings.audioType = 'verse';

	// Attach word highlighting function for supported reciters
	if (props.language === 'arabic' && selectableReciters[get(__reciter)].timestampSlug) {
		audio.addEventListener('timeupdate', wordHighlighter);
	}

	// Scroll to the playing verse
	if (props.language === 'arabic') {
		try {
			scrollSmoothly(document.getElementById(`${audioSettings.playingKey}`).offsetTop - 75, 500);
		} catch (error) {
			// Handle the error if necessary
		}
	}

	audio.onended = async function () {
		audio.removeEventListener('timeupdate', wordHighlighter);
		const previousLanguage = props.language;

		if (get(__playTranslation) && previousLanguage === 'arabic') {
			return playVerseAudio({ key: `${props.key}`, timesToRepeat: +props.timesToRepeat, language: 'translation' });
		}

		if (audioSettings.timesRepeated <= audioSettings.timesToRepeat - 2) {
			console.log('repeating verse: ', `${props.key}`);
			audioSettings.timesRepeated++;
			return playVerseAudio({ key: `${props.key}`, timesToRepeat: +props.timesToRepeat, language: 'arabic' });
		}

		audioSettings.timesRepeated = 0;

		if (window.versesToPlayArray?.length > 0) {
			const index = window.versesToPlayArray.indexOf(audioSettings.playingKey);
			if (index > -1) window.versesToPlayArray.splice(index, 1);

			if (window.versesToPlayArray.length > 0) {
				return playVerseAudio({ key: `${window.versesToPlayArray[0]}`, timesToRepeat: +props.timesToRepeat, language: 'arabic' });
			}
		}

		resetAudioSettings({ location: 'end' });
	};

	__audioSettings.set(audioSettings);
}

// Function to play word audio
export function playWordAudio(props) {
	resetAudioSettings();
	const [wordChapter, wordVerse, wordNumber] = props.key.split(':').map(Number);

	const currentWordFileName = `${wordChapter}/${String(wordChapter).padStart(3, '0')}_${String(wordVerse).padStart(3, '0')}_${String(wordNumber).padStart(3, '0')}.mp3`;

	audio.src = `${wordsAudioURL}/${currentWordFileName}?version=2`;
	audio.currentTime = 0;
	audio.load();
	audio.playbackRate = selectablePlaybackSpeeds[get(__playbackSpeed)].speed;
	audio.play();

	audioSettings.isPlaying = true;
	audioSettings.audioType = 'word';
	audioSettings.playingKey = `${wordChapter}:${wordVerse}`;
	audioSettings.playingWordKey = `${props.key}`;

	audio.onended = function () {
		if (props.playAllWords && wordNumber < getWordsInVerse(audioSettings.playingKey)) {
			return playWordAudio({ key: `${wordChapter}:${wordVerse}:${wordNumber + 1}`, playAllWords: true });
		}
		resetAudioSettings({ location: 'end' });
	};

	__audioSettings.set(audioSettings);
}

// Function to update audio settings
export function updateAudioSettings(event) {
	const { id, value, valueAsNumber } = event.target;
	try {
		switch (id) {
			case 'startVerse':
				audioSettings.startVerse = +value;
				break;
			case 'endVerse':
				audioSettings.endVerse = +value;
				break;
			case 'timesToRepeat':
				audioSettings.timesToRepeat = valueAsNumber;
				break;
		}
	} catch (error) {
		console.error(error);
	}

	if (audioSettings.endVerse < audioSettings.startVerse || audioSettings.endVerse === undefined) {
		audioSettings.endVerse = audioSettings.startVerse;
	}

	__audioSettings.set(audioSettings);
}

// Initialize audio settings based on key
export function initializeAudioSettings(key) {
	audioSettings.playingKey = key;
	[audioSettings.playingChapter, audioSettings.playingVerse] = key.split(':').map(Number);
	__audioSettings.set(audioSettings);

	const chapterTotalVerses = quranMetaData[audioSettings.playingChapter].verses;

	audioSettings.startVerse = audioSettings.playingVerse;

	if (audioSettings.endVerse > chapterTotalVerses) {
		audioSettings.endVerse = chapterTotalVerses;
	}
	if (audioSettings.endVerse < audioSettings.startVerse) {
		audioSettings.endVerse = audioSettings.startVerse;
	}

	audioSettings.audioType = audioSettings.audioType ?? 'verse';
	audioSettings.audioRange = audioSettings.audioRange ?? 'playThisVerse';
}

// Reset audio settings
export function resetAudioSettings(props) {
	try {
		if (audio === null) audio = document.querySelector('#player');

		audio.pause();
		audio.currentTime = 0;
		audioSettings.isPlaying = false;
		audioSettings.playingWordKey = null;

		if (props?.location === 'end') {
			audioSettings.timesRepeated = 0;
			audioSettings.timesToRepeat = 1;
			window.versesToPlayArray = [];
		}

		__audioSettings.set(audioSettings);
		audio.removeEventListener('timeupdate', wordHighlighter);

		document.querySelectorAll('.word').forEach((element) => {
			element.classList.remove('bg-black/5');
		});
	} catch (error) {
		console.log(error);
	}
}

// Show audio modal with key
export function showAudioModal(key) {
	resetAudioSettings();
	initializeAudioSettings(key);
	__audioModalVisible.set(true);
}

// Word audio controller
export function wordAudioController(props) {
	const timestampSlug = selectableReciters[get(__reciter)].timestampSlug;

	if (audioSettings.isPlaying && audioSettings.audioType === 'verse' && timestampSlug) {
		const verseTimestamp = get(__timestampData).data[`${props.chapter}:${props.verse}`][timestampSlug];
		const wordTimestamp = verseTimestamp.split('|')[props.key.split(':')[2]];

		return (audio.currentTime = wordTimestamp);
	}

	props.type === 'end' ? showAudioModal(`${props.chapter}:${props.verse}`) : playWordAudio({ key: props.key });
}

// Highlight words during audio playback based on timestamps
function wordHighlighter() {
	try {
		// Get the total number of words in the verse
		const wordsInVerse = getWordsInVerse(audioSettings.playingKey);

		// Retrieve verse timestamp data fetched in playVerseAudio function
		const timestampSlug = selectableReciters[get(__reciter)].timestampSlug;
		const verseTimestamp = get(__timestampData).data[audioSettings.playingKey][timestampSlug];

		// Loop through all the words to highlight them
		for (let word = 0; word < wordsInVerse; word++) {
			const wordTimestamp = verseTimestamp.split('|')[word];

			// If the word timestamp is lower than the current audio time, update playingWordKey
			if (wordTimestamp < audio.currentTime) {
				audioSettings.playingWordKey = `${audioSettings.playingKey}:${word + 1}`;
			}
		}

		// Update the audio settings
		__audioSettings.set(audioSettings);
	} catch (error) {
		// Error handling
		console.error('wordHighlighter error:', error);
	}
}

// Generate an array of verses to play
export function setVersesToPlay(props) {
	window.versesToPlayArray = [];

	// Handle play action based on the current page and options
	if (props?.allVersesOnPage) {
		if (get(__currentPage) === 'mushaf') {
			// For mushaf page
			const wordsOnPage = document.getElementsByClassName('word');
			for (const wordElement of wordsOnPage) {
				const verseKey = `${wordElement.id.split(':')[0]}:${wordElement.id.split(':')[1]}`;
				if (!window.versesToPlayArray.includes(verseKey)) {
					window.versesToPlayArray.push(verseKey);
				}
			}
		} else if (get(__currentPage) === 'chapter') {
			// For chapter page
			const versesOnPage = document.getElementsByClassName('verse');
			const startVerse = Number(versesOnPage[0].id.split(':')[1]);
			const endVerse = quranMetaData[get(__chapterNumber)].verses;

			for (let verse = startVerse; verse <= endVerse; verse++) {
				const verseKey = `${get(__chapterNumber)}:${verse}`;
				if (!window.versesToPlayArray.includes(verseKey)) {
					window.versesToPlayArray.push(verseKey);
				}
			}
		} else {
			// For other pages (supplications, bookmarks)
			const versesOnPage = document.getElementsByClassName('verse');
			for (const verseElement of versesOnPage) {
				const verseKey = verseElement.id;
				if (!window.versesToPlayArray.includes(verseKey)) {
					window.versesToPlayArray.push(verseKey);
				}
			}
		}
	} else {
		// Handle play action from verse options/modal
		if (get(__currentPage) === 'mushaf' && props.audioRange === 'playFromHere') {
			// For playFromHere, non-chapter page
			const key = `${props.chapter}:${props.startVerse}`;
			const wordsOnPage = document.getElementsByClassName('word');

			for (const wordElement of wordsOnPage) {
				const verseKey = `${wordElement.id.split(':')[0]}:${wordElement.id.split(':')[1]}`;
				if (!window.versesToPlayArray.includes(verseKey)) {
					window.versesToPlayArray.push(verseKey);
				}
			}

			// Remove all verses before the specified key
			const startIndex = window.versesToPlayArray.indexOf(key);
			window.versesToPlayArray = window.versesToPlayArray.slice(startIndex);
		} else {
			// For chapter page, supplications, bookmarks
			for (let verse = props.startVerse; verse <= props.endVerse; verse++) {
				const verseKey = `${props.chapter}:${verse}`;
				if (!window.versesToPlayArray.includes(verseKey)) {
					window.versesToPlayArray.push(verseKey);
				}
			}
		}
	}
	console.log('versesToPlayArray', window.versesToPlayArray);
}

// Get the total number of words in the verse based on the current mode
function getWordsInVerse(key) {
	const isMushafPage = get(__currentPage) === 'mushaf';
	const [chapter, verse] = key.split(':');

	if (isMushafPage) {
		const pageData = JSON.parse(localStorage.getItem('pageData'));
		return Number(pageData[key].meta.words);
	} else {
		const wordData = document.querySelector(`.verse-${chapter}-${verse}`).dataset.words;
		return Number(wordData);
	}
}
