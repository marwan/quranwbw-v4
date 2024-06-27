/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import { get } from 'svelte/store';
import { quranMetaData } from '$data/quranMeta';
import { __reciter, __playbackSpeed, __audioSettings, __audioModalVisible, __currentPage, __chapterNumber, __chapterData, __playTranslation } from '$utils/stores';
import { wordsAudioURL } from '$data/websiteSettings';
import { selectableReciters, selectablePlaybackSpeeds } from '$data/options';
import { scrollSmoothly } from '$utils/scrollSmoothly';

// getting the audio element
let audio = document.querySelector('#player');

// set global audio settings
const audioSettings = get(__audioSettings);

// let nextToPlay;

// function to play word or verse audio, either one time, or multiple
export function playVerseAudio(props) {
	// we will first reset all audio settings
	// resetAudioSettings();

	const playChapter = +props.key.split(':')[0];
	const playVerse = +props.key.split(':')[1];

	// get the reciter URL from selectableReciters
	let reciterAudioUrl;

	if (props.language === 'arabic') reciterAudioUrl = selectableReciters[get(__reciter)].url;
	// or if the user has opted to play the translation after arabic audio, the URL would have to be updated
	if (props.language === 'translation') reciterAudioUrl = 'https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/';

	// generate mp3 file names for current and next verse
	const currentVerseFileName = `${`00${playChapter}`.slice(-3)}${`00${playVerse}`.slice(-3)}.mp3`;

	// fetch the next verse audio in advance
	fetch(`${reciterAudioUrl}/${`00${playChapter}`.slice(-3)}${`00${playVerse + 1}`.slice(-3)}.mp3`);

	// assign to source
	audio.src = `${reciterAudioUrl}/${currentVerseFileName}`;

	// update the playing key
	audioSettings.playingKey = props.key;

	// load and play the audio
	audio.currentTime = 0;
	audio.load();
	audio.playbackRate = selectablePlaybackSpeeds[get(__playbackSpeed)].speed;
	audio.play();

	// update the audio settings
	audioSettings.isPlaying = true;

	console.log('playing', props.language, `${props.key}`);

	// attach the word highlighter function only for Arabic audio
	if (props.language === 'arabic') {
		if (selectableReciters[get(__reciter)].id === 10) audio.addEventListener('timeupdate', wordHighlighter);

		try {
			scrollSmoothly(document.getElementById(`${audioSettings.playingKey}`).offsetTop - 200, 500);
		} catch (error) {
			// ...
		}
	}

	// things to do when the audio has ended
	audio.onended = function () {
		// detach the word highlighter function
		audio.removeEventListener('timeupdate', wordHighlighter);

		const previousLanguage = props.language;

		// play verse translation is the previous language prop = arabic
		if (get(__playTranslation) && previousLanguage === 'arabic') {
			resetAudioSettings();

			// console.log('playing translation: ', `${props.key}`);
			return playVerseAudio({
				key: `${props.key}`,
				timesToRepeat: +props.timesToRepeat,
				language: 'translation'
			});
		}

		// repeating the audio if 'timesToRepeat' is more than 1
		// for some reason, audio always repeats timesToPlay + 2 times hence need to do: timesToPlay - 2
		if (audioSettings.timesRepeated <= audioSettings.timesToRepeat - 2) {
			resetAudioSettings();

			audioSettings.timesRepeated++;
			console.log('repeating verse: ', `${props.key}`);
			return playVerseAudio({
				key: `${props.key}`,
				timesToRepeat: +props.timesToRepeat,
				language: 'arabic'
			});
		}

		audioSettings.timesRepeated = 0;

		// if we have verses in the versesToPlay array, play those...
		if (window.versesToPlayArray && window.versesToPlayArray.length > 0) {
			const index = window.versesToPlayArray.indexOf(audioSettings.playingKey);

			// reset timesRepeated
			audioSettings.timesRepeated = 0;

			// remove the current verse
			if (index > -1) window.versesToPlayArray.splice(index, 1);

			// play the first verse in array
			if (window.versesToPlayArray.length > 0) {
				resetAudioSettings();

				// console.log('playing verse: ', `${window.versesToPlayArray[0]}`);
				return playVerseAudio({
					key: `${window.versesToPlayArray[0]}`,
					timesToRepeat: +props.timesToRepeat,
					language: 'arabic'
				});
			}
		}

		// once everything is done, reset settings
		resetAudioSettings({ location: 'end' });
	};

	// update the audio settings
	__audioSettings.set(audioSettings);
}

