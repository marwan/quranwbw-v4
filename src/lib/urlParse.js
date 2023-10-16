import { quranMetaData } from "./quranMeta";

// function to parse the URL to get the starting and ending verses
export function urlParse(chapter) {
  let startVerse, endVerse;

  let chapterTotalVerses = quranMetaData[chapter].verses;

  let url = window.location.pathname;
  let urlSplit = url.split("/");
  let urlSlashesCount = urlSplit.length - 1;

  // eg: /2 or if there are more than two slashes
  if (urlSlashesCount === 1 || urlSlashesCount > 2) {
    (startVerse = 1), (endVerse = chapterTotalVerses);
  }

  // eg: /2/255 or /2/255-256
  else if (urlSlashesCount === 2) {
    let secondPartHyphenSplit = urlSplit[2].split("-");
    let secondPartHyphenSplitCount = secondPartHyphenSplit.length - 1;

    // eg: /2/255
    if (secondPartHyphenSplitCount === 0) {
      (startVerse = urlSplit[2]), (endVerse = urlSplit[2]);
    }

    // eg: /2/255-256
    else if (secondPartHyphenSplitCount === 1) {
      (startVerse = secondPartHyphenSplit[0]), (endVerse = secondPartHyphenSplit[1]);
    }

    // all other possibilites
    else (startVerse = 1), (endVerse = chapterTotalVerses);
  }

  // making sure the verses are between 1 and max chapter verses
  if (startVerse < 1) startVerse = 1;
  if (endVerse > chapterTotalVerses) endVerse = chapterTotalVerses;

  // making sure the start verse is not higher than the ending verse
  if (startVerse > endVerse) startVerse = endVerse;

  return [Number(startVerse), Number(endVerse)];
}
