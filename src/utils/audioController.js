import { get } from "svelte/store";
import { currentPlayingKeyStore, audioSettingsStore, audioPlayingStore } from "$utils/stores";
import { toggleModal } from "$utils/toggleModal";
import { wordsAudioURL } from "$utils/websiteSettings";

// getting the audio element
window.audio = document.querySelector("#player");

// set global audio settings
// window.audioSettings = {};
// let audioSettings = {};
const audioSettings = get(audioSettingsStore);

// set to false by default
audioSettings.timesRepeated = 0;

let nextToPlay;

// function to play word or verse audio, either one time, or multiple
export function playAudio(props) {
  // we will first reset all audio settings
  resetAudioSettings();

  const verse = props.firstToPlay;

  // making the file name and getting the repeat times from localStorage
  if (props.type === "word") {
    // generate mp3 file names for current word
    const fileName = `${props.chapter}/${`00${props.chapter}`.slice(-3)}_${`00${props.verse}`.slice(-3)}_${`00${props.word}`.slice(-3)}.mp3`;

    // assign to source
    audio.src = `${wordsAudioURL}/${fileName}`;
  }

  // making the file name and getting the repeat times from localStorage
  else if (props.type === "verse") {
    // get the reciter url from selectableReciters
    const reciterAudioUrl = "https://everyayah.com/data/Alafasy_128kbps/";

    // generate mp3 file names for current and next verse
    const currentVerseFileName = `${`00${props.chapter}`.slice(-3)}${`00${verse}`.slice(-3)}.mp3`;

    // assign to source
    audio.src = `${reciterAudioUrl}/${currentVerseFileName}`;
  }

  // load and play the audio
  audio.currentTime = 0;
  audio.load();
  audio.play();

  // set the audio type
  audioSettings.audioType = props.type;

  // set to true
  audioPlayingStore.set(true);

  // update the key
  currentPlayingKeyStore.set(`${props.chapter}:${verse}`);

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
          chapter: props.chapter,
          firstToPlay: props.firstToPlay,
          lastToPlay: props.lastToPlay,
          timesToRepeat: props.timesToRepeat,
          delay: props.delay,
        });
      }, props.delay);
    }

    // if type is word, then next to play shall be word+1, else will be verse+1
    props.type === "word" ? (nextToPlay = props.firstToPlay + 1) : (nextToPlay = verse + 1);

    audioSettings.timesRepeated = 0;

    // if the next word/verse to play is less than or equal to the last word/verse to play
    if (nextToPlay <= props.lastToPlay) {
      return playAudio({
        type: props.type,
        chapter: props.chapter,
        firstToPlay: nextToPlay,
        lastToPlay: props.lastToPlay,
        timesToRepeat: props.timesToRepeat,
        delay: props.delay,
      });
    }

    // once everything is done, reset settings
    resetAudioSettings();
  };
}

export function initializeAudio() {
  resetAudioSettings();

  console.log(audioSettings);

  playAudio({
    type: "verse",
    chapter: +get(currentPlayingKeyStore).split(":")[0],
    firstToPlay: audioSettings.startVerse,
    lastToPlay: audioSettings.endVerse,
    timesToRepeat: 1,
    delay: 0,
  });

  toggleModal("audioModal", "hide");
}

export function resetAudioSettings() {
  // reset
  audio.pause();
  audio.currentTime = 0;

  // set to false
  audioPlayingStore.set(false);
}

export function showAudioModal(key) {
  currentPlayingKeyStore.set(key);
  resetAudioSettings();
  toggleModal("audioModal", "show");
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