export function initializeAudio() {
	let wordsInVerse = 1;

	try {
		wordsInVerse = document.getElementById(`${audioSettings.playingChapter}:${audioSettings.startVerse}`).getAttribute('data-words');
	} catch (error) {
		// ...
	}

	resetAudioSettings();

	// if (audioSettings.audioType) playVerse(window.versesToPlayArray[0]);

	// // play this verse
	// if (audioSettings.audioRange === 'playThisVerse') {
	// 	audioSettings.startVerse = audioSettings.playingVerse;
	// 	audioSettings.endVerse = audioSettings.playingVerse;
	// }

	// // play from here
	// if (audioSettings.audioRange === 'playFromHere') {
	// 	audioSettings.startVerse = audioSettings.playingVerse;
	// 	audioSettings.endVerse = quranMetaData[audioSettings.playingChapter].verses;
	// }

	// __audioSettings.set(audioSettings);

	playVerseAudio({
		// type: audioSettings.audioType === undefined ? 'verse' : audioSettings.audioType,
		chapter: audioSettings.playingChapter,
		verse: audioSettings.startVerse,
		// firstToPlay: audioSettings.audioType === 'word' ? 1 : audioSettings.startVerse,
		// lastToPlay: audioSettings.audioType === 'word' ? wordsInVerse : audioSettings.endVerse,
		timesToRepeat: audioSettings.timesToRepeat
		// delay: audioSettings.delay
	});

	__audioModalVisible.set(false);
}

export function updateAudioSettings(event) {
	// 1. update values based on clicked ID
	try {
		switch (event.target.id) {
			// case 'playVerse':
			// 	audioSettings.audioType = 'verse';
			// 	break;

			// case 'playWord':
			// 	audioSettings.audioType = 'word';
			// 	break;

			// case 'playTranslation':
			// 	audioSettings.playTranslation = true;
			// 	break;

			case 'startVerse':
				audioSettings.startVerse = +event.target.value;
				break;

			case 'endVerse':
				audioSettings.endVerse = +event.target.value;
				break;

			case 'timesToRepeat':
				audioSettings.timesToRepeat = event.target.valueAsNumber;
				break;
		}
	} catch (error) {
		// ...
		console.error(error);
	}

	// making sure endVerse is not less than startVerse
	if (audioSettings.endVerse < audioSettings.startVerse || audioSettings.endVerse === undefined) {
		audioSettings.endVerse = audioSettings.startVerse;
	}

	// 3. update the global audio settings
	__audioSettings.set(audioSettings);
}

export function initializeAudioSettings(key) {
	// update the key, chapter, verse and update the store
	audioSettings.playingKey = key;
	audioSettings.playingChapter = +audioSettings.playingKey.split(':')[0];
	audioSettings.playingVerse = +audioSettings.playingKey.split(':')[1];
	__audioSettings.set(audioSettings);

	const chapterTotalVerses = quranMetaData[audioSettings.playingChapter].verses;

	// update the startVerse to be same as playingVerse on modal load only, not everytime the audio setting changes
	if (audioSettings.startVerse > audioSettings.playingVerse) {
		audioSettings.startVerse = audioSettings.playingVerse;
	}

	audioSettings.startVerse = audioSettings.playingVerse;

	if (audioSettings.endVerse > chapterTotalVerses) {
		audioSettings.endVerse = chapterTotalVerses;
	}

	if (audioSettings.endVerse < audioSettings.startVerse) {
		audioSettings.endVerse = audioSettings.startVerse;
	}

	// set default audio type to verse
	if (audioSettings.audioType !== 'verse') {
		audioSettings.audioType = 'verse';
	}

	// set default audio range to playThisVerse
	if (audioSettings.audioRange === undefined) {
		audioSettings.audioRange = 'playThisVerse';
	}
}

export function resetAudioSettings(props) {
	audio.pause();
	audio.currentTime = 0;
	audioSettings.isPlaying = false;
	audioSettings.playingWordKey = null;

	// if the reset function is called from the end of playVerseAudio function
	// because we have 1 at the start and 1 at the end
	if (props && props.location === 'end') {
		audioSettings.timesRepeated = 0;
		audioSettings.timesToRepeat = 1;
		window.versesToPlayArray = [];
	}

	__audioSettings.set(audioSettings);

	audio.removeEventListener('timeupdate', wordHighlighter);

	// remove word highlight
	document.querySelectorAll('.word').forEach((element) => {
		element.classList.remove('bg-lightGray');
	});
}

export function showAudioModal(key) {
	// reset audio settings
	resetAudioSettings();

	// update default settings, if any
	initializeAudioSettings(key);

	// show the modal
	__audioModalVisible.set(true);
}

export function wordAudioController(props) {
	const wordKey = `${props.chapter}:${props.verse}:${props.word + 1}`;

	// if verse audio is already playing, then set the verse's audio timestamp same as word timestamp
	// ...this is incase the user would like to start from a certain section of the verse
	if (audioSettings.isPlaying && audioSettings.audioType === 'verse') {
		// set the verse audio time same as word timestamp
		return (audio.currentTime = document.getElementById(wordKey).getAttribute('data-timestamp'));
	}

	// audio modal only when the end icon is clicked, else play word audio directly
	props.type === 'end' ? showAudioModal(`${props.chapter}:${props.verse}`) : playWord(wordKey);
}

