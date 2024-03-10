import { get } from "svelte/store";
import { quranMetaData } from "$data/quranMeta";
import { displayTypeStore, reciterStore, playbackSpeedStore, audioSettingsStore } from "$utils/stores";
import { toggleModal } from "$utils/toggleModal";
import { wordsAudioURL } from "$utils/websiteSettings";
import { displayOptions, selectableReciters, selectablePlaybackSpeeds } from "$data/options";

// getting the audio element
window.audio = document.querySelector("#player");

// set global audio settings
// window.audioSettings = {};
// let audioSettings = {};
const audioSettings = get(audioSettingsStore);

// const chapterTotalVerses = quranMetaData[audioSettings.playingChapter].verses;

let nextToPlay;

// function to play word or verse audio, either one time, or multiple
export function playAudio(props) {
  // we will first reset all audio settings
  resetAudioSettings();

  // making the file name and getting the repeat times from localStorage
  if (props.type === "word") {
    // generate mp3 file names for current word
    const fileName = `${props.chapter}/${`00${props.chapter}`.slice(-3)}_${`00${props.verse}`.slice(-3)}_${`00${props.firstToPlay}`.slice(-3)}.mp3`;

    // assign to source
    audio.src = `${wordsAudioURL}/${fileName}`;

    // update the playing key
    audioSettings.playingKey = `${props.chapter}:${props.verse}`;
    audioSettings.playingWordKey = `${props.chapter}:${props.verse}:${props.firstToPlay}`;

    console.log(audioSettings.playingWordKey);
  }

  // making the file name and getting the repeat times from localStorage
  else if (props.type === "verse") {
    // get the reciter url from selectableReciters
    const reciterAudioUrl = selectableReciters[get(reciterStore)].url;

    // generate mp3 file names for current and next verse
    const currentVerseFileName = `${`00${props.chapter}`.slice(-3)}${`00${props.firstToPlay}`.slice(-3)}.mp3`;

    // assign to source
    audio.src = `${reciterAudioUrl}/${currentVerseFileName}`;

    // update the playing key
    audioSettings.playingKey = `${props.chapter}:${props.firstToPlay}`;
  }

  // load and play the audio
  audio.currentTime = 0;
  audio.load();
  audio.playbackRate = selectablePlaybackSpeeds[get(playbackSpeedStore)].speed;
  audio.play();

  // update the audio settings
  audioSettings.audioType = props.type;
  audioSettings.isPlaying = true;

  // attach the word highlighter function
  if (props.type === "verse") {
    audio.addEventListener("timeupdate", wordHighlighter);
  }

  // scroll to the top of the verse
  // window.scrollTo(window.scrollX, document.getElementById(`${chapter}:${verse}`).getBoundingClientRect().top - 50);
  // things to do when the audio has ended
  audio.onended = function () {
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
          delay: +props.delay,
        });
      }, props.delay);
    }

    // if type is word, then next to play shall be word+1, else will be verse+1
    nextToPlay = props.firstToPlay + 1;

    audioSettings.timesRepeated = 0;

    // if the next word/verse to play is less than or equal to the last word/verse to play
    if (nextToPlay <= props.lastToPlay) {
      return playAudio({
        type: props.type,
        chapter: +props.chapter,
        verse: +props.verse,
        firstToPlay: +nextToPlay,
        lastToPlay: +props.lastToPlay,
        timesToRepeat: +props.timesToRepeat,
        delay: +props.delay,
      });
    }

    // detach the word highlighter function
    audio.removeEventListener("timeupdate", wordHighlighter);

    // once everything is done, reset settings
    resetAudioSettings();
  };

  // update the audio settings
  audioSettingsStore.set(audioSettings);
}

export function initializeAudio() {
  const wordsInVerse = document.getElementById(`${audioSettings.playingChapter}:${audioSettings.startVerse}`).getAttribute("data-words");

  resetAudioSettings();

  // play this verse
  if (document.getElementById("playThisVerse").checked === true) {
    audioSettings.startVerse = audioSettings.playingVerse;
    audioSettings.endVerse = audioSettings.playingVerse;
  }

  // play from here
  if (document.getElementById("playFromHere").checked === true) {
    audioSettings.startVerse = audioSettings.playingVerse;
    audioSettings.endVerse = quranMetaData[audioSettings.playingChapter].verses;
  }

  audioSettingsStore.set(audioSettings);

  playAudio({
    type: audioSettings.audioType === undefined ? "verse" : audioSettings.audioType,
    chapter: audioSettings.playingChapter,
    verse: audioSettings.startVerse,
    firstToPlay: audioSettings.audioType === "word" ? 1 : audioSettings.startVerse,
    lastToPlay: audioSettings.audioType === "word" ? wordsInVerse : audioSettings.endVerse,
    timesToRepeat: audioSettings.timesToRepeat,
    delay: audioSettings.delay,
  });

  toggleModal("audioModal", "hide");
}

