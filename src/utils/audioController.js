import { get } from 'svelte/store';
import { quranMetaData } from '$data/quranMeta';
import { __displayType, __reciter, __playbackSpeed, __audioSettings } from '$utils/stores';
import { toggleModal } from '$utils/toggleModal';
import { wordsAudioURL } from '$data/websiteSettings';
import { displayOptions, selectableReciters, selectablePlaybackSpeeds } from '$data/options';
import { scrollSmoothly } from '$utils/scrollSmoothly';

// getting the audio element
let audio = document.querySelector('#player');

// set global audio settings
const audioSettings = get(__audioSettings);

let verseTranslationPlayed = false;

let nextToPlay;

// to be moved to drawer/settings
audioSettings.playTranslation = false;

// function to play word or verse audio, either one time, or multiple
export function playAudio(props) {
	// we will first reset all audio settings
	resetAudioSettings();

	// making the file name and getting the repeat times from localStorage
	if (props.type === 'word') {
		// generate mp3 file names for current word
		const currentWordFileName = `${props.chapter}/${`00${props.chapter}`.slice(-3)}_${`00${props.verse}`.slice(-3)}_${`00${props.firstToPlay}`.slice(-3)}.mp3`;

		// assign to source
		audio.src = `${wordsAudioURL}/${currentWordFileName}`;

		// update the playing key
		audioSettings.playingKey = `${props.chapter}:${props.verse}`;
		audioSettings.playingWordKey = `${props.chapter}:${props.verse}:${props.firstToPlay}`;
	}

	// making the file name and getting the repeat times from localStorage
	else if (props.type === 'verse') {
		// get the reciter URL from selectableReciters
		let reciterAudioUrl = selectableReciters[get(__reciter)].url;

		// or if the user has opted to play the translation after arabic audio, the URL would have to be updated
		if (props.playTranslation === true) reciterAudioUrl = 'https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/';

		// generate mp3 file names for current and next verse
		const currentVerseFileName = `${`00${props.chapter}`.slice(-3)}${`00${props.firstToPlay}`.slice(-3)}.mp3`;
		const nextVerseFileName = `${`00${props.chapter}`.slice(-3)}${`00${props.firstToPlay + 1}`.slice(-3)}.mp3`;

		// fetch the next verse audio in advance
		fetch(`${reciterAudioUrl}/${nextVerseFileName}`);

		// assign to source
		audio.src = `${reciterAudioUrl}/${currentVerseFileName}`;

		// update the playing key
		audioSettings.playingKey = `${props.chapter}:${props.firstToPlay}`;
	}

	// load and play the audio
	audio.currentTime = 0;
	audio.load();
	audio.playbackRate = selectablePlaybackSpeeds[get(__playbackSpeed)].speed;
	audio.play();

	// update the audio settings
	audioSettings.audioType = props.type;
	audioSettings.isPlaying = true;

	// attach the word highlighter function
	if (props.type === 'verse' && props.playTranslation !== true) {
		audio.addEventListener('timeupdate', wordHighlighter);
		scrollSmoothly(document.getElementById(`${audioSettings.playingKey}`).offsetTop - 100, 500);
	}

	// things to do when the audio has ended
	audio.onended = function () {
		// detach the word highlighter function
		audio.removeEventListener('timeupdate', wordHighlighter);

		// play verse translation after arabic audio if opted by the user
		if (audioSettings.playTranslation === true) {
			if (verseTranslationPlayed === false) {
				verseTranslationPlayed = true;

				return playAudio({
					type: props.type,
					chapter: +props.chapter,
					verse: +props.verse,
					firstToPlay: +props.firstToPlay,
					lastToPlay: +props.lastToPlay,
					timesToRepeat: +props.timesToRepeat,
					delay: +props.delay,
					playTranslation: true
				});
			}
		}

		// repeating the audio if 'timesToRepeat' is more than 1
		// for some reason, audio always repeats timesToPlay + 2 times hence need to do: timesToPlay - 2
		if (audioSettings.timesRepeated <= props.timesToRepeat - 2) {
			return setTimeout(function () {
				audioSettings.timesRepeated++;

				playAudio({
					type: props.type,
					chapter: +props.chapter,
					verse: +props.verse,
					firstToPlay: +props.firstToPlay,
					lastToPlay: +props.lastToPlay,
					timesToRepeat: +props.timesToRepeat,
					delay: +props.delay
				});
			}, props.delay);
		}

		audioSettings.timesRepeated = 0;

		// if type is word, then next to play shall be word+1, else will be verse+1
		nextToPlay = props.firstToPlay + 1;

		// if the next word/verse to play is less than or equal to the last word/verse to play
		if (nextToPlay <= props.lastToPlay) {
			verseTranslationPlayed = false;

			return playAudio({
				type: props.type,
				chapter: +props.chapter,
				verse: +props.verse,
				firstToPlay: +nextToPlay,
				lastToPlay: +props.lastToPlay,
				timesToRepeat: +props.timesToRepeat,
				delay: +props.delay
			});
		}

		// once everything is done, reset settings
		resetAudioSettings();
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

	// play this verse
	if (document.getElementById('playThisVerse').checked === true) {
		audioSettings.startVerse = audioSettings.playingVerse;
		audioSettings.endVerse = audioSettings.playingVerse;
	}

	// play from here
	if (document.getElementById('playFromHere').checked === true) {
		audioSettings.startVerse = audioSettings.playingVerse;
		audioSettings.endVerse = quranMetaData[audioSettings.playingChapter].verses;
	}

	__audioSettings.set(audioSettings);

	playAudio({
		type: audioSettings.audioType === undefined ? 'verse' : audioSettings.audioType,
		chapter: audioSettings.playingChapter,
		verse: audioSettings.startVerse,
		firstToPlay: audioSettings.audioType === 'word' ? 1 : audioSettings.startVerse,
		lastToPlay: audioSettings.audioType === 'word' ? wordsInVerse : audioSettings.endVerse,
		timesToRepeat: audioSettings.timesToRepeat,
		delay: audioSettings.delay
	});

	toggleModal('audio-modal', 'hide');
}

export function updateAudioSettings(event) {
	const chapterTotalVerses = quranMetaData[audioSettings.playingChapter].verses;

	// 1. update values based on clicked ID
	try {
		switch (event.target.id) {
			case 'playVerse':
				// WIP...
				audioSettings.audioType = 'verse';
				break;

			case 'playWord':
				// WIP...
				audioSettings.audioType = 'word';
				break;

			case 'playThisVerse':
				audioSettings.audioRange = event.target.id;
				audioSettings.startVerse = audioSettings.playingVerse;
				audioSettings.endVerse = audioSettings.playingVerse;
				break;

			case 'playFromHere':
				audioSettings.audioRange = event.target.id;
				audioSettings.startVerse = audioSettings.playingVerse;
				audioSettings.endVerse = chapterTotalVerses;
				break;

			case 'playRange':
				audioSettings.audioRange = event.target.id;
				break;

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
	}

	// making sure endVerse is not less than startVerse
	if (audioSettings.endVerse < audioSettings.startVerse || audioSettings.endVerse === undefined) {
		audioSettings.endVerse = audioSettings.startVerse;
	}

	// 3. update the global audio settings
	__audioSettings.set(audioSettings);

	// console.table(audioSettings);
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

export function resetAudioSettings() {
	audio.pause();
	audio.currentTime = 0;
	audioSettings.isPlaying = false;
	audioSettings.playingWordKey = null;

	__audioSettings.set(audioSettings);

	// remove word highlight
	document.querySelectorAll('.word').forEach((element) => {
		element.classList.remove('bg-[#ebebeb]');
	});
}

export function showAudioModal(key) {
	// reset audio settings
	resetAudioSettings();

	// update default settings, if any
	initializeAudioSettings(key);

	// show the modal
	toggleModal('audio-modal', 'show');
}

export function wordAudioController(props) {
	// if verse audio is already playing, a set the verse audio timestamp same as word timestamp
	// ...this is incase the user would like to start from a certain section of the verse
	if (audioSettings.isPlaying === true && audioSettings.audioType === 'verse') {
		// set the verse audio time same as word timestamp
		return (audio.currentTime = document.getElementById(`${props.chapter}:${props.verse}:${props.word + 1}`).getAttribute('data-timestamp'));
	}

	// show audio modal for continuous display types
	if (displayOptions[`${get(__displayType)}`].continuous === true) {
		showAudioModal(`${props.chapter}:${props.verse}`);
	}

	// play word audio directly for non-continuous display types
	else {
		playAudio({
			type: 'word',
			chapter: props.chapter,
			verse: props.verse,
			firstToPlay: props.word + 1,
			lastToPlay: props.word + 1,
			timesToRepeat: 1,
			delay: 0
		});
	}
}

// function to quickly play verse audio, to be used by the play buttons
export function quickPlayAudio(chapter, startVerse, endVerse) {
	if (audioSettings.isPlaying === true) {
		resetAudioSettings();
	} else {
		playAudio({
			type: 'verse',
			chapter: chapter,
			verse: 1,
			firstToPlay: startVerse,
			lastToPlay: endVerse,
			timesToRepeat: 1,
			delay: 0
		});
	}
}

function wordHighlighter() {
	// get the total number of words in the ayah
	const wordsInVerse = document.getElementById(audioSettings.playingKey).getAttribute('data-words');

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
}

// function convertTime(time) {
//   let mins = Math.floor(time / 60);
//   let secs = Math.floor(time % 60);

//   if (mins < 10) {
//     mins = "0" + String(mins);
//   }

//   if (secs < 10) {
//     secs = "0" + String(secs);
//   }

//   return mins + ":" + secs;
// }

// // Countdown
// audio.addEventListener(
//   "timeupdate",
//   function () {
//     let duration = parseInt(audio.duration),
//       currentTime = parseInt(audio.currentTime),
//       timeLeft = duration - currentTime,
//       seconds,
//       minutes;

//     seconds = timeLeft % 60;
//     minutes = Math.floor(timeLeft / 60) % 60;

//     seconds = seconds < 10 ? "0" + seconds : seconds;
//     minutes = minutes < 10 ? "0" + minutes : minutes;

//     // timeleft.innerHTML = m + ":" + s;

//     // $("#audio-time-remaining").text(`${minutes}:${seconds}`);
//     $("#audio-time-remaining").text(convertTime(audio.duration));

//     // console.log(minutes + ":" + seconds);

//     let percentageCompleted = ((audio.currentTime / audio.duration) * 100).toFixed(2);

//     $(".audio-progress-bar").attr("style", `width: ${percentageCompleted}%`);
//   },
//   false
// );

// // Countup
// audio.addEventListener(
//   "timeupdate",
//   function () {
//     let timeline = document.getElementById("duration");
//     let seconds = parseInt(audio.currentTime % 60);
//     let minutes = parseInt((audio.currentTime / 60) % 60);

//     seconds < 10 ? $("#audio-time-lapsed").text(`${minutes}:0${seconds}`) : $("#audio-time-lapsed").text(`${minutes}:${seconds}`);
//   },
//   false
// );