// function to quickly play verse audio, to be used by the play buttons
// export function quickplayVerseAudio(chapter, startVerse, endVerse) {
// 	if (audioSettings.isPlaying) {
// 		resetAudioSettings();
// 	} else {
// 		playVerseAudio({
// 			type: 'verse',
// 			chapter: chapter,
// 			verse: 1,
// 			firstToPlay: startVerse,
// 			lastToPlay: endVerse,
// 			timesToRepeat: 1,
// 			delay: 0
// 		});
// 	}
// }

// mini function to quickly play a verse
// export function playVerse(verseKey) {
// 	const chapter = +verseKey.split(':')[0];
// 	const verse = +verseKey.split(':')[1];

// 	console.log('playing ', verseKey, window.versesToPlayArray);

// 	playVerseAudio({
// 		type: 'verse',
// 		chapter: chapter,
// 		verse: verse,
// 		timesToRepeat: 1,
// 		delay: 0
// 	});
// }

// mini function to quickly play a word
export function playWord(wordKey) {
	const chapter = +wordKey.split(':')[0];
	const verse = +wordKey.split(':')[1];
	const word = +wordKey.split(':')[2];

	playVerseAudio({
		type: 'word',
		chapter: chapter,
		verse: verse,
		firstToPlay: word,
		lastToPlay: word,
		timesToRepeat: 1,
		delay: 0
	});
}

function wordHighlighter() {
	try {
		// for mushaf mode, we have the JSON data in localStorage, and for other pages we have it set in the store __chapterData
		const data = get(__currentPage) === 'page' ? JSON.parse(localStorage.getItem('pageData')) : get(__chapterData);

		// get the total number of words in the ayah
		const wordsInVerse = data[audioSettings.playingKey].meta.words;

		// loop through all the words
		for (let word = 0; word <= wordsInVerse - 1; word++) {
			// get the current word's timestamp
			const wordTimestamp = document.getElementById(`${audioSettings.playingKey}:${word + 1}`).getAttribute('data-timestamp');

			// as long as the word timestamp is lower than the current audio time
			if (wordTimestamp < audio.currentTime) {
				audioSettings.playingWordKey = `${audioSettings.playingKey}:${word + 1}`;
			}
		}

		// update the audio settings
		__audioSettings.set(audioSettings);
	} catch (error) {
		// console.log('wordHighlighter error: ', error);
	}
}

// function to generate an array of verses to play
export function setVersesToPlay(props) {
	window.versesToPlayArray = [];

	// for when the play was clicked from bottom toolbar
	if (props && props.location === 'bottomToolbar') {
		// mushaf page
		if (get(__currentPage) === 'page') {
			const wordsOnPage = document.getElementsByClassName('word');

			for (let word = 0; word <= wordsOnPage.length - 1; word++) {
				const verseKey = `${wordsOnPage[word].id.split(':')[0]}:${wordsOnPage[word].id.split(':')[1]}`;
				window.versesToPlayArray.indexOf(verseKey) === -1 && window.versesToPlayArray.push(verseKey);
			}
		}

		// chapter page, supp, bookmarks
		else if (get(__currentPage) === 'chapter') {
			const versesOnPage = document.getElementsByClassName('verse');
			const startVerse = versesOnPage[1].id.split(':')[1];
			const endVerse = quranMetaData[get(__chapterNumber)].verses;

			for (let verse = startVerse; verse <= endVerse; verse++) {
				const verseKey = `${get(__chapterNumber)}:${verse}`;
				window.versesToPlayArray.indexOf(verseKey) === -1 && window.versesToPlayArray.push(verseKey);
			}
		}

		// other pages (supplications, bookmarks)
		else {
			const versesOnPage = document.getElementsByClassName('verse');

			for (let verse = 0; verse <= versesOnPage.length - 1; verse++) {
				const verseKey = versesOnPage[verse].id;
				window.versesToPlayArray.indexOf(verseKey) === -1 && window.versesToPlayArray.push(verseKey);
			}
		}
	}

	// for when the play was clicked from verse options / modal
	else if (props && props.location === 'verseOptionsOrModal') {
		// for playFromHere, non chapter page
		if (get(__currentPage) === 'page' && props.audioRange === 'playFromHere') {
			// WIP...
			// const key = `${props.chapter}:${props.startVerse}`;
			// console.log(key);
		}

		// chapter page, supp, bookmarks
		else {
			for (let verse = props.startVerse; verse <= props.endVerse; verse++) {
				const verseKey = `${props.chapter}:${verse}`;
				window.versesToPlayArray.indexOf(verseKey) === -1 && window.versesToPlayArray.push(verseKey);
			}
		}
	}

	// console.log('versesToPlayArray', window.versesToPlayArray);
}