export function updateAudioSettings(event) {
  const chapterTotalVerses = quranMetaData[audioSettings.playingChapter].verses;

  // 1. update values based on clicked ID
  try {
    switch (event.target.id) {
      case "playVerse":
        // WIP...
        audioSettings.audioType = "verse";
        break;

      case "playWord":
        // WIP...
        audioSettings.audioType = "word";
        break;

      case "playThisVerse":
        audioSettings.audioRange = event.target.id;
        audioSettings.startVerse = audioSettings.playingVerse;
        audioSettings.endVerse = audioSettings.playingVerse;
        break;

      case "playFromHere":
        audioSettings.audioRange = event.target.id;
        audioSettings.startVerse = audioSettings.playingVerse;
        audioSettings.endVerse = chapterTotalVerses;
        break;

      case "playRange":
        audioSettings.audioRange = event.target.id;
        break;

      case "startVerse":
        audioSettings.startVerse = +event.target.value;
        break;

      case "endVerse":
        audioSettings.endVerse = +event.target.value;
        break;

      case "timesToRepeat":
        audioSettings.timesToRepeat = event.target.valueAsNumber;
        break;
    }
  } catch (error) {}

  // making sure endVerse is not less than startVerse
  if (audioSettings.endVerse < audioSettings.startVerse || audioSettings.endVerse === undefined) {
    audioSettings.endVerse = audioSettings.startVerse;
  }

  // 3. update the global audio settings
  audioSettingsStore.set(audioSettings);

  // console.table(audioSettings);
}

export function initializeAudioSettings(key) {
  // update the key, chapter, verse and update the store
  audioSettings.playingKey = key;
  audioSettings.playingChapter = +audioSettings.playingKey.split(":")[0];
  audioSettings.playingVerse = +audioSettings.playingKey.split(":")[1];
  audioSettingsStore.set(audioSettings);

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
  if (audioSettings.audioType === undefined) {
    audioSettings.audioType = "verse";
  }
}

export function resetAudioSettings() {
  audio.pause();
  audio.currentTime = 0;
  audioSettings.isPlaying = false;
  audioSettingsStore.set(audioSettings);

  // remove word highlight
  document.querySelectorAll(".word").forEach((element) => {
    element.classList.remove("bg-[#ebebeb]");
  });
}

export function showAudioModal(key) {
  // reset audio settings
  resetAudioSettings();

  // update default settings, if any
  initializeAudioSettings(key);

  // show the modal
  toggleModal("audioModal", "show");
}

export function wordAudioController(props) {
  // show audio modal for continuous display types
  if (displayOptions[`${get(displayTypeStore)}`].continuous === true) {
    showAudioModal(`${props.chapter}:${props.verse}`);
  }

  // play word audio directly for non-continuous display types
  else {
    playAudio({
      type: "word",
      chapter: props.chapter,
      verse: props.verse,
      firstToPlay: props.word + 1,
      lastToPlay: props.word + 1,
      timesToRepeat: 1,
      delay: 0,
    });
  }
}

function wordHighlighter() {
  // get the total number of words in the ayah
  const wordsInVerse = document.getElementById(audioSettings.playingKey).getAttribute("data-words");

  // loop through all the words
  for (let word = 0; word <= wordsInVerse - 1; word++) {
    // get the current word's timestamp
    const wordTimestamp = document.getElementById(`${audioSettings.playingKey}:${word + 1}`).getAttribute("data-timestamp");

    // as long as the word timestamp is lower than the current audio time
    if (wordTimestamp < audio.currentTime) {
      audioSettings.playingWordKey = `${audioSettings.playingKey}:${word + 1}`;
    }
  }

  // update the audio settings
  audioSettingsStore.set(audioSettings);
}

function convertTime(time) {
  let mins = Math.floor(time / 60);
  let secs = Math.floor(time % 60);

  if (mins < 10) {
    mins = "0" + String(mins);
  }

  if (secs < 10) {
    secs = "0" + String(secs);
  }

  return mins + ":" + secs;
}

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
